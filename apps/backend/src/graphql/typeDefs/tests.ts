export const testTypeDefs = /* GraphQL */ `
  type Test {
    id: String!
    gradeId: String!
    subjectId: String!
    topic: String!
    title: String
    question: String!
    answers: [String!]!  
    rightAnswer: String!
    notes: String
    questionNote: String
    difficulty: String
    score: Int!
    isActive: Int!
    createdAt: String!
    updatedAt: String!
  }
`;