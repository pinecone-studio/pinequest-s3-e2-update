import type { Db } from "../db/drizzle";
import type { ExamSession } from "../lib/exam-session-from-request";
import type { Env } from "../types";

export type GraphQLUserContext = {
  db: Db;
  env: Env;
  /** Clerk user id from verified session JWT (`sub`), or null if anonymous / invalid token. */
  clerkUserId: string | null;
  /** Сурагчийн шалгалтын token (`x-exam-token`), studentExamAuth-ийн дараа. */
  examSession: ExamSession | null;
};
