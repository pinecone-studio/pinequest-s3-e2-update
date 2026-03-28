export const studentTypeDefs = /* GraphQL */ `
  type Student {
    id: ID!
    email: String!
    classId: String!
    firstName: String!
    lastName: String!
    studentCode: String
    studentExamResultIds: [String]
    createdAt: String!
    updatedAt: String!
  }
`;