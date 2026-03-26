import { GraphQLError, type GraphQLResolveInfo } from "graphql";
import { examTable } from "../../../db/schema";
import type { GraphQLUserContext } from "../../context";

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
  duration: string;
  location: string;
  notes: string;
  tests: ExamClosedQuestionInput[];
  openExercises: ExamOpenQuestionInput[];
  gradeId?: string | null;
  teacherId?: string | null;
  date?: string | null;
  isActive: number
  variation: number
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

  const testsPayload = buildTestsPayload(args.tests);
  const openPayload = buildOpenExercisesPayload(args.openExercises);
  const testsJson = JSON.stringify(testsPayload);
  const openExercisesJson = JSON.stringify(openPayload);

  await ctx.db.insert(examTable).values({
    id,
    notes: args.notes,
    duration: args.duration,
    isActive: args.isActive ?? 0,
    variation: args.variation,
    tests: testsJson, 
    openExercises: openExercisesJson,
    gradeId: args.gradeId ?? null,
    date: args.date ?? null,
    location: args.location,
    createdAt: now,
    updatedAt: now, 
  });

  return {
    id,
    gradeId: args.gradeId ?? null,
    teacherId: args.teacherId ?? null,
    tests: testsJson,
    openExercises: openExercisesJson,
    date: args.date ?? null,
    duration: args.duration,
    location: args.location,
    notes: args.notes,
    createdAt: now,
    updatedAt: now,
  };
}
