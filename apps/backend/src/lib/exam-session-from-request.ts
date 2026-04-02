import type { Env } from "../types";
import { verifyExamToken } from "./exam-token";

export type ExamSession = {
  studentId: string;
  examId: string;
};

/** `x-exam-token: v1....` — Clerk Bearer-тэй зөрчилдэхгүй. */
export async function examSessionFromRequest(
  request: Request,
  env: Env,
): Promise<ExamSession | null> {
  const raw = request.headers.get("x-exam-token")?.trim();
  if (!raw) return null;
  const secret = env.EXAM_TOKEN_SECRET?.trim();
  if (!secret) return null;
  const verified = await verifyExamToken(raw, secret);
  if (!verified) return null;
  return verified;
}
