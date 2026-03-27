import type { GraphQLResolveInfo } from "graphql";

import type { GraphQLUserContext } from "../../../context";
import { mapTestRow, normalizeTestInput, resolveSubject, type TestMutationInput } from "../../queries/testAndOpenExircices/test-utils";
import { testTable } from "../../../../db/schema/testTable";

export async function createTest(
  _parent: unknown,
  args: { input: TestMutationInput },
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  const subject: { id: string; name: string } | null = await resolveSubject(ctx, args.input.subjectId) as { id: string; name: string } | null;

  if (!subject) {
    throw new Error(`"${args.input.subjectId}" хичээлд тохирох subject олдсонгүй.`);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const values = normalizeTestInput(args.input, subject.id);

  await ctx.db.insert(testTable).values({
    id,
    ...values,
    createdAt: now,
    updatedAt: now,
  });

  return mapTestRow({
    id,
    ...values,
    createdAt: now,
    updatedAt: now,
    subjectName: subject.name,
  });
}
