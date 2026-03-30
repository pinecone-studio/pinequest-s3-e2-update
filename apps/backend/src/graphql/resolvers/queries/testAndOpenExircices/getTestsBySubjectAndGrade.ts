import { and, eq } from "drizzle-orm";
import { testTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

type TestInput = {
  subjectId: string;
  grade: number;
};

export const getTestsBySybjectAndGrade = async (
  _parent: unknown,
  args: { input: TestInput },
  ctx: GraphQLUserContext,
) => {
  return await ctx.db
    .select()
    .from(testTable)
    .where(
      and(
        eq(testTable.subjectId, args.input.subjectId),
        eq(testTable.grade, args.input.grade),
      ),
    );
};
