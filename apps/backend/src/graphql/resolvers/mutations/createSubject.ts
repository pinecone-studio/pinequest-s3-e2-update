import type { GraphQLResolveInfo } from "graphql";
import { subjectTable } from "../../../db/schema";
import type { GraphQLUserContext } from "../../context";

export async function createSubject(
  _parent: unknown,
  args: { name: string },
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await ctx.db.insert(subjectTable).values({
    id,
    name: args.name.trim(),
    createdAt: now,
    updatedAt: now,
  });
  return {
    id,
    name: args.name.trim(),
    createdAt: now,
    updatedAt: now,
  };
}
