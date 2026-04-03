/** @format */

export const openExerciesTypeDefs = /* GraphQL */ `
	type OpenExercies {
		id: ID!
		subjectId: String!
		grade: Int!
		topic: String
		title: String
		question: String
		answer: String
		imageUrl: String
		difficulty: String
		score: Int!
		favourite: Boolean
		notes: String
		teacherId: String
		createdAt: String!
		updatedAt: String!
	}
`;
