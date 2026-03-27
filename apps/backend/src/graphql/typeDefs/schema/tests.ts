export const testTypeDefs = /* GraphQL */ `
  type Test {
    id: String!
    grade: Int!
    gradeLabel: String!
    subjectId: String!
    subjectName: String!
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
    score: Int!
    status: String!
    gradingType: String!
    usageCount: Int!
    isActive: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
