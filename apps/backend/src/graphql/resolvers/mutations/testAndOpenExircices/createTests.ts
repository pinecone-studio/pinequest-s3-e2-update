/** @format */

import { testTable } from "../../../../db/schema/testTable";
import { requireDbTeacherIdFromClerk } from "../../../../lib/teacher-row-from-clerk";
import { GraphQLUserContext } from "../../../context";

type CreateTestsArgs = {
	grade: number;
	subjectId: string;
	question: string;
	answers: string[];
	imageUrl: string;
	rightAnswer: string;
	difficulty: string;
	score: number;
	teacherId: string;
	usageCount: number;
	favourite?: boolean | null;
	notes: string;
};

export const createTests = async (
	_parent: unknown,
	args: { input: CreateTestsArgs },
	ctx: GraphQLUserContext,
) => {
	const id = crypto.randomUUID();
	const now = new Date().toISOString();
	const teacherRowId = await requireDbTeacherIdFromClerk(ctx);
	try {
		await ctx.db.insert(testTable).values({
			id: id,
			grade: args.input.grade,
			subjectId: args.input.subjectId,
			question: args.input.question,
			answers: JSON.stringify(args.input.answers),
			imageUrl: args.input.imageUrl,
			rightAnswer: args.input.rightAnswer,
			difficulty: args.input.difficulty,
			score: args.input.score,
			usageCount: args.input.usageCount,
			favourite: args.input.favourite ? 1 : 0,
			notes: args.input.notes,
			teacherId: teacherRowId,
			createdAt: now,
			updatedAt: now,
		});

		// Return the created Test object (NOT the insert result).
		// GraphQL schema expects non-nullable `id` and `answers` as an array.
		return {
			id,
			grade: args.input.grade,
			subjectId: args.input.subjectId,
			question: args.input.question,
			answers: args.input.answers,
			imageUrl: args.input.imageUrl ?? null,
			rightAnswer: args.input.rightAnswer,
			difficulty: args.input.difficulty,
			score: args.input.score,
			usageCount: args.input.usageCount,
			favourite: Boolean(args.input.favourite),
			notes: args.input.notes,
			teacherId: teacherRowId,
			createdAt: now,
			updatedAt: now,
		};
	} catch (err) {
		console.error("Failed to create test:", err);
		throw new Error(`Failed to create test: ${err}`);
	}
};
