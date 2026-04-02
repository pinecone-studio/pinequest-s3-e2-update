import { inArray } from "drizzle-orm";
import { testTable } from "../../../../db/schema";
import { assertClerkCanAccessQuestionContent } from "../../../../lib/clerk-question-access";
import {
  assertRequestIdsAllowed,
  loadExamContentIds,
  requireExamSession,
} from "../../../../lib/exam-guard";
import { parseTestAnswersCell } from "../../../../lib/exam-scoring";
import { GraphQLUserContext } from "../../../context";

export const getTestsByIds = async (
  _parent: unknown,
  args: { ids: string[] },
  ctx: GraphQLUserContext,
) => {
  const ids =
    args.ids?.filter((x) => typeof x === "string" && x.length > 0) ?? [];
  if (ids.length === 0) return [];

  let stripSecrets = false;

  if (ctx.examSession) {
    const session = requireExamSession(ctx);
    const { testIds } = await loadExamContentIds(ctx, session.examId);
    assertRequestIdsAllowed(ids, testIds, "getTestsByIds");
    stripSecrets = true;
  }

  try {
    const rows = await ctx.db
      .select()
      .from(testTable)
      .where(inArray(testTable.id, ids));

    if (!ctx.examSession) {
      await assertClerkCanAccessQuestionContent(
        ctx,
        rows.map((r) => r.teacherId),
      );
    }

    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is NonNullable<typeof r> => r != null)
      .map((row) => ({
        id: row.id,
        grade: row.grade ?? 0,
        subjectId: row.subjectId ?? "",
        question: row.question,
        answers: parseTestAnswersCell(row.answers),
        imageUrl: row.imageUrl ?? null,
        rightAnswer: stripSecrets ? "" : row.rightAnswer,
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
    if (err instanceof Error && err.message) throw err;
    throw new Error("Failed to get tests.");
  }
};
