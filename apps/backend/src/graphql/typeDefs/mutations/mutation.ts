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

  input CreateClassInput {
    schoolId: String!
    grade: Int!
    section: String!
    sectionTeacherId: String!
  }

  input StudentExamAuthInput {
    examId: String!
    studentCode: String!
  }

  type StudentExamAuthPayload {
    token: String!
    student: Student!
  }

  input AddTeacherInput {
    """Хоосон бол D1-д түр хүлээгдэж буй багш; дараа нь linkTeacherClerk ашиглана."""
    clerkId: String
    email: String!
    firstName: String!
    lastName: String!
    schoolId: String!
    role: String!
    """Өөрийн ангийн ID."""
    myClassId: String
    """Заадаг ангийн ID жагсаалт."""
    classIds: [String!]
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
    """Шалгалтыг нээх ангиуд (хоосон бол дараа нь addExamAllowedClasses)."""
    allowedClassIds: [String!]
  }

  type Mutation {
    createTests(input: CreateTestsInput!): Test!
    createSubject(input: CreateSubjectInput!): Subject!
    createOpenExercies(input: CreateOpenExerciesArgs!): OpenExercies!
    createExam(input: CreateExamArgs!): Exam!
    addStudent(input: AddStudentInput!): Student!
    createClass(input: CreateClassInput!): Class!
    addTeacher(input: AddTeacherInput!): Teacher!
    """Bearer session JWT шаардлагатай. И-мэйлээр урьсан teacher мөрийг одоогийн Clerk user-т холбоно."""
    linkTeacherClerk: Teacher!
    studentExamAuth(input: StudentExamAuthInput!): StudentExamAuthPayload!
    """Bearer Clerk session — зөвхөн энэ шалгалтын teacherId багш дуудаж болно."""
    addExamAllowedClasses(examId: String!, classIds: [String!]!): Boolean!
  }
`;
