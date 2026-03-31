import { openExerciesTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";
type CreateOpenExerciesArgs = {
  subjectId: string;
  grade: number;
  topic: string;
  title: string;
  question: string;
  answer?: string | null;
  imageUrl?: string | null;
  difficulty: string;
  score: number;
  notes?: string | null;
  teacherId: string;
};
export const createOpenExercies = async (
  _parent: unknown,
  _args: { input: CreateOpenExerciesArgs },
  ctx: GraphQLUserContext,
) => {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await ctx.db.insert(openExerciesTable).values({
      id: id,
      subjectId: _args.input.subjectId,
      grade: _args.input.grade,
      topic: _args.input.topic,
      title: _args.input.title,
      question: _args.input.question,
      answer: _args.input.answer ?? null,
      imageUrl: _args.input.imageUrl ?? null,
      difficulty: _args.input.difficulty,
      score: _args.input.score,
      notes: _args.input.notes ?? null,
      teacherId: _args.input.teacherId,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: id,
      subjectId: _args.input.subjectId,
      grade: _args.input.grade,
      topic: _args.input.topic,
      title: _args.input.title,
      question: _args.input.question,
      answer: _args.input.answer ?? null,
      imageUrl: _args.input.imageUrl ?? null,
      difficulty: _args.input.difficulty,
      score: _args.input.score,
      notes: _args.input.notes ?? null,
      teacherId: _args.input.teacherId,
      createdAt: now,
      updatedAt: now,
    };
  } catch (err) {
    console.error("Failed to create open exercies:", err);
    throw new Error(`Failed to create open exercies`);
  }
};
