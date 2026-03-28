import { asc } from "drizzle-orm";
import type { GraphQLResolveInfo } from "graphql";
import { GraphQLUserContext } from "../../../context";
import { subjectTable } from "../../../../db/schema/subjectTable";


export async function getAllSubjects(
  _parent: unknown,
  _args: Record<string, never>,
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  return ctx.db.select().from(subjectTable).orderBy(asc(subjectTable.name));
}
