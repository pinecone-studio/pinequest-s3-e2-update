import { eq } from "drizzle-orm";
import { examTable, schoolTable } from "../db/schema";
import type { GraphQLUserContext } from "../graphql/context";

function parseIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((x): x is string => typeof x === "string");
  }
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return value ? [value] : [];
  }
}

export function requireExamSession(ctx: GraphQLUserContext) {
  if (!ctx.examSession) {
    throw new Error("Шалгалтын token шаардлагатай (x-exam-token).");
  }
  return ctx.examSession;
}

export function assertExamIdMatchesSession(
  ctx: GraphQLUserContext,
  examId: string,
) {
  const s = requireExamSession(ctx);
  if (s.examId !== examId.trim()) {
    throw new Error("Энэ шалгалтад хандах эрхгүй.");
  }
}

/** Сурагчийн exam token эсвэл сургуулийн админ (Clerk school row). */
export async function assertExamReadableBySessionOrSchoolAdmin(
  ctx: GraphQLUserContext,
  examId: string,
) {
  const id = examId.trim();
  if (!id) throw new Error("examId хоосон.");

  if (ctx.examSession?.examId === id) return;

  const clerkId = ctx.clerkUserId?.trim();
  if (!clerkId) {
    throw new Error("Шалгалтын token эсвэл нэвтрэх шаардлагатай.");
  }

  const examRows = await ctx.db
    .select()
    .from(examTable)
    .where(eq(examTable.id, id));
  const exam = examRows[0];
  if (!exam) throw new Error("Шалгалт олдсонгүй.");

  const schoolRows = await ctx.db
    .select()
    .from(schoolTable)
    .where(eq(schoolTable.clerkId, clerkId));
  const school = schoolRows[0];
  if (school?.id === exam.schoolId) return;

  // throw new Error("Энэ шалгалтад хандах эрхгүй.");
}

export async function loadExamContentIds(
  ctx: GraphQLUserContext,
  examId: string,
): Promise<{ testIds: string[]; openExerciseIds: string[] }> {
  const rows = await ctx.db
    .select()
    .from(examTable)
    .where(eq(examTable.id, examId.trim()));
  const row = rows[0];
  if (!row) {
    throw new Error("Шалгалт олдсонгүй.");
  }
  return {
    testIds: parseIds((row as { testIds?: unknown }).testIds),
    openExerciseIds: parseIds(
      (row as { openExerciseIds?: unknown }).openExerciseIds,
    ),
  };
}

export function assertRequestIdsAllowed(
  requested: string[],
  allowed: string[],
  contextLabel: string,
) {
  if (requested.length === 0) return;
  const allow = new Set(allowed);
  for (const id of requested) {
    if (!allow.has(id)) {
      throw new Error(`${contextLabel}: зөвшөөрөгдөөгүй асуултын ID.`);
    }
  }
}
