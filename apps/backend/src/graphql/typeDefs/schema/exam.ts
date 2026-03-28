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
    notes: String!
    duration: String!
    isActive: Int!
    variation: String!
    tests: String!
    openExercises: String!
    gradeId: String
    date: String
    location: String!
    createdAt: String!
    updatedAt: String!
  }
`;
