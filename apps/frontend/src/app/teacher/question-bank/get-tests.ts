import { gql } from "@apollo/client";

export const GET_ALL_TESTS_QUERY = gql`
  query GetAllTests {
    getAllTests {
      id
      grade
      gradeLabel
      subjectId
      subjectName
      questionType
      subtopic
      topic
      title
      question
      guidance
      explanation
      answers
      rightAnswer
      rubric
      formulaRaw
      imageUrl
      fileUploadConfig
      difficulty
      score
      status
      gradingType
      usageCount
      isActive
      createdAt
      updatedAt
    }
  }
`;

export type BackendTest = {
  id: string;
  grade: number;
  gradeLabel: string;
  subjectId: string;
  subjectName: string;
  questionType: string;
  subtopic?: string | null;
  topic: string;
  title?: string | null;
  question: string;
  guidance?: string | null;
  explanation?: string | null;
  answers: string[];
  rightAnswer: string;
  rubric?: string | null;
  formulaRaw?: string | null;
  imageUrl?: string | null;
  fileUploadConfig?: string | null;
  difficulty?: string | null;
  score: number;
  status: string;
  gradingType: string;
  usageCount: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
};

export type GetAllTestsResponse = {
  getAllTests: BackendTest[];
};
