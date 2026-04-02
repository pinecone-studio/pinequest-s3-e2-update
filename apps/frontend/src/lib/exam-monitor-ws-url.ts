/** GraphQL-тай ижил backend суурь — WebSocket протокол руу хөрвүүлнэ. */
export function backendWsBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
    u.pathname = u.pathname.replace(/\/$/, "");
    return u.origin;
  } catch {
    return null;
  }
}

export function buildStudentExamMonitorWsUrl(params: {
  examId: string;
  classId: string;
  xExamToken: string;
}): string | null {
  const base = backendWsBaseUrl();
  if (!base) return null;
  const path = `/ws/exam/${encodeURIComponent(params.examId)}/class/${encodeURIComponent(params.classId)}`;
  const q = new URLSearchParams({
    xExamToken: params.xExamToken,
  });
  return `${base}${path}?${q.toString()}`;
}

export function buildTeacherExamMonitorWsUrl(params: {
  examId: string;
  classId: string;
  clerkToken: string;
}): string | null {
  const base = backendWsBaseUrl();
  if (!base) return null;
  const path = `/ws/exam/${encodeURIComponent(params.examId)}/class/${encodeURIComponent(params.classId)}`;
  const q = new URLSearchParams({
    role: "teacher",
    clerkToken: params.clerkToken,
  });
  return `${base}${path}?${q.toString()}`;
}
