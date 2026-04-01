import { eq, inArray } from "drizzle-orm";
import { studentExamResultTable, studentTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getStudentExamResultsByClassId = async (
  _parent: unknown,
  args: { classId: string },
  ctx: GraphQLUserContext,
) => {
  const classId = args.classId?.trim();
  if (!classId) {
    throw new Error("classId is required");
  }
  try {
    const students = await ctx.db
      .select({ id: studentTable.id })
      .from(studentTable)
      .where(eq(studentTable.classId, classId));
    const studentIds = students.map((s) => s.id);
    if (studentIds.length === 0) {
      return [];
    }
    return await ctx.db
      .select()
      .from(studentExamResultTable)
      .where(inArray(studentExamResultTable.studentId, studentIds));
  } catch (err) {
    console.error("getStudentExamResultsByClassId error:", err);
    throw new Error("Cannot load exam results for class");
  }
};
