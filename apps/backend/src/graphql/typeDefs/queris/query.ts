export const queryTypeDefs = /* GraphQL */ `
  input TestInput {
    subjectId: String!
    grade: Int!
  }

  input ClassByTeacherAndSchoolIdInput {
    teacherId: String!
    schoolId: String!
  }

  input OpenExerciesInput {
    subjectId: String!
    grade: Int!
  }

  type Query {
    """
    Clerk user id from verified Bearer session token, or null if anonymous.
    """
    viewerClerkId: String
    hello: String!
    getAllTests: [Test!]!
    getClassBySchoolId(schoolId: String!): [Class!]
    getStudentByClassId(classId: String!): [Student!]
    getSchoolByClerkId(clerkId: String!): School!
    getTeachersBySchoolId(schoolId: String!): [Teacher!]
    getAllExams: [Exam!]
    getExamById(examId: String!): Exam
    getTestsBySybjectAndGrade(input: TestInput): [Test]
    getAllSubject: [Subject!]!
    getClassByTeacherAndSchoolId(
      input: ClassByTeacherAndSchoolIdInput!
    ): [Class!]
    getOpenExerciesBySubjectAndGrade(input: OpenExerciesInput): [OpenExercies]
  }
`;
