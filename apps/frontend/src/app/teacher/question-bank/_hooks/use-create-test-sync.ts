"use client";

import { useMutation } from "@apollo/client/react";
import {
  CREATE_TEST_MUTATION,
  INCREMENT_TEST_USAGE_MUTATION,
  UPDATE_TEST_MUTATION,
} from "../_lib/create-test-mutation";
import { buildCreateTestInput, buildUpdateTestInput } from "../_lib/backend-question-mappers";
import { GET_ALL_TESTS_QUERY } from "../_lib/get-tests";
import type { Question, QuestionBuilderValues } from "../_lib/types";

type CreateTestMutationData = {
  createTest: {
    id: string;
  };
};

type UpdateTestMutationData = {
  updateTest: {
    id: string;
  };
};

type IncrementTestUsageMutationData = {
  incrementTestUsage: number;
};

export function useCreateTestSync() {
  const [createTest] = useMutation<CreateTestMutationData>(CREATE_TEST_MUTATION);
  const [updateTest] = useMutation<UpdateTestMutationData>(UPDATE_TEST_MUTATION);
  const [incrementTestUsage] = useMutation<IncrementTestUsageMutationData>(INCREMENT_TEST_USAGE_MUTATION);

  const refetchQueries = [{ query: GET_ALL_TESTS_QUERY }];

  const createQuestionInBackend = async (values: QuestionBuilderValues) => {
    const result = await createTest({
      refetchQueries,
      variables: { input: buildCreateTestInput(values) },
    });

    return result.data?.createTest?.id as string | undefined;
  };

  const updateQuestionInBackend = async (questionId: string, values: QuestionBuilderValues, usageCount: number) => {
    await updateTest({
      refetchQueries,
      variables: {
        id: questionId,
        input: buildUpdateTestInput(values, usageCount),
      },
    });
  };

  const incrementUsageInBackend = async (questions: Question[]) => {
    await incrementTestUsage({
      refetchQueries,
      variables: { ids: questions.map((question) => question.id) },
    });
  };

  return { createQuestionInBackend, incrementUsageInBackend, updateQuestionInBackend };
}
