/** @format */

import { and, eq } from "drizzle-orm";
import { testTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

type TestInput = {
	subjectId: string;
	grade: number;
};

function parseAnswers(value: unknown): unknown[] {
	if (Array.isArray(value)) return value;
	if (typeof value !== "string") return [];
	try {
		const parsed = JSON.parse(value) as unknown;
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return value ? [value] : [];
	}
}

export const getTestsBySybjectAndGrade = async (
	_parent: unknown,
	args: { input: TestInput },
	ctx: GraphQLUserContext,
) => {
	const rows = await ctx.db
		.select()
		.from(testTable)
		.where(
			and(
				eq(testTable.subjectId, args.input.subjectId),
				eq(testTable.grade, args.input.grade),
			),
		);

	const mapped = rows.map((row) => ({
		...row,
		// GraphQL expects `[JSON!]!` iterable, but DB stores a JSON string.
		answers: parseAnswers((row as any).answers),
		favourite: Boolean(row.favourite),
	}));

	return mapped;
};
