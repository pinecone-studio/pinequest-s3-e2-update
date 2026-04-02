/** GraphQL-тай ижил backend суурь — WebSocket протокол руу хөрвүүлнэ. */
export function backendWsBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  // #region agent log
  if (!raw) {
    fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "9f3746",
      },
      body: JSON.stringify({
        sessionId: "9f3746",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "exam-monitor-ws-url.ts:backendWsBaseUrl",
        message: "NEXT_PUBLIC_BACKEND_URL missing",
        data: { hasEnv: false },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    return null;
  }
  // #endregion
  try {
    const u = new URL(raw);
    if (typeof window !== "undefined") {
      const pageHost = window.location.hostname;
      const onLocalPage =
        pageHost === "localhost" || pageHost === "127.0.0.1";
      const backendLocal =
        u.hostname === "localhost" || u.hostname === "127.0.0.1";
      if (!onLocalPage && backendLocal) {
        // #region agent log
        fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "9f3746",
          },
          body: JSON.stringify({
            sessionId: "9f3746",
            runId: "post-fix",
            hypothesisId: "H1",
            location: "exam-monitor-ws-url.ts:localhostOnProdPage",
            message:
              "NEXT_PUBLIC_BACKEND_URL is localhost but page is not; WS disabled",
            data: { pageHost },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        return null;
      }
    }
    const wasHttps = u.protocol === "https:";
    u.protocol = wasHttps ? "wss:" : "ws:";
    u.pathname = u.pathname.replace(/\/$/, "");
    // #region agent log
    fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "9f3746",
      },
      body: JSON.stringify({
        sessionId: "9f3746",
        runId: "pre-fix",
        hypothesisId: "H5",
        location: "exam-monitor-ws-url.ts:backendWsBaseUrl",
        message: "ws base resolved",
        data: {
          wsProtocol: u.protocol.replace(":", ""),
          sourceWasHttps: wasHttps,
          host: u.hostname,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return u.origin;
  } catch {
    // #region agent log
    fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "9f3746",
      },
      body: JSON.stringify({
        sessionId: "9f3746",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "exam-monitor-ws-url.ts:backendWsBaseUrl",
        message: "NEXT_PUBLIC_BACKEND_URL parse failed",
        data: { hasEnv: true },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
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
