import { openExerciesTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

type OpenExerciesArgs = {
  grade: number;
  subjectId: string;
  topic: string;
  title: string;
  question: string;
  answer: string;
  imageUrl: string;
  difficulty: string;
  score: number;
  notes: string;
  teacherId: string;
};

export const createOpenExercies = async (
  _parent: unknown,
  args: { input: OpenExerciesArgs },
  ctx: GraphQLUserContext,
) => {
  try {
    const id = crypto.randomUUID();
    const date = new Date().toISOString();
    const newOpenExercies = await ctx.db.insert(openExerciesTable).values({
      id,
      grade: args.input.grade,
      subjectId: args.input.subjectId,
      topic: args.input.topic,
      title: args.input.title,
      question: args.input.question,
      answer: args.input.answer,
      imageUrl: args.input.imageUrl,
      difficulty: args.input.difficulty,
      score: args.input.score,
      notes: args.input.notes,
      teacherId: args.input.teacherId,
      createdAt: date,
      updatedAt: date,
    });
    return newOpenExercies;
  } catch (err) {
    console.error("Failed to create open exercies.Error:", err);
    throw new Error("Failed to create open exercies.");
  }
};
