import { eq } from "drizzle-orm";
import {
  examAllowedClassTable,
  examTable,
  teacherTable,
} from "../../../../db/schema";
import type { GraphQLUserContext } from "../../../context";

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

  const teachers = await ctx.db
    .select()
    .from(teacherTable)
    .where(eq(teacherTable.clerkId, ctx.clerkUserId.trim()));
  const teacher = teachers[0];
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
