import type { Env } from "../types";

type WsAttachment = {
  role: "student" | "teacher";
  userId: string;
};

/**
 * Нэг өрөө = examId + classId (`idFromName` main Worker-оос).
 * Зөвхөн нэвтэрсэн хэрэглэгчид main Worker дамжуулж холбогдоно.
 */
export class ExamMonitorRoom {
  constructor(
    private readonly ctx: DurableObjectState,
    private readonly _env: Env,
  ) {}

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const roleRaw = request.headers.get("X-Exam-Monitor-Role")?.trim();
    const role: WsAttachment["role"] =
      roleRaw === "teacher" ? "teacher" : "student";
    const userId =
      request.headers.get("X-Exam-Monitor-User-Id")?.trim() ?? "unknown";

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair) as [WebSocket, WebSocket];

    const attachment: WsAttachment = { role, userId };
    server.serializeAttachment(JSON.stringify(attachment));
    this.ctx.acceptWebSocket(server);

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const raw =
      typeof message === "string"
        ? message
        : new TextDecoder().decode(message);
    const trimmed = raw.trim();
    if (!trimmed) return;

    let sender: WsAttachment;
    try {
      const att = ws.deserializeAttachment();
      sender = JSON.parse(
        typeof att === "string" ? att : "{}",
      ) as WsAttachment;
    } catch {
      return;
    }
    if (sender.role !== "student") {
      return;
    }
    const studentId = sender.userId?.trim();
    if (!studentId || studentId === "unknown") return;

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(trimmed) as Record<string, unknown>;
      if (!body || typeof body !== "object") return;
    } catch {
      return;
    }

    const out = JSON.stringify({
      ...body,
      studentId,
    });

    for (const other of this.ctx.getWebSockets()) {
      if (other === ws) continue;
      let otherRole: string | undefined;
      try {
        const oa = other.deserializeAttachment();
        const parsed = JSON.parse(
          typeof oa === "string" ? oa : "{}",
        ) as WsAttachment;
        otherRole = parsed.role;
      } catch {
        continue;
      }
      if (otherRole !== "teacher") continue;
      try {
        other.send(out);
      } catch {
        // холболт тасарсан
      }
    }
  }

  async webSocketClose(
    _ws: WebSocket,
    _code: number,
    _reason: string,
    _wasClean: boolean,
  ) {
    // холболт платформоор хаагдана
  }
}
