export const mutationTypeDefs = /* GraphQL */ `
  input CreateTestInput {
    gradeId: String!
    subjectId: String!
    topic: String!
    title: String
    question: String!
    answers: String!
    rightAnswer: String!
    notes: String
    questionNote: String
    difficulty: String
    score: Int
    isActive: Int
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
  }
`;
