import { eq } from "drizzle-orm";
import { studentTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getStudentByClassId = async (
  _parent: unknown,
  args: { classId: string },
  ctx: GraphQLUserContext,
) => {
  if (!args.classId) throw new Error("Could not found class id");
  try {
    return await ctx.db
      .select()
      .from(studentTable)
      .where(eq(studentTable.classId, args.classId));
  } catch (err) {
    console.error("Cannot get student. Error: ", err);
    throw new Error("Cannot get Student");
  }
};
