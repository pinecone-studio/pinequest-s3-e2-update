export const queryTypeDefs = /* GraphQL */ `
  type Query {
    hello: String!
    getAllTests: [Test!]!
    getClassBySchoolId(schoolId: String!): [Class!]
    getStudentByClassId(classId: String!): [Student!]
    getSchoolByClerkId(clerkId: String!): School!
  }
`;
