export interface Env {
  exam_grade_db: D1Database;
  /** Шалгалт + ангийн realtime хяналтын өрөө (WebSocket). */
  EXAM_MONITOR_ROOM: DurableObjectNamespace;
  /** Clerk secret key (`wrangler secret put CLERK_SECRET_KEY` / `.dev.vars`). */
  CLERK_SECRET_KEY?: string;
  /**
   * Optional PEM JWT public key from Clerk Dashboard → API keys → JWT public key.
   * When set, session JWTs verify without calling the Clerk JWKS API (reliable on Workers).
   */
  CLERK_JWT_KEY?: string;
  /** Clerk webhook signing secret (Dashboard → Webhooks → Endpoint signing secret). */
  CLERK_WEBHOOK_SIGNING_SECRET?: string;
  /** HMAC secret for student exam tokens. */
  EXAM_TOKEN_SECRET?: string;
}
