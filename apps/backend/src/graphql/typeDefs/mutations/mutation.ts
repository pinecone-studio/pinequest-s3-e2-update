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

  input CreateOpenExerciesArgs {
    subjectId: String!
    grade: Int!
    topic: String!
    title: String!
    question: String!
    answer: String
    imageUrl: String
    difficulty: String!
    score: Int!
    notes: String
    teacherId: String!
  }

  input CreateSubjectInput {
    name: String!
  }

  input AddStudentInput {
    email: String
    classId: String!
    firstName: String!
    lastName: String!
  }

  input StudentExamAuthInput {
    examId: String!
    studentCode: String!
  }

  type StudentExamAuthPayload {
    token: String!
    student: Student!
  }

  input CreateExamArgs {
    grade: Int!
    subjectId: String!
    topic: String
    title: String!
    date: String!
    location: String
    duration: String
    variation: String
    testIds: [String]
    openExerciseIds: [String]
    notes: String
    score: Int
    usageCount: Int
    isActive: Int
    needpermission: Int
    teacherId: String
    schoolId: String!
  }

  type Mutation {
    createTests(input: CreateTestsInput!): Test!
    createSubject(input: CreateSubjectInput!): Subject!
    createOpenExercies(input: CreateOpenExerciesArgs!): OpenExercies!
    createExam(input: CreateExamArgs!): Exam!
    addStudent(input: AddStudentInput!): Student!
    studentExamAuth(input: StudentExamAuthInput!): StudentExamAuthPayload!
  }
`;
