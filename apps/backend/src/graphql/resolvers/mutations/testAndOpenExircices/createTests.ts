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
  teacherId: string;
  usageCount: number;
  notes: string;
};

export const createTests = async (
  _parent: unknown,
  args: { input: CreateTestsArgs },
  ctx: GraphQLUserContext,
) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  try {
    const newTest = await ctx.db.insert(testTable).values({
      id: id,
      grade: args.input.grade,
      subjectId: args.input.subjectId,
      question: args.input.question,
      answers: JSON.stringify(args.input.answers),
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
    return newTest;
  } catch (err) {
    console.error("Failed to create test:", err);
    throw new Error(`Failed to create test: ${err}`);
  }
};
