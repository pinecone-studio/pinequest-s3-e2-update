import { eq } from "drizzle-orm";
import {
  examAllowedClassTable,
  examTable,
  studentTable,
} from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";
import { createExamToken } from "../../../../lib/exam-token";

type StudentExamAuthInput = {
  examId: string;
  studentCode: string;
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Best-effort parse exam duration into seconds.
 *
 * Supported:
 * - "60" (minutes)
 * - "60m", "60min", "60 minutes"
 * - "1h", "1.5h", "2 hours"
 * - "HH:MM" (e.g. "01:30")
 */
function parseExamDurationSeconds(duration: unknown): number | null {
  if (typeof duration !== "string") return null;
  const raw = duration.trim().toLowerCase();
  if (!raw) return null;

  // HH:MM
  const hm = raw.match(/^(\d{1,2})\s*:\s*(\d{1,2})$/);
  if (hm) {
    const h = Number(hm[1]);
    const m = Number(hm[2]);
    if (Number.isFinite(h) && Number.isFinite(m)) return h * 3600 + m * 60;
  }

  // Digits only -> minutes
  if (/^\d+$/.test(raw)) return Number(raw) * 60;

  // Minutes suffix
  const mins = raw.match(/^(\d+)\s*(m|min|mins|minute|minutes)$/);
  if (mins) return Number(mins[1]) * 60;

  // Hours suffix (supports decimals)
  const hours = raw.match(/^(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)$/);
  if (hours) return Math.round(Number(hours[1]) * 3600);

  return null;
}

export const studentExamAuth = async (
  _parent: unknown,
  args: { input: StudentExamAuthInput },
  ctx: GraphQLUserContext,
) => {
  try {
    const examId = args.input.examId?.trim();
    const studentCode = args.input.studentCode?.trim();

    if (!examId) throw new Error("Missing examId");
    if (!studentCode) throw new Error("Missing studentCode");

    const examRows = await ctx.db
      .select()
      .from(examTable)
      .where(eq(examTable.id, examId));
    const exam = examRows[0];
    if (!exam) throw new Error("Exam not found");
    if (exam.isActive !== 1) throw new Error("Exam is not active");

    const studentRows = await ctx.db
      .select()
      .from(studentTable)
      .where(eq(studentTable.studentCode, studentCode));
    const student = studentRows[0];
    if (!student) throw new Error("Invalid student code");

    const allowedRows = await ctx.db
      .select()
      .from(examAllowedClassTable)
      .where(eq(examAllowedClassTable.examId, examId));
    const allowedClassIds = new Set(allowedRows.map((r) => r.classId));
    if (allowedClassIds.size === 0) {
      throw new Error("Энэ шалгалтыг аль ч ангиудад нэээгүй байна.");
    }
    if (!allowedClassIds.has(student.classId)) {
      throw new Error("Таны анги энэ шалгалтад бүртгэгдээгүй байна.");
    }

    const secret = ctx.env.EXAM_TOKEN_SECRET?.trim();
    if (!secret) throw new Error("Missing EXAM_TOKEN_SECRET");

    const durationSeconds = parseExamDurationSeconds((exam as any).duration);
    const bufferSeconds = 15 * 60; // safety buffer
    const baseSeconds = durationSeconds ?? 60 * 60; // fallback 1h if unparseable
    const ttlSeconds = clamp(baseSeconds + bufferSeconds, 30 * 60, 6 * 60 * 60);

    const token = await createExamToken({
      secret,
      studentId: student.id,
      examId,
      ttlSeconds,
    });

    return { token, student };
  } catch (error) {
    console.error("Failed to student exam auth:", error);
    throw new Error(`Failed to student exam auth: ${error}`);
  }
};
