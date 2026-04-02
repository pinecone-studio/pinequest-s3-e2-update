import { and, eq, isNull, or, sql } from "drizzle-orm";
import {
  examAllowedClassTable,
  examTable,
  teacherTable,
} from "../../../../db/schema";
import type { GraphQLUserContext } from "../../../context";
import { clerkPrimaryEmail } from "../../../../lib/clerk-primary-email";

async function ensureLinkedTeacher(ctx: GraphQLUserContext) {
  const clerkUserId = ctx.clerkUserId?.trim() ?? "";
  if (!clerkUserId) return null;

  const existing = await ctx.db
    .select()
    .from(teacherTable)
    .where(eq(teacherTable.clerkId, clerkUserId))
    .limit(1);
  if (existing[0]) return existing[0];

  const email = await clerkPrimaryEmail(clerkUserId, ctx.env);
  const normalized = (email ?? "").trim().toLowerCase();
  if (!normalized) return null;

  const candidates = await ctx.db
    .select()
    .from(teacherTable)
    .where(
      and(
        sql`lower(trim(${teacherTable.email})) = ${normalized}`,
        or(
          isNull(teacherTable.clerkId),
          eq(teacherTable.clerkId, ""),
          eq(teacherTable.clerkId, clerkUserId),
        ),
      ),
    )
    .limit(2);
  if (candidates.length === 0) return null;

  const pending = candidates.filter((r) => r.clerkId == null || r.clerkId === "");
  if (pending.length > 1) {
    throw new Error("Ижил и-мэйлээр олон урьсан багш байна. Админаас засварлуулна уу.");
  }
  const row = pending[0] ?? candidates[0]!;
  if (row.clerkId && row.clerkId === clerkUserId) return row;

  const now = new Date().toISOString();
  await ctx.db
    .update(teacherTable)
    .set({ clerkId: clerkUserId, updatedAt: now })
    .where(eq(teacherTable.id, row.id));

  return { ...row, clerkId: clerkUserId, updatedAt: now };
}

/**
 * Багш шалгалтаа тодорхой ангиудад нээх (D1). Илгээсэн анги бүрээр сурагчид studentExamAuth хийнэ.
 */
export const addExamAllowedClasses = async (
  _parent: unknown,
  args: { examId: string; classIds: string[] },
  ctx: GraphQLUserContext,
) => {
  if (!ctx.clerkUserId?.trim()) {
    throw new Error("Багшийн нэвтрэлт шаардлагатай.");
  }

  const teacher = await ensureLinkedTeacher(ctx);
  if (!teacher) {
    throw new Error("Багшийн бүртгэл олдсонгүй (Clerk link хийгээгүй байж магадгүй).");
  }

  const examId = args.examId?.trim();
  if (!examId) throw new Error("examId хоосон байна.");

  const exams = await ctx.db.select().from(examTable).where(eq(examTable.id, examId));
  const exam = exams[0];
  if (!exam) throw new Error("Шалгалт олдсонгүй.");
  if (exam.teacherId !== teacher.id) {
    throw new Error("Энэ шалгалтад анги нэмэх эрхгүй.");
  }

  const ids = [
    ...new Set(
      (args.classIds ?? []).map((x) => x.trim()).filter((x) => x.length > 0),
    ),
  ];
  if (ids.length === 0) return true;

  const now = new Date().toISOString();
  for (const classId of ids) {
    await ctx.db
      .insert(examAllowedClassTable)
      .values({ examId, classId, createdAt: now })
      .onConflictDoNothing();
  }
  return true;
};
