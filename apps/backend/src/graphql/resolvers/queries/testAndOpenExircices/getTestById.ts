/** @format */

import { eq } from "drizzle-orm";
import { testTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

function parseAnswers(value: string): string[] {
	try {
		const parsed = JSON.parse(value) as unknown;
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === "string")
			: [];
	} catch {
		return value ? [value] : [];
	}
}

export const getTestById = async (
	_parent: unknown,
	args: { testId: string },
	ctx: GraphQLUserContext,
) => {
	if (!args.testId) throw new Error("Tets id is requiered.");

	try {
		const rows = await ctx.db
			.select()
			.from(testTable)
			.where(eq(testTable.id, args.testId));
		return rows.map((row) => ({
			id: row.id,
			grade: row.grade ?? 0,
			subjectId: row.subjectId ?? "",
			question: row.question,
			answers: parseAnswers(row.answers),
			imageUrl: row.imageUrl ?? null,
			rightAnswer: row.rightAnswer,
			difficulty: row.difficulty,
			score: row.score,
			usageCount: row.usageCount ?? 0,
			favourite: Boolean(row.favourite),
			notes: row.notes ?? null,
			teacherId: row.teacherId,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
		}));
	} catch (err) {
		console.error("Failed to get test by id. Error:", err);
		throw new Error("Failed to get test.");
	}
};
