import { gql } from "@apollo/client";

export const GET_ALL_TESTS_QUERY = gql`
  query GetAllTests {
    getAllTests {
      id
      grade
      subjectId
      title
      question
      answers
      rightAnswer
      imageUrl
      difficulty
      score
      usageCount
      favourite
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
  title?: string | null;
  question: string;
  answers: unknown[];
  rightAnswer: string | null;
  imageUrl: string | null;
  difficulty: string | null;
  score: number;
  usageCount: number | null;
  favourite?: boolean | null;
  notes: string | null;
  teacherId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetAllTestsResponse = {
  getAllTests: BackendTest[];
};
