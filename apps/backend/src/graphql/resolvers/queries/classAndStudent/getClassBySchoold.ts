import { eq } from "drizzle-orm";
import { classTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getClassBySchoolId = async (
  _parent: unknown,
  args: { schoolId: string },
  ctx: GraphQLUserContext,
) => {
  if (!args.schoolId) {
    throw new Error("Not the school id.");
  }

  try {
    return await ctx.db
      .select()
      .from(classTable)
      .where(eq(classTable.schoolId, args.schoolId));
  } catch (err) {
    console.error("Failed to get classes:", err);
    throw new Error(`Failed to get classes: ${err}`);
  }
};
