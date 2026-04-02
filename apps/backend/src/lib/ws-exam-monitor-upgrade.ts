import { and, eq } from "drizzle-orm";
import {
  examAllowedClassTable,
  examTable,
  studentTable,
  teacherTable,
} from "../db/schema";
import { getDb } from "../db/drizzle";
import type { Env } from "../types";
import { isWebSocketOriginAllowed } from "./cors-allowed-origins";
import { clerkUserIdFromRequest } from "./clerk-bearer";
import { verifyExamToken } from "./exam-token";

const PATH_RE = /^\/ws\/exam\/([^/]+)\/class\/([^/]+)$/;

/**
 * Browser WebSocket нь custom header илгээж чаддаггүй тул query-аар дамжуулна.
 * - Сурагч: `?xExamToken=<v1....>`
 * - Багш: `?role=teacher&clerkToken=<Clerk session JWT>`
 */
export async function handleExamMonitorWebSocketUpgrade(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.headers.get("Upgrade") !== "websocket") {
    return new Response("Expected Upgrade: websocket", { status: 426 });
  }

  const origin = request.headers.get("Origin");
  const originAllowed = isWebSocketOriginAllowed(origin, env, request.url);
  const url = new URL(request.url);
  const roleParamEarly = url.searchParams.get("role")?.trim().toLowerCase();
  // #region agent log
  console.log(
    JSON.stringify({
      sessionId: "9f3746",
      runId: "pre-fix",
      hypothesisId: "H3",
      location: "ws-exam-monitor-upgrade.ts:entry",
      message: "ws_upgrade_request",
      data: {
        originPresent: Boolean(origin?.trim()),
        originAllowed,
        pathname: url.pathname,
        roleTeacher: roleParamEarly === "teacher",
      },
      timestamp: Date.now(),
    }),
  );
  // #endregion
  if (!originAllowed) {
    // #region agent log
    console.log(
      JSON.stringify({
        sessionId: "9f3746",
        runId: "pre-fix",
        hypothesisId: "H3",
        location: "ws-exam-monitor-upgrade.ts:forbidden_origin",
        message: "ws_reject",
        data: { status: 403, branch: "forbidden_origin" },
        timestamp: Date.now(),
      }),
    );
    // #endregion
    return new Response("Forbidden origin", { status: 403 });
  }
  const pathMatch = url.pathname.match(PATH_RE);
  if (!pathMatch) {
    return new Response("Not found", { status: 404 });
  }

  const examId = pathMatch[1]!.trim();
  const classId = pathMatch[2]!.trim();
  if (!examId || !classId) {
    return new Response("Bad path", { status: 400 });
  }

  const db = getDb(env);
  const roleParam = url.searchParams.get("role")?.trim().toLowerCase();

  let monitorRole: "student" | "teacher";
  let userId: string;

  if (roleParam === "teacher") {
    const clerkToken = url.searchParams.get("clerkToken")?.trim();
    if (!clerkToken) {
      return new Response("Missing clerkToken", { status: 401 });
    }
    const authReq = new Request(request.url, {
      headers: { Authorization: `Bearer ${clerkToken}` },
    });
    const clerkUserId = await clerkUserIdFromRequest(authReq, env);
    if (!clerkUserId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const teachers = await db
      .select()
      .from(teacherTable)
      .where(eq(teacherTable.clerkId, clerkUserId))
      .limit(1);
    const teacher = teachers[0];
    if (!teacher) {
      return new Response("Teacher not linked", { status: 403 });
    }

    const exams = await db
      .select()
      .from(examTable)
      .where(eq(examTable.id, examId))
      .limit(1);
    const exam = exams[0];
    if (!exam) {
      return new Response("Exam not found", { status: 404 });
    }
    if (teacher.schoolId !== exam.schoolId) {
      return new Response("Forbidden", { status: 403 });
    }

    const allowedRows = await db
      .select()
      .from(examAllowedClassTable)
      .where(
        and(
          eq(examAllowedClassTable.examId, examId),
          eq(examAllowedClassTable.classId, classId),
        ),
      )
      .limit(1);
    if (!allowedRows[0]) {
      return new Response("Class not allowed for this exam", { status: 403 });
    }

    monitorRole = "teacher";
    userId = teacher.id;
  } else {
    const token = url.searchParams.get("xExamToken")?.trim();
    if (!token) {
      return new Response("Missing xExamToken", { status: 401 });
    }
    const secret = env.EXAM_TOKEN_SECRET?.trim();
    if (!secret) {
      return new Response("Server misconfigured", { status: 500 });
    }
    const verified = await verifyExamToken(token, secret);
    if (!verified) {
      return new Response("Invalid token", { status: 401 });
    }
    if (verified.examId !== examId) {
      return new Response("Token exam mismatch", { status: 403 });
    }

    const students = await db
      .select()
      .from(studentTable)
      .where(eq(studentTable.id, verified.studentId))
      .limit(1);
    const student = students[0];
    if (!student) {
      return new Response("Student not found", { status: 403 });
    }
    if (student.classId !== classId) {
      return new Response("Class mismatch", { status: 403 });
    }

    const allowedRows = await db
      .select()
      .from(examAllowedClassTable)
      .where(
        and(
          eq(examAllowedClassTable.examId, examId),
          eq(examAllowedClassTable.classId, classId),
        ),
      )
      .limit(1);
    if (!allowedRows[0]) {
      return new Response("Class not allowed for this exam", { status: 403 });
    }

    monitorRole = "student";
    userId = student.id;
  }

  const roomKey = `${examId}:${classId}`;
  const id = env.EXAM_MONITOR_ROOM.idFromName(roomKey);
  const stub = env.EXAM_MONITOR_ROOM.get(id);

  const forwardUrl = new URL(request.url);
  forwardUrl.search = "";

  const headers = new Headers(request.headers);
  headers.set("X-Exam-Monitor-Role", monitorRole);
  headers.set("X-Exam-Monitor-User-Id", userId);

  const forward = new Request(forwardUrl.toString(), {
    method: request.method,
    headers,
  });

  // #region agent log
  console.log(
    JSON.stringify({
      sessionId: "9f3746",
      runId: "pre-fix",
      hypothesisId: "H4",
      location: "ws-exam-monitor-upgrade.ts:forward_do",
      message: "ws_upgrade_ok_forwarding_to_do",
      data: { monitorRole, hasUserId: Boolean(userId?.trim()) },
      timestamp: Date.now(),
    }),
  );
  // #endregion
  return stub.fetch(forward);
}
