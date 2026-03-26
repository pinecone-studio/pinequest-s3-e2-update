import type { GraphQLResolveInfo } from "graphql";
import { schoolTable } from "../../../db/schema";
import type { GraphQLUserContext } from "../../context";

export async function schools(
  _parent: unknown,
  _args: Record<string, never>,
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  return ctx.db.select().from(schoolTable);
}
