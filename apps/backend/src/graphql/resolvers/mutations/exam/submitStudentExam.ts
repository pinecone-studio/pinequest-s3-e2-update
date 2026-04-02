import { and, eq, inArray } from "drizzle-orm";
import {
  examTable,
  openExerciesTable,
  studentExamResultTable,
  studentTable,
  testTable,
} from "../../../../db/schema";
import { loadExamContentIds, requireExamSession } from "../../../../lib/exam-guard";
import {
  mapRightAnswerToOptionId,
  normalizeSelectedOption,
  parseTestAnswersCell,
} from "../../../../lib/exam-scoring";
import { GraphQLUserContext } from "../../../context";

type TestResponseInput = { testId: string; selectedOption: string };

function parseStudentResultIds(value: unknown): string[] {
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return [];
    }
  }
  return [];
}

function mapRowToStudentExamResult(row: typeof studentExamResultTable.$inferSelect) {
  return {
    id: row.id,
    examId: row.examId,
    studentId: row.studentId,
    teacherId: row.teacherId,
    status: row.status,
    notes: row.notes ?? null,
    testScore: row.testScore ?? null,
    openExerciseScore: row.openExerciseScore ?? null,
    totalScore: row.totalScore ?? null,
    actualScore: row.actualScore ?? null,
    answersJson: row.answersJson ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const submitStudentExam = async (
  _parent: unknown,
  args: { input: { examId: string; testResponses: TestResponseInput[] } },
  ctx: GraphQLUserContext,
) => {
  const session = requireExamSession(ctx);
  const examId = args.input.examId?.trim();
  if (!examId || examId !== session.examId) {
    throw new Error("Шалгалтын token энэ шалгалттай таарахгүй байна.");
  }
  const studentId = session.studentId;

  try {
    const existing = await ctx.db
      .select()
      .from(studentExamResultTable)
      .where(
        and(
          eq(studentExamResultTable.examId, examId),
          eq(studentExamResultTable.studentId, studentId),
        ),
      );
    if (existing[0]) {
      return mapRowToStudentExamResult(existing[0]);
    }

    const examRows = await ctx.db.select().from(examTable).where(eq(examTable.id, examId));
    const exam = examRows[0];
    if (!exam) throw new Error("Шалгалт олдсонгүй.");
    if (exam.isActive !== 1) throw new Error("Шалгалт идэвхгүй байна.");

    const { testIds, openExerciseIds } = await loadExamContentIds(ctx, examId);

    const responseByTestId = new Map<string, string>();
    for (const r of args.input.testResponses ?? []) {
      const tid = r.testId?.trim();
      if (!tid) continue;
      responseByTestId.set(tid, normalizeSelectedOption(r.selectedOption));
    }

    for (const tid of responseByTestId.keys()) {
      if (!testIds.includes(tid)) {
        throw new Error("Зөвшөөрөгдөөгүй асуултын ID илгээгдсэн.");
      }
    }

    let testEarned = 0;
    let testMax = 0;
    const scoredDetail: Record<
      string,
      { correct: boolean; earned: number; max: number }
    > = {};

    const validMcq = new Set(["A", "B", "C", "D"]);

    if (testIds.length > 0) {
      const testRows = await ctx.db
        .select()
        .from(testTable)
        .where(inArray(testTable.id, testIds));
      const byId = new Map(testRows.map((r) => [r.id, r]));

      for (const tid of testIds) {
        const row = byId.get(tid);
        if (!row) continue;
        const choices = parseTestAnswersCell(row.answers)
          .filter((a) => a.trim().length > 0)
          .slice(0, 4);
        if (choices.length < 2) continue;

        const max = row.score ?? 0;
        testMax += max;

        const correct = mapRightAnswerToOptionId(row.rightAnswer, choices);
        const selectedRaw = responseByTestId.get(tid) ?? "";
        const normalized = validMcq.has(selectedRaw) ? selectedRaw : "";
        if (!normalized) {
          throw new Error("Бүх олон сонголттой асуултад хариулна уу.");
        }
        const isCorrect = normalized === correct;
        const earned = isCorrect ? max : 0;
        testEarned += earned;
        scoredDetail[tid] = { correct: isCorrect, earned, max };
      }
    }

    let openMax = 0;
    if (openExerciseIds.length > 0) {
      const openRows = await ctx.db
        .select()
        .from(openExerciesTable)
        .where(inArray(openExerciesTable.id, openExerciseIds));
      for (const r of openRows) {
        openMax += r.score ?? 0;
      }
    }

    const totalMax = testMax + openMax;
    const openEarned = 0;
    const actualScore = testEarned + openEarned;
    const status = openExerciseIds.length > 0 ? "pending_manual" : "graded";

    const teacherId = exam.teacherId?.trim() || "none";
    const now = new Date().toISOString();
    const resultId = crypto.randomUUID();

    const answersJson = JSON.stringify({
      testResponses: args.input.testResponses ?? [],
      scored: scoredDetail,
      submittedAt: now,
    });

    const studentRows = await ctx.db.select().from(studentTable).where(eq(studentTable.id, studentId));
    const stu = studentRows[0];
    if (!stu) throw new Error("Сурагч олдсонгүй.");

    const prevIds = parseStudentResultIds(stu.studentExamResultIds);
    const nextIds = [...prevIds, resultId];

    await ctx.db.batch([
      ctx.db.insert(studentExamResultTable).values({
        id: resultId,
        examId,
        studentId,
        teacherId,
        status,
        notes: null,
        testScore: testEarned,
        openExerciseScore: openEarned,
        totalScore: totalMax,
        actualScore,
        answersJson,
        createdAt: now,
        updatedAt: now,
      }),
      ctx.db
        .update(studentTable)
        .set({
          studentExamResultIds: JSON.stringify(nextIds),
          updatedAt: now,
        })
        .where(eq(studentTable.id, studentId)),
    ]);

    const inserted = await ctx.db
      .select()
      .from(studentExamResultTable)
      .where(eq(studentExamResultTable.id, resultId));
    const row = inserted[0];
    if (!row) throw new Error("Дүн хадгалагдсан ч баталгаажуулж чадсангүй.");
    return mapRowToStudentExamResult(row);
  } catch (err) {
    console.error("submitStudentExam error:", err);
    if (err instanceof Error && err.message) throw err;
    throw new Error("Шалгалт илгээхэд алдаа гарлаа.");
  }
};
