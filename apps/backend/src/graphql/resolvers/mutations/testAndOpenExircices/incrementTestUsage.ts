import { eq, inArray } from "drizzle-orm";
import type { GraphQLResolveInfo } from "graphql";
import { testTable } from "../../../../db/schema/testTable";
import type { GraphQLUserContext } from "../../../context";

export async function incrementTestUsage(
  _parent: unknown,
  args: { ids: string[] },
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  const ids = Array.from(new Set(args.ids.map((id) => id.trim()).filter(Boolean)));
  if (ids.length === 0) {
    return 0;
  }

  const rows = await ctx.db
    .select({ id: testTable.id, usageCount: testTable.usageCount })
    .from(testTable)
    .where(inArray(testTable.id, ids));

  await Promise.all(
    rows.map((row) =>
      ctx.db
        .update(testTable)
        .set({
          usageCount: (row.usageCount ?? 0) + 1,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(testTable.id, row.id)),
    ),
  );

  return rows.length;
}
