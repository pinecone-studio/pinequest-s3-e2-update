export const mutationTypeDefs = /* GraphQL */ `
  input CreateTestsInput {
    grade: Int!
    subjectId: String!
    title: String
    question: String!
    answers: [JSON!]!
    imageUrl: String
    rightAnswer: String!
    difficulty: String!
    score: Int!
    usageCount: Int!
    favourite: Boolean
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
    favourite: Boolean
    notes: String
    teacherId: String!
  }

  input UpdateTestsInput {
    id: String!
    grade: Int
    subjectId: String
    title: String
    question: String
    answers: [JSON!]
    imageUrl: String
    rightAnswer: String
    difficulty: String
    score: Int
    usageCount: Int
    favourite: Boolean
    notes: String
    teacherId: String
  }

  input UpdateOpenExerciesArgs {
    id: String!
    subjectId: String
    grade: Int
    topic: String
    title: String
    question: String
    answer: String
    imageUrl: String
    difficulty: String
    score: Int
    favourite: Boolean
    notes: String
    teacherId: String
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

  input StudentExamTestResponseInput {
    testId: String!
    selectedOption: String!
  }

  input SubmitStudentExamInput {
    examId: String!
    testResponses: [StudentExamTestResponseInput!]!
  }

  type StudentExamAuthPayload {
    token: String!
    student: Student!
  }

  type StartExamMonitoringForClassPayload {
    ok: Boolean!
    startedAt: String!
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

  input UpdateClassInput {
    id: String!
    grade: Int
    section: String
    sectionTeacherId: String
  }

  input UpdateStudentInput {
    id: String!
    classId: String
    firstName: String
    lastName: String
    email: String
    studentCode: String
  }

  input UpdateTeacherInput {
    id: String!
    firstName: String
    lastName: String
    email: String
    role: String
    myClassId: String
    classIds: [String!]
  }

  input SyncClassTeachersInput {
    classId: String!
    teacherIds: [String!]!
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
    updateTests(input: UpdateTestsInput!): Test!
    createSubject(input: CreateSubjectInput!): Subject!
    createOpenExercies(input: CreateOpenExerciesArgs!): OpenExercies!
    updateOpenExercies(input: UpdateOpenExerciesArgs!): OpenExercies!
    createExam(input: CreateExamArgs!): Exam!
    addStudent(input: AddStudentInput!): Student!
    createClass(input: CreateClassInput!): Class!
    addTeacher(input: AddTeacherInput!): Teacher!
    """Bearer session JWT шаардлагатай. И-мэйлээр урьсан teacher мөрийг одоогийн Clerk user-т холбоно."""
    linkTeacherClerk: Teacher!
    studentExamAuth(input: StudentExamAuthInput!): StudentExamAuthPayload!
    """Шалгалтын token (x-exam-token) шаардлагатай. MCQ-г серверт онооно."""
    submitStudentExam(input: SubmitStudentExamInput!): StudentExamResult!
    """Bearer Clerk session — зөвхөн энэ шалгалтын teacherId багш дуудаж болно."""
    addExamAllowedClasses(examId: String!, classIds: [String!]!): Boolean!
    """
    Илгээсэн ангийн хувьд хяналтын эхлэлтийг D1-д тэмдэглэнэ.
    Зөвхөн шалгалтын эзэн багш, мөн (examId, classId) exam_allowed_class-д байвал.
    """
    startExamMonitoringForClass(
      examId: String!
      classId: String!
    ): StartExamMonitoringForClassPayload!
    """Сургуулийн админ (Clerk JWT)."""
    updateClass(input: UpdateClassInput!): Class!
    deleteClass(id: String!): Boolean!
    updateStudent(input: UpdateStudentInput!): Student!
    deleteStudent(id: String!): Boolean!
    updateTeacher(input: UpdateTeacherInput!): Teacher!
    deleteTeacher(id: String!): Boolean!
    syncClassTeacherAssignments(input: SyncClassTeachersInput!): Boolean!
  }
`;
