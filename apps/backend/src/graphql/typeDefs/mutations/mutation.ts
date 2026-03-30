export const mutationTypeDefs = /* GraphQL */ `
  input CreateTestsInput {
    grade: Int!
    subjectId: String!
    question: String!
    answers: [JSON!]!
    imageUrl: String
    rightAnswer: String!
    difficulty: String!
    score: Int!
    usageCount: Int!
    notes: String!
    teacherId: String!
  }

  input CreateSubjectInput {
    name: String!
  }

  type Mutation {
    createTests(input: CreateTestsInput!): Test!
    createSubject(input: CreateSubjectInput!): Subject!
  }
`;
