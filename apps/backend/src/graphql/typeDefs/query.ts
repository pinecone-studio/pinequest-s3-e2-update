export const queryTypeDefs = /* GraphQL */ `
  type Query {
    hello: String!
    schools: [School!]!
    subjects: [Subject!]!
    exams: [Exam!]!
    exam(id: String!): Exam
  }
`;
