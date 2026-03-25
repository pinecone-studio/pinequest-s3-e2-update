import { desc, eq } from "drizzle-orm";
import type { GraphQLResolveInfo } from "graphql";
import { examTable } from "../../../db/schema";
import type { GraphQLUserContext } from "../../context";

export async function exams(
  _parent: unknown,
  _args: Record<string, never>,
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  return ctx.db.select().from(examTable).orderBy(desc(examTable.createdAt));
}

export async function exam(
  _parent: unknown,
  args: { id: string },
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  const rows = await ctx.db
    .select()
    .from(examTable)
    .where(eq(examTable.id, args.id))
    .limit(1);
  return rows[0] ?? null;
}
