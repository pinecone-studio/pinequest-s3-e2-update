import { eq } from "drizzle-orm";
import { teacherTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getTeachersBySchoolId = async (
  _parent: unknown,
  args: { schoolId: string },
  ctx: GraphQLUserContext,
) => {
  if (!args.schoolId) throw new Error("Missing the schoolId.");
  try {
    return await ctx.db
      .select()
      .from(teacherTable)
      .where(eq(teacherTable.schoolId, args.schoolId));
  } catch (err) {
    console.error("Cannot get teachers: Error:", err);
    throw new Error("Cannot get teachers");
  }
};
