export const testTypeDefs = /* GraphQL */ `
  type Test {
    id: ID!
    grade: Int!
    subjectId: String!
    question: String!
    answers: [String]
    rightAnswer: String
    imageUrl: String
    difficulty: String
    score: Int!
    usageCount: Int
    notes: String
    createdAt: String!
    updatedAt: String!
  }
`;
