export const teacherTypeDefs = /* GraphQL */ `
  type Teacher {
    id: ID!
    clerkId: String
    email: String!
    """Өөрийн (үндсэн) ангийн ID."""
    myClassId: String
    """Заадаг ангийн ID жагсаалт."""
    classIds: [String!]!
    firstName: String!
    lastName: String!
    schoolId: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }
`;
