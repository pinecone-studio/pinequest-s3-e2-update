import { eq } from "drizzle-orm";
import { testTable } from "../../../../db/schema";
import { requireDbTeacherIdFromClerk } from "../../../../lib/teacher-row-from-clerk";
import { GraphQLUserContext } from "../../../context";

type UpdateTestsArgs = {
  id: string;
  grade?: number | null;
  subjectId?: string | null;
  question?: string | null;
  answers?: string[] | null;
  imageUrl?: string | null;
  rightAnswer?: string | null;
  difficulty?: string | null;
  score?: number | null;
  usageCount?: number | null;
  favourite?: boolean | null;
  notes?: string | null;
  teacherId?: string | null;
};

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

export const updateTests = async (
  _parent: unknown,
  args: { input: UpdateTestsArgs },
  ctx: GraphQLUserContext,
) => {
  const id = args.input.id.trim();
  const rows = await ctx.db.select().from(testTable).where(eq(testTable.id, id));
  const existing = rows[0];
  if (!existing) throw new Error("Test not found.");

  const dbTeacherId = await requireDbTeacherIdFromClerk(ctx);
  const legacyClerkId = ctx.clerkUserId?.trim() ?? "";
  const owns =
    existing.teacherId === dbTeacherId ||
    (legacyClerkId.length > 0 && existing.teacherId === legacyClerkId);
  if (!owns) {
    throw new Error("Энэ асуултыг засах эрхгүй.");
  }

  const now = new Date().toISOString();
  const answers = args.input.answers ?? parseAnswers(existing.answers);

  await ctx.db
    .update(testTable)
    .set({
      grade: args.input.grade ?? existing.grade,
      subjectId: args.input.subjectId ?? existing.subjectId,
      question: args.input.question ?? existing.question,
      answers: JSON.stringify(answers),
      imageUrl: args.input.imageUrl ?? existing.imageUrl,
      rightAnswer: args.input.rightAnswer ?? existing.rightAnswer,
      difficulty: args.input.difficulty ?? existing.difficulty,
      score: args.input.score ?? existing.score,
      usageCount: args.input.usageCount ?? existing.usageCount,
      favourite:
        args.input.favourite === undefined
          ? existing.favourite
          : args.input.favourite
            ? 1
            : 0,
      notes: args.input.notes ?? existing.notes,
      teacherId: dbTeacherId,
      updatedAt: now,
    })
    .where(eq(testTable.id, id));

  const updatedRows = await ctx.db.select().from(testTable).where(eq(testTable.id, id));
  const updated = updatedRows[0];
  if (!updated) throw new Error("Updated test not found.");

  return {
    id: updated.id,
    grade: updated.grade ?? 0,
    subjectId: updated.subjectId ?? "",
    question: updated.question,
    answers: parseAnswers(updated.answers),
    imageUrl: updated.imageUrl ?? null,
    rightAnswer: updated.rightAnswer,
    difficulty: updated.difficulty,
    score: updated.score,
    usageCount: updated.usageCount ?? 0,
    favourite: Boolean(updated.favourite),
    notes: updated.notes ?? null,
    teacherId: updated.teacherId,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};
