export const examTypeDefs = /* GraphQL */ `
  input ExamChoiceInput {
    text: String!
  }

  input ExamClosedQuestionInput {
    prompt: String!
    choices: [ExamChoiceInput!]!
    """choices массив дахь зөв хариултын индекс (0-ээс эхэлнэ)"""
    correctChoiceIndex: Int!
  }

  input ExamOpenQuestionInput {
    prompt: String!
  }

  type Exam {
    id: String!
    subjectId: String!
    gradeId: String
    teacherId: String
    tests: String!
    openExercises: String!
    date: String
    duration: String!
    location: String!
    notes: String!
    createdAt: String!
    updatedAt: String!
  }
`;
