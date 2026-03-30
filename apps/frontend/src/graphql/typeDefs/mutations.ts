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
