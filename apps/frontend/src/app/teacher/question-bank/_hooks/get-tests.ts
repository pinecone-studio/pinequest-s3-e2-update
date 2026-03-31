import { gql } from "@apollo/client";

export const GET_ALL_TESTS_QUERY = gql`
  query GetAllTests {
    getAllTests {
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
      createdAt
      updatedAt
    }
  }
`;

export type BackendTest = {
  id: string;
  grade: number;
  subjectId: string;
  question: string;
  answers: unknown[];
  rightAnswer: string | null;
  imageUrl: string | null;
  difficulty: string | null;
  score: number;
  usageCount: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetAllTestsResponse = {
  getAllTests: BackendTest[];
};
