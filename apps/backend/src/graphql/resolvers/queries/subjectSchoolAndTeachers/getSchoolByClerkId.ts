import { eq } from "drizzle-orm";
import { schoolTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getSchoolByClerkId = async (
  _parent: unknown,
  args: { clerkId: string },
  ctx: GraphQLUserContext,
) => {
  if (!args.clerkId) throw new Error("Cannot find clerkId");
  try {
    return await ctx.db
      .select()
      .from(schoolTable)
      .where(eq(schoolTable.clerkId, args.clerkId));
  } catch (err) {
    console.error("Cannot get school. Error;", err);
    throw new Error("Cannot get school");
  }
};
