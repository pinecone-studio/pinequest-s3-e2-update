import { inArray } from "drizzle-orm";
import { examTable } from "../../../../db/schema";
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

export const getExamsByIds = async (
  _parent: unknown,
  args: { ids: string[] },
  ctx: GraphQLUserContext,
) => {
  const ids =
    args.ids?.filter((x) => typeof x === "string" && x.length > 0) ?? [];
  if (ids.length === 0) return [];

  try {
    const rows = await ctx.db
      .select()
      .from(examTable)
      .where(inArray(examTable.id, ids));

    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is NonNullable<typeof r> => r != null)
      .map((row) => ({
        ...row,
        testIds: parseIds((row as { testIds?: unknown }).testIds),
        openExerciseIds: parseIds(
          (row as { openExerciseIds?: unknown }).openExerciseIds,
        ),
      }));
  } catch (err) {
    console.error("getExamsByIds error:", err);
    throw new Error("Cannot load exams");
  }
};
