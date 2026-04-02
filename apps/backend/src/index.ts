import type { GraphQLSchema } from "graphql";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { getDb } from "./db/drizzle";
import { schema } from "./graphql";
import { handleClerkWebhook } from "./clerk-webhook";
import type { GraphQLUserContext } from "./graphql/context";
import { clerkUserIdFromRequest } from "./lib/clerk-bearer";
import { examSessionFromRequest } from "./lib/exam-session-from-request";
import { resolveGraphqlCorsOrigin } from "./lib/cors-allowed-origins";
import { handleExamMonitorWebSocketUpgrade } from "./lib/ws-exam-monitor-upgrade";
import type { Env } from "./types";

const graphqlCorsHeaders = [
  "content-type",
  "apollo-require-preflight",
  "authorization",
  "x-apollo-operation-name",
  "x-exam-token",
] as const;

const yoga = createYoga<{ env: Env }, GraphQLUserContext>({
  schema: schema as GraphQLSchema,
  graphqlEndpoint: "/graphql",
  graphiql: true,
  /** Hono `cors()` дээр тохируулна (request бүрт `CORS_ORIGINS` уншина). */
  cors: false,
  context: async ({ request, env }) => ({
    db: getDb(env),
    env,
    clerkUserId: await clerkUserIdFromRequest(request, env),
    examSession: await examSessionFromRequest(request, env),
  }),
});

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) =>
  c.json({
    ok: true,
    graphql: "/graphql",
    webhooks: "POST /webhooks/clerk",
    graphiql: "GET /graphql (GraphiQL when enabled)",
    examMonitorWebSocket:
      "GET /ws/exam/:examId/class/:classId (Upgrade: websocket; student ?xExamToken=, teacher ?role=teacher&clerkToken=)",
  }),
);

app.post("/webhooks/clerk", (c) => handleClerkWebhook(c.req.raw, c.env));

app.use(
  "/graphql",
  cors({
    origin: (origin, c) =>
      resolveGraphqlCorsOrigin(origin, c.req.url, c.env as Env),
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowHeaders: [...graphqlCorsHeaders],
  }),
);

app.get("/ws/exam/:examId/class/:classId", async (c) => {
  if (c.req.raw.headers.get("Upgrade") !== "websocket") {
    return c.text("WebSocket upgrade required (Upgrade: websocket)", 400);
  }
  return handleExamMonitorWebSocketUpgrade(c.req.raw, c.env);
});

app.all("/graphql", (c) =>
  yoga.fetch(c.req.raw, {
    env: c.env,
  }),
);

export { ExamMonitorRoom } from "./durable/exam-monitor-room";
export default app;
