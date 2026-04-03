/** @format */

import { and, eq } from "drizzle-orm";
import { openExerciesTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

type OpenExerciesInput = {
	subjectId: string;
	grade: number;
};

export const getOpenExerciesBySubjectAndGrade = async (
	_parent: unknown,
	args: { input: OpenExerciesInput },
	ctx: GraphQLUserContext,
) => {
	if (!args.input.subjectId || !args.input.grade) {
		throw new Error("Subject ID and grade are required");
	}
	try {
		const rows = await ctx.db
			.select()
			.from(openExerciesTable)
			.where(
				and(
					eq(openExerciesTable.subjectId, args.input.subjectId),
					eq(openExerciesTable.grade, args.input.grade),
				),
			);

		return rows.map((row) => ({
			...row,
			favourite: Boolean(row.favourite),
		}));
	} catch (err) {
		console.error("Failed to get open exercies by subject and grade:", err);
		throw new Error(`Failed to get open exercies by subject and grade`);
	}
};
