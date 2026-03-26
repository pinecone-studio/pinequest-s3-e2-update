export const mutationTypeDefs = /* GraphQL */ `
  type Mutation {
    addTeacher(schoolId: String!, name: String!): Teacher!
    createSubject(name: String!): Subject!
    createExam(
      subjectId: String!
      duration: String!
      location: String!
      notes: String!
      tests: [ExamClosedQuestionInput!]!
      openExercises: [ExamOpenQuestionInput!]!
      gradeId: String
      teacherId: String
      date: String
    ): Exam!
  }
`;
