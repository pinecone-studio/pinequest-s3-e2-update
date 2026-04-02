import type { Env } from "../types";

/** Apollo Sandbox, GraphiQL, local Next/Wrangler — үргэлж зөвшөөрнө. */
export const DEFAULT_CORS_ORIGINS: readonly string[] = [
  "https://studio.apollographql.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:8787",
  "http://127.0.0.1:8787",
  "https://my-app.pureverdenej93.workers.dev",
];

/**
 * `wrangler vars` / Dashboard: `CORS_ORIGINS` — таслалаар тусгаарласан absolute origin.
 * Жишээ: `https://my-app.workers.dev,https://app.example.com`
 */
export function parseExtraCorsOrigins(env: Env): string[] {
  const raw = env.CORS_ORIGINS?.trim();
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export function getAllowedCorsOrigins(env: Env): string[] {
  return [...DEFAULT_CORS_ORIGINS, ...parseExtraCorsOrigins(env)];
}

/** Cross-origin жагсаалт + ижил Worker URL дээрх GraphiQL (`Origin` === request origin). */
export function resolveGraphqlCorsOrigin(
  originHeader: string,
  requestUrl: string,
  env: Env,
): string | null {
  const origin = originHeader.trim();
  if (!origin) return null;
  const allowed = getAllowedCorsOrigins(env);
  if (allowed.includes(origin)) return origin;
  try {
    if (origin === new URL(requestUrl).origin) return origin;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Browser WebSocket ихэвчлэн Origin илгээнэ. Байхгүй бол (жижиг тест) зөвшөөрнө.
 * Байгаа бол жагсаалт эсвэл Worker-ийн өөрийн public origin-той таарах ёстой.
 */
export function isWebSocketOriginAllowed(
  origin: string | null,
  env: Env,
  requestUrl: string,
): boolean {
  const o = origin?.trim();
  if (!o) return true;
  if (getAllowedCorsOrigins(env).includes(o)) return true;
  try {
    return o === new URL(requestUrl).origin;
  } catch {
    return false;
  }
}
