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
    const rows = await ctx.db
      .select()
      .from(schoolTable)
      .where(eq(schoolTable.clerkId, args.clerkId));
    const row = rows[0];
    if (!row) {
      throw new Error("Энэ Clerk бүртгэлд харгалзах сургууль олдсонгүй.");
    }
    return row;
  } catch (err) {
    console.error("Cannot get school. Error;", err);
    if (err instanceof Error && err.message) {
      throw err;
    }
    throw new Error("Cannot get school");
  }
};
