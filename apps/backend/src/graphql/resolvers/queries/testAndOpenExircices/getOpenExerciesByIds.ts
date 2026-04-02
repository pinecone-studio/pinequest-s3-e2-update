import { inArray } from "drizzle-orm";
import { openExerciesTable } from "../../../../db/schema";
import { assertClerkCanAccessQuestionContent } from "../../../../lib/clerk-question-access";
import {
  assertRequestIdsAllowed,
  loadExamContentIds,
  requireExamSession,
} from "../../../../lib/exam-guard";
import { GraphQLUserContext } from "../../../context";

export const getOpenExerciesByIds = async (
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
    const { openExerciseIds } = await loadExamContentIds(ctx, session.examId);
    assertRequestIdsAllowed(ids, openExerciseIds, "getOpenExerciesByIds");
    stripSecrets = true;
  }

  try {
    const rows = await ctx.db
      .select()
      .from(openExerciesTable)
      .where(inArray(openExerciesTable.id, ids));

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
        subjectId: row.subjectId,
        grade: row.grade,
        topic: row.topic ?? null,
        title: row.title ?? null,
        question: row.question ?? null,
        answer: stripSecrets ? null : row.answer ?? null,
        imageUrl: row.imageUrl ?? null,
        difficulty: row.difficulty ?? null,
        score: row.score,
        notes: row.notes ?? null,
        teacherId: row.teacherId ?? null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));
  } catch (err) {
    console.error("Failed to get open exercises by ids. Error:", err);
    if (err instanceof Error && err.message) throw err;
    throw new Error("Failed to get open exercises.");
  }
};
