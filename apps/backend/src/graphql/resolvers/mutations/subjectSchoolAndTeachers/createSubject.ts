import type { GraphQLUserContext } from "../../../context";
import { subjectTable } from "../../../../db/schema/subjectTable";

export async function createSubject(
  _parent: unknown,
  args: { input: { name: string } },
  ctx: GraphQLUserContext,
) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await ctx.db.insert(subjectTable).values({
    id,
    name: args.input.name.trim(),
    createdAt: now,
    updatedAt: now,
  });
  return {
    id,
    name: args.input.name.trim(),
    createdAt: now,
    updatedAt: now,
  };
}
