import { eq } from "drizzle-orm";
import type { GraphQLResolveInfo } from "graphql";
import { testTable } from "../../../db/schema";
import type { GraphQLUserContext } from "../../context";
import { mapTestRow, normalizeTestInput, resolveSubject, type TestMutationInput } from "../test-utils";

export async function updateTest(
  _parent: unknown,
  args: { id: string; input: TestMutationInput },
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  const subject = await resolveSubject(ctx, args.input.subjectId);

  if (!subject) {
    throw new Error(`"${args.input.subjectId}" хичээлд тохирох subject олдсонгүй.`);
  }

  const existing = await ctx.db
    .select()
    .from(testTable)
    .where(eq(testTable.id, args.id))
    .limit(1);

  if (!existing[0]) {
    throw new Error("Шинэчлэх асуулт олдсонгүй.");
  }

  const updatedAt = new Date().toISOString();
  const values = normalizeTestInput(args.input, subject.id);

  await ctx.db
    .update(testTable)
    .set({
      ...values,
      updatedAt,
    })
    .where(eq(testTable.id, args.id));

  return mapTestRow({
    ...existing[0],
    ...values,
    updatedAt,
    subjectName: subject.name,
  });
}
