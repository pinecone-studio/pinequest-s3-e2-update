import { GraphQLError, type GraphQLResolveInfo } from "graphql";
import { examTable } from "../../../../db/schema/examTable";    
import type { GraphQLUserContext } from "../../../context";

export type ExamChoiceInput = {
  text: string;
};

export type ExamClosedQuestionInput = {
  prompt: string;
  choices: ExamChoiceInput[];
  correctChoiceIndex: number;
};

export type ExamOpenQuestionInput = {
  prompt: string;
};

export type StoredExamChoice = {
  id: string;
  text: string;
};

export type StoredClosedQuestion = {
  id: string;
  prompt: string;
  choices: StoredExamChoice[];
  correctChoiceId: string;
};

export type StoredOpenQuestion = {
  id: string;
  prompt: string;
};

export type CreateExamArgs = {
  notes: string;
  title: string;
  duration: string;
  isActive: number
  variation: string
  testIds: string[];
  openExercises: ExamOpenQuestionInput[];
};

function buildTestsPayload(
  tests: ExamClosedQuestionInput[],
): StoredClosedQuestion[] {
  return tests.map((q, qi) => {
    if (q.choices.length === 0) {
      throw new GraphQLError(
        `tests[${qi}]: дор хаяж нэг сонголт байх ёстой`,
      );
    }
    if (
      !Number.isInteger(q.correctChoiceIndex) ||
      q.correctChoiceIndex < 0 ||
      q.correctChoiceIndex >= q.choices.length
    ) {
      throw new GraphQLError(
        `tests[${qi}]: correctChoiceIndex нь 0–${q.choices.length - 1} хооронд байх ёстой`,
      );
    }

    const choices: StoredExamChoice[] = q.choices.map((c) => ({
      id: crypto.randomUUID(),
      text: c.text,
    }));

    return {
      id: crypto.randomUUID(),
      prompt: q.prompt,
      choices,
      correctChoiceId: choices[q.correctChoiceIndex]!.id,
    };
  });
}

function buildOpenExercisesPayload(
  items: ExamOpenQuestionInput[],
): StoredOpenQuestion[] {
  return items.map((q) => ({
    id: crypto.randomUUID(),
    prompt: q.prompt,
  }));
}

export async function createExam(
  _parent: unknown,
  args: CreateExamArgs,
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const openPayload = buildOpenExercisesPayload(args.openExercises);
  const openExercisesJson = JSON.stringify(openPayload);

  await ctx.db.insert(examTable).values({
    id,
    notes: args.notes,
    title: args.title,
    duration: args.duration ?? "0",
    isActive: args.isActive ?? 0,
    variation: args.variation,
    testIds: args.testIds.join(","), 
    openExercises: openExercisesJson,
    createdAt: now,
    updatedAt: now, 
  });

  return {
    id,
    notes: args.notes,
    title: args.title,
    duration: args.duration,
    isActive: args.isActive ?? 0,
    variation: args.variation,
    testIds: args.testIds,
    openExercises: openExercisesJson,
    createdAt: now,
    updatedAt: now,
  };
}
