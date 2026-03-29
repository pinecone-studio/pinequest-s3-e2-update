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

  input OpenExerciesArgs {
    grade: Int!
    subjectId: String!
    topic: String
    title: String
    question: String!
    answer: String
    imageUrl: String
    difficulty: String
    score: Int!
    notes: String
    teacherId: String
  }

  input CreateSubjectInput {
    name: String!
  }

  type Mutation {
    createTests(input: CreateTestsInput!): Test!
    createSubject(input: CreateSubjectInput!): Subject!
    createOpenExercies(input: OpenExerciesArgs): OpenExercies!
  }
`;
