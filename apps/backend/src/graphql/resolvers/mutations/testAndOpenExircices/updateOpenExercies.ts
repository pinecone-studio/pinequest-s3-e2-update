import { eq } from "drizzle-orm";
import { openExerciesTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

type UpdateOpenExerciesArgs = {
  id: string;
  subjectId?: string | null;
  grade?: number | null;
  topic?: string | null;
  title?: string | null;
  question?: string | null;
  answer?: string | null;
  imageUrl?: string | null;
  difficulty?: string | null;
  score?: number | null;
  favourite?: boolean | null;
  notes?: string | null;
  teacherId?: string | null;
};

export const updateOpenExercies = async (
  _parent: unknown,
  args: { input: UpdateOpenExerciesArgs },
  ctx: GraphQLUserContext,
) => {
  const id = args.input.id.trim();
  const rows = await ctx.db
    .select()
    .from(openExerciesTable)
    .where(eq(openExerciesTable.id, id));
  const existing = rows[0];
  if (!existing) throw new Error("Open exercise not found.");

  const now = new Date().toISOString();

  await ctx.db
    .update(openExerciesTable)
    .set({
      subjectId: args.input.subjectId ?? existing.subjectId,
      grade: args.input.grade ?? existing.grade,
      topic: args.input.topic ?? existing.topic,
      title: args.input.title ?? existing.title,
      question: args.input.question ?? existing.question,
      answer: args.input.answer ?? existing.answer,
      imageUrl: args.input.imageUrl ?? existing.imageUrl,
      difficulty: args.input.difficulty ?? existing.difficulty,
      score: args.input.score ?? existing.score,
      favourite:
        args.input.favourite === undefined
          ? existing.favourite
          : args.input.favourite
            ? 1
            : 0,
      notes: args.input.notes ?? existing.notes,
      teacherId: args.input.teacherId ?? existing.teacherId,
      updatedAt: now,
    })
    .where(eq(openExerciesTable.id, id));

  const updatedRows = await ctx.db
    .select()
    .from(openExerciesTable)
    .where(eq(openExerciesTable.id, id));
  const updated = updatedRows[0];
  if (!updated) throw new Error("Updated open exercise not found.");

  return {
    id: updated.id,
    subjectId: updated.subjectId,
    grade: updated.grade,
    topic: updated.topic ?? null,
    title: updated.title ?? null,
    question: updated.question ?? null,
    answer: updated.answer ?? null,
    imageUrl: updated.imageUrl ?? null,
    difficulty: updated.difficulty ?? null,
    score: updated.score,
    favourite: Boolean(updated.favourite),
    notes: updated.notes ?? null,
    teacherId: updated.teacherId ?? null,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};
