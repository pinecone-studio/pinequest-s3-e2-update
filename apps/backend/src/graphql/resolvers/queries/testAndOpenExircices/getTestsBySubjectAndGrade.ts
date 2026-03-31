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
  // #region agent log
  fetch("http://127.0.0.1:7338/ingest/d1901744-a7a8-4c7c-a7f6-4c310919657b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "1d534f",
    },
    body: JSON.stringify({
      sessionId: "1d534f",
      runId: "pre-fix",
      hypothesisId: "H1",
      location:
        "apps/backend/src/graphql/resolvers/queries/testAndOpenExircices/getTestsBySubjectAndGrade.ts",
      message: "getTestsBySybjectAndGrade called",
      data: { input: args?.input },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

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
  }));

  // #region agent log
  const first = (rows as unknown[])[0] as Record<string, unknown> | undefined;
  const firstMapped = (mapped as unknown[])[0] as
    | Record<string, unknown>
    | undefined;
  fetch("http://127.0.0.1:7338/ingest/d1901744-a7a8-4c7c-a7f6-4c310919657b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "1d534f",
    },
    body: JSON.stringify({
      sessionId: "1d534f",
      runId: "post-fix",
      hypothesisId: "H2",
      location:
        "apps/backend/src/graphql/resolvers/queries/testAndOpenExircices/getTestsBySubjectAndGrade.ts",
      message: "getTestsBySybjectAndGrade result sample",
      data: {
        count: Array.isArray(rows) ? rows.length : null,
        firstRowKeys: first ? Object.keys(first).slice(0, 12) : null,
        firstRowId: first?.id ?? null,
        answersType: first ? typeof (first as any).answers : null,
        answersPreview: first
          ? String((first as any).answers).slice(0, 120)
          : null,
        mappedAnswersIsArray: firstMapped
          ? Array.isArray((firstMapped as any).answers)
          : null,
        mappedAnswersLength: firstMapped
          ? Array.isArray((firstMapped as any).answers)
            ? ((firstMapped as any).answers as unknown[]).length
            : null
          : null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  return mapped;
};
