import { asc } from "drizzle-orm";
import type { GraphQLResolveInfo } from "graphql";
import { subjectTable } from "../../../db/schema";
import type { GraphQLUserContext } from "../../context";

export async function subjects(
  _parent: unknown,
  _args: Record<string, never>,
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  return ctx.db.select().from(subjectTable).orderBy(asc(subjectTable.name));
}
