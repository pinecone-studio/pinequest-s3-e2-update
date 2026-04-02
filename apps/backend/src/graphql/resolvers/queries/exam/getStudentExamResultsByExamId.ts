import { eq } from "drizzle-orm";
import { studentExamResultTable } from "../../../../db/schema";
import { assertExamReadableBySessionOrSchoolAdmin } from "../../../../lib/exam-guard";
import { GraphQLUserContext } from "../../../context";

export const getStudentExamResultsByExamId = async (
  _parent: unknown,
  args: { examId: string },
  ctx: GraphQLUserContext,
) => {
  const examId = args.examId.trim();
  await assertExamReadableBySessionOrSchoolAdmin(ctx, examId);

  try {
    return await ctx.db
      .select()
      .from(studentExamResultTable)
      .where(eq(studentExamResultTable.examId, examId));
  } catch (err) {
    console.error("getStudentExamResultsByExamId error:", err);
    throw new Error("Дүнгийн мэдээлэл уншиж чадсангүй.");
  }
};
