export const mutationTypeDefs = /* GraphQL */ `
  input CreateTestInput {
    grade: Int!
    subjectId: String!
    questionType: String!
    subtopic: String
    topic: String!
    title: String
    question: String!
    guidance: String
    explanation: String
    answers: [String!]!
    rightAnswer: String!
    rubric: String
    formulaRaw: String
    imageUrl: String
    fileUploadConfig: String
    difficulty: String
    score: Int
    isActive: Int
    usageCount: Int
  }

  input UpdateTestInput {
    grade: Int!
    subjectId: String!
    questionType: String!
    subtopic: String
    topic: String!
    title: String
    question: String!
    guidance: String
    explanation: String
    answers: [String!]!
    rightAnswer: String!
    rubric: String
    formulaRaw: String
    imageUrl: String
    fileUploadConfig: String
    difficulty: String
    score: Int
    isActive: Int
    usageCount: Int
  }

  type Mutation {
    addTeacher(schoolId: String!, name: String!): Teacher!
    createSubject(name: String!): Subject!
    createExam(
      notes: String
      duration: String
      isActive: Int
      variation: String
      tests: [ExamClosedQuestionInput!]
      openExercises: [ExamOpenQuestionInput!]
      gradeId: String
      date: String
      location: String
    ): Exam!
    createTest(input: CreateTestInput!): Test!
    updateTest(id: String!, input: UpdateTestInput!): Test!
    incrementTestUsage(ids: [String!]!): Int!
  }
`;
