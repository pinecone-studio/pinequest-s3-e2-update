import { and, eq } from "drizzle-orm";
import {
  examAllowedClassTable,
  examTable,
} from "../../../../db/schema";
import { ensureLinkedTeacher } from "../../../../lib/ensure-linked-teacher";
import type { GraphQLUserContext } from "../../../context";

export const startExamMonitoringForClass = async (
  _parent: unknown,
  args: { examId: string; classId: string },
  ctx: GraphQLUserContext,
) => {
  if (!ctx.clerkUserId?.trim()) {
    throw new Error("Багшийн нэвтрэлт шаардлагатай.");
  }

  const teacher = await ensureLinkedTeacher(ctx);
  if (!teacher) {
    throw new Error(
      "Багшийн бүртгэл олдсонгүй (Clerk link хийгээгүй байж магадгүй).",
    );
  }

  const examId = args.examId?.trim();
  const classId = args.classId?.trim();
  if (!examId) throw new Error("examId хоосон байна.");
  if (!classId) throw new Error("classId хоосон байна.");

  const exams = await ctx.db
    .select()
    .from(examTable)
    .where(eq(examTable.id, examId));
  const exam = exams[0];
  if (!exam) throw new Error("Шалгалт олдсонгүй.");

  if (teacher.schoolId !== exam.schoolId) {
    throw new Error("Энэ шалгалт танай сургуулийнх биш.");
  }

  const allowedRows = await ctx.db
    .select()
    .from(examAllowedClassTable)
    .where(
      and(
        eq(examAllowedClassTable.examId, examId),
        eq(examAllowedClassTable.classId, classId),
      ),
    )
    .limit(1);
  if (!allowedRows[0]) {
    throw new Error("Энэ шалгалт тухайн ангид илгээгдээгүй байна.");
  }

  const now = new Date().toISOString();
  await ctx.db
    .update(examAllowedClassTable)
    .set({ sessionStartedAt: now })
    .where(
      and(
        eq(examAllowedClassTable.examId, examId),
        eq(examAllowedClassTable.classId, classId),
      ),
    );

  return { ok: true as const, startedAt: now };
};
