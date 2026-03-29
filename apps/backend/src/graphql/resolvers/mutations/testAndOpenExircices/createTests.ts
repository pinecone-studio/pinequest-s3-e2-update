import { GraphQLUserContext } from "../../../context";
import { testTable } from "../../../../db/schema/testTable";

type CreateTestsArgs = {
  grade: number;
  subjectId: string;
  question: string;
  answers: string[];
  imageUrl: string;
  rightAnswer: string;
  difficulty: string;
  score: number;
  usageCount: number;
  notes: string;
  teacherId: string;
};

export const createTests = async (
  _parent: unknown,
  args: { input: CreateTestsArgs },
  ctx: GraphQLUserContext,
) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  try {
    await ctx.db.insert(testTable).values({
      id: id,
      grade: args.input.grade,
      subjectId: args.input.subjectId,
      question: args.input.question,
      answers: args.input.answers,
      imageUrl: args.input.imageUrl,
      rightAnswer: args.input.rightAnswer,
      difficulty: args.input.difficulty,
      score: args.input.score,
      usageCount: args.input.usageCount,
      notes: args.input.notes,
      teacherId: args.input.teacherId,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: id,
      grade: args.input.grade,
      subjectId: args.input.subjectId,
      question: args.input.question,
      answers: args.input.answers,
      imageUrl: args.input.imageUrl,
      rightAnswer: args.input.rightAnswer,
      difficulty: args.input.difficulty,
      score: args.input.score,
      usageCount: args.input.usageCount,
      notes: args.input.notes,
      teacherId: args.input.teacherId,
      createdAt: now,
      updatedAt: now,
    };
  } catch (err) {
    console.error("Failed to create test:", err);
    throw new Error(`Failed to create test: ${err}`);
  }
};
