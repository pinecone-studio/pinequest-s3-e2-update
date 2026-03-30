import { subjectTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

export const getAllSubject = async (
  _parent: unknown,
  args: unknown,
  ctx: GraphQLUserContext,
) => {
  return await ctx.db.select().from(subjectTable);
};
