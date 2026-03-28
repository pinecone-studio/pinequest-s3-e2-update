import { GraphQLUserContext } from "../../../context";
import { testTable } from "../../../../db/schema/testTable";

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

export async function getAllTests(
  _parent: unknown,
  _args: Record<string, never>,
  ctx: GraphQLUserContext,
) {
  const rows = await ctx.db.select().from(testTable);

  return rows.map((row) => ({
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
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
}
