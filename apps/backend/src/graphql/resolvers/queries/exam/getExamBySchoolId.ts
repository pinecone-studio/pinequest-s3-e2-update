import { eq } from "drizzle-orm";
import { examTable } from "../../../../db/schema";
import { assertClerkCanAccessSchool } from "../../../../lib/school-admin-guard";
import { loadAllowedClassIdsByExamIds } from "../../../../lib/exam-allowed-classes";
import { GraphQLUserContext } from "../../../context";

function parseIds(value: unknown): string[] {
  if (Array.isArray(value))
    return value.filter((x): x is string => typeof x === "string");
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

export const getExamBySchoolId = async (
  _parent: unknown,
  args: { schoolId: string },
  ctx: GraphQLUserContext,
) => {
  await assertClerkCanAccessSchool(ctx, args.schoolId);

  const rows = await ctx.db
    .select()
    .from(examTable)
    .where(eq(examTable.schoolId, args.schoolId));

  const allowed = await loadAllowedClassIdsByExamIds(
    ctx.db,
    rows.map((r) => r.id),
  );

  return rows.map((row) => ({
    ...row,
    testIds: parseIds((row as any).testIds),
    openExerciseIds: parseIds((row as any).openExerciseIds),
    allowedClassIds: allowed.get(row.id) ?? [],
  }));
};
