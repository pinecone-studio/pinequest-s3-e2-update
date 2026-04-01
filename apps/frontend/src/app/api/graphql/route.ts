import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

function withCorsHeaders(res: Response, origin: string | null) {
  // Same-origin /api/graphql doesn't need CORS, but adding these
  // makes local tooling and accidental cross-origin calls less painful.
  const headers = new Headers(res.headers);
  if (origin) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "origin");
    headers.set("access-control-allow-credentials", "true");
    headers.set(
      "access-control-allow-headers",
      "content-type, authorization, apollo-require-preflight, x-apollo-operation-name",
    );
    headers.set("access-control-allow-methods", "POST, OPTIONS");
  }
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return withCorsHeaders(new Response(null, { status: 204 }), origin);
}

export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  const origin = request.headers.get("origin");

  const upstreamUrl = new URL("https://backend/graphql");

  // Forward headers/body as-is. Service binding handles routing.
  const upstreamReq = new Request(upstreamUrl.toString(), {
    method: "POST",
    headers: request.headers,
    body: request.body,
    redirect: "manual",
  });

  const res = await (env as { BACKEND: Fetcher }).BACKEND.fetch(upstreamReq);
  return withCorsHeaders(res, origin);
}

