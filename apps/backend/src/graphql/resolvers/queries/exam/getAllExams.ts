import { examTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getAllExams = async (
  _parent: unknown,
  args: {},
  ctx: GraphQLUserContext,
) => {
  return await ctx.db.select().from(examTable);
};
