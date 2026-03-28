import { eq } from "drizzle-orm";
import { examTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getExamById = async (
  _parent: unknown,
  args: { examId: string },
  ctx: GraphQLUserContext,
) => {
  return await ctx.db
    .select()
    .from(examTable)
    .where(eq(examTable.id, args.examId));
};
