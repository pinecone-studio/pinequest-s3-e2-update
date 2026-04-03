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
      return;
    }

    const url = buildStudentExamMonitorWsUrl({
      examId: params.examId,
      classId: params.classId.trim(),
      xExamToken: params.token.trim(),
    });
    if (!url) return;

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
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        attempt = 0;
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (cancelled) return;
        attempt += 1;
        const delay = Math.min(30_000, 1000 * 2 ** Math.min(attempt, 5));
        reconnectTimerRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
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
