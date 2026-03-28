export const studentExamResultTypeDefs = /* GraphQL */ `
  type StudentExamResult {
    id: ID!
    examId: String!
    studentId: String!
    teacherId: String!
    status: String
    notes: String
    testScore: Int
    openExerciseScore: Int
    totalScore: Int
    actualScore: Int
    examCheatLogs: [ExamCheatLog]
    createdAt: String!
    updatedAt: String!
  }
`;