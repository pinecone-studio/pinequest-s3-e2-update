"use client";

import { useCallback, useEffect, useRef } from "react";
import { buildStudentExamMonitorWsUrl } from "@/lib/exam-monitor-ws-url";

export function useExamMonitorWebSocket(params: {
  examId: string;
  classId: string | null;
  token: string | null;
  enabled: boolean;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!params.enabled || !params.classId?.trim() || !params.token?.trim()) {
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
          hypothesisId: "H2",
          location: "use-exam-monitor-ws.ts:guard",
          message: "ws skipped preconditions",
          data: {
            enabled: params.enabled,
            hasClassId: Boolean(params.classId?.trim()),
            hasToken: Boolean(params.token?.trim()),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return;
    }

    const url = buildStudentExamMonitorWsUrl({
      examId: params.examId,
      classId: params.classId.trim(),
      xExamToken: params.token.trim(),
    });
    if (!url) {
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
          location: "use-exam-monitor-ws.ts:buildUrl",
          message: "student ws url null after build",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return;
    }

    let cancelled = false;
    let attempt = 0;

    const clearReconnect = () => {
      if (reconnectTimerRef.current != null) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const connect = () => {
      if (cancelled) return;
      clearReconnect();
      let safeHost = "";
      let safeProto = "";
      try {
        const u = new URL(url);
        safeHost = u.hostname;
        safeProto = u.protocol.replace(":", "");
      } catch {
        /* ignore */
      }
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
          location: "use-exam-monitor-ws.ts:connect",
          message: "student WebSocket connect attempt",
          data: { wsHost: safeHost, wsProto: safeProto, attempt },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        attempt = 0;
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
            hypothesisId: "H4",
            location: "use-exam-monitor-ws.ts:onopen",
            message: "student WebSocket open",
            data: { wsHost: safeHost },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
      };

      ws.onclose = (ev) => {
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
            hypothesisId: "H3",
            location: "use-exam-monitor-ws.ts:onclose",
            message: "student WebSocket close",
            data: {
              code: ev.code,
              wasClean: ev.wasClean,
              reasonLen: ev.reason?.length ?? 0,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        wsRef.current = null;
        if (cancelled) return;
        attempt += 1;
        const delay = Math.min(30_000, 1000 * 2 ** Math.min(attempt, 5));
        reconnectTimerRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
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
            hypothesisId: "H4",
            location: "use-exam-monitor-ws.ts:onerror",
            message: "student WebSocket error event",
            data: { wsHost: safeHost },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        /* onclose дахин холбоно */
      };
    };

    connect();

    return () => {
      cancelled = true;
      clearReconnect();
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [params.enabled, params.examId, params.classId, params.token]);

  const sendTelemetry = useCallback((payload: Record<string, unknown>) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    try {
      ws.send(JSON.stringify({ v: 1, ...payload }));
    } catch {
      /* ignore */
    }
  }, []);

  return { sendTelemetry };
}
