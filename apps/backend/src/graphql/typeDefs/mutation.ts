export const mutationTypeDefs = /* GraphQL */ `
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
  }
`;
