import { gql } from "@apollo/client";

export const CREATE_TESTS = gql`
  mutation CreateTests($input: CreateTestsInput!) {
    createTests(input: $input) {
      id
      grade
      subjectId
      question
      answers
      rightAnswer
      imageUrl
      difficulty
      score
      usageCount
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`;
export const CREATE_OPEN_EXERCIES = gql`
  mutation CreateOpenExercies($input: CreateOpenExerciesArgs!) {
    createOpenExercies(input: $input) {
      id
      subjectId
      grade
      topic
      title
      question
      answer
      imageUrl
      difficulty
      score
      notes
      teacherId
      createdAt
      updatedAt
    }
  }
`;
