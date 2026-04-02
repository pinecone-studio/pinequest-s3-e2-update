import { inArray } from "drizzle-orm";
import { testTable } from "../../../../db/schema";
import {
  assertRequestIdsAllowed,
  loadExamContentIds,
  requireExamSession,
} from "../../../../lib/exam-guard";
import { GraphQLUserContext } from "../../../context";

function parseAnswers(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return value ? [value] : [];
  }
}

export const getTestsByIds = async (
  _parent: unknown,
  args: { ids: string[] },
  ctx: GraphQLUserContext,
) => {
  const session = requireExamSession(ctx);
  const ids =
    args.ids?.filter((x) => typeof x === "string" && x.length > 0) ?? [];
  if (ids.length === 0) return [];

  const { testIds } = await loadExamContentIds(ctx, session.examId);
  assertRequestIdsAllowed(ids, testIds, "getTestsByIds");

  try {
    const rows = await ctx.db
      .select()
      .from(testTable)
      .where(inArray(testTable.id, ids));

    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is NonNullable<typeof r> => r != null)
      .map((row) => ({
        id: row.id,
        grade: row.grade ?? 0,
        subjectId: row.subjectId ?? "",
        question: row.question,
        answers: parseAnswers(row.answers),
        imageUrl: row.imageUrl ?? null,
        rightAnswer: row.rightAnswer,
        difficulty: row.difficulty,
        score: row.score,
        usageCount: row.usageCount ?? 0,
        notes: row.notes ?? null,
        teacherId: row.teacherId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));
  } catch (err) {
    console.error("Failed to get tests by ids. Error:", err);
    throw new Error("Failed to get tests.");
  }
};
