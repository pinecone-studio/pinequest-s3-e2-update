import { eq } from "drizzle-orm";
import { examTable } from "../../../../db/schema";
import {
  assertExamReadableBySessionOrSchoolAdmin,
} from "../../../../lib/exam-guard";
import { loadAllowedClassIdsByExamIds } from "../../../../lib/exam-allowed-classes";
import { GraphQLUserContext } from "../../../context";

function parseIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x): x is string => typeof x === "string");
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return value ? [value] : [];
  }
}

export const getExamById = async (
  _parent: unknown,
  args: { examId: string },
  ctx: GraphQLUserContext,
) => {
  await assertExamReadableBySessionOrSchoolAdmin(ctx, args.examId);

  const rows = await ctx.db
    .select()
    .from(examTable)
    .where(eq(examTable.id, args.examId.trim()));

  const row = rows[0];
  if (!row) return null;
  const allowedMap = await loadAllowedClassIdsByExamIds(ctx.db, [row.id]);
  return {
    ...row,
    testIds: parseIds((row as any).testIds),
    openExerciseIds: parseIds((row as any).openExerciseIds),
    allowedClassIds: allowedMap.get(row.id) ?? [],
  };
};
