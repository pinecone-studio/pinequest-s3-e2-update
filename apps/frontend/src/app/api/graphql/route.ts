import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getGraphqlUri } from "../../../../apollo-client";

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
      "content-type, authorization, apollo-require-preflight, x-apollo-operation-name, x-exam-token",
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
  const origin = request.headers.get("origin");
  const bodyBuffer = await request.arrayBuffer();
  const headersForUpstream = new Headers(request.headers);
  headersForUpstream.delete("content-length");

  async function proxyViaDevHttp(): Promise<Response> {
    const uri = getGraphqlUri();
    if (!uri.startsWith("http://") && !uri.startsWith("https://")) {
      return new Response(
        JSON.stringify({
          errors: [
            {
              message:
                "GraphQL proxy: service binding unavailable and NEXT_PUBLIC_BACKEND_URL is unset or not an absolute URL.",
            },
          ],
        }),
        { status: 502, headers: { "content-type": "application/json" } },
      );
    }

    return fetch(uri, {
      method: "POST",
      headers: headersForUpstream,
      body: bodyBuffer,
      redirect: "manual",
    });
  }

  try {
    const { env } = getCloudflareContext();
    const backend = (env as { BACKEND?: Fetcher }).BACKEND;
    if (backend) {
      const upstreamReq = new Request("https://backend/graphql", {
        method: "POST",
        headers: headersForUpstream,
        body: bodyBuffer,
        redirect: "manual",
      });
      const res = await backend.fetch(upstreamReq);
      return withCorsHeaders(res, origin);
    }
  } catch {
    /* plain `next dev` has no Cloudflare context — fall through */
  }

  return withCorsHeaders(await proxyViaDevHttp(), origin);
}
