export const queryTypeDefs = /* GraphQL */ `
  type Query {
    hello: String!
    getAllTests: [Test!]!
    getClassBySchoolId(schoolId: String!): [Class!]
    getStudentByClassId(classId: String!): [Student!]
    getSchoolByClerkId(clerkId: String!): School!
    getTeachersBySchoolId(schoolId: String!): [Teacher!]
    getAllExam: [Exam!]
    getExamById(examId: String!): Exam
  }
`;
