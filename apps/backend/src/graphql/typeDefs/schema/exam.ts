export const examTypeDefs = /* GraphQL */ `
  type Exam {
    id: ID!
    grade: Int!
    subjectId: String!
    topic: String
    title: String
    date: String
    location: String
    duration: String
    variation: String
    testIds: [String]
    openExerciseIds: [String]
    notes: String
    score: Int
    usageCount: Int
    createdAt: String!
    updatedAt: String!
  }
`;
