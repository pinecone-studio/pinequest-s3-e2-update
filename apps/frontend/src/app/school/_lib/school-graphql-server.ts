/** @format */

import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

import { getGraphqlUri } from "../../../../apollo-client";

type GraphqlEnvelope<T> = {
  data?: T;
  errors?: { message: string }[];
};

function buildSchoolGraphqlUrl(proto: string, host: string): string {
  const uri = getGraphqlUri();
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }
  const path = uri.startsWith("/") ? uri : `/${uri}`;
  return `${proto}://${host}${path}`;
}

function formatNonJsonError(
  res: Response,
  text: string,
): Error {
  const snippet = text.slice(0, 240);
  const ct = res.headers.get("content-type") ?? "unknown";
  const parts = [
    `GraphQL response was not JSON (status ${res.status}, content-type: ${ct}).`,
    snippet.length > 0 ? `Body: ${snippet}` : "Body: (empty)",
  ];
  return new Error(parts.join(" "));
}

export async function schoolGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "127.0.0.1:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const url = buildSchoolGraphqlUrl(proto, host);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  let json: GraphqlEnvelope<T>;
  try {
    json = JSON.parse(text) as GraphqlEnvelope<T>;
  } catch {
    throw formatNonJsonError(res, text);
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  if (!res.ok) {
    const fallback =
      json.errors?.[0]?.message ??
      (text.length > 0 ? text.slice(0, 240) : null) ??
      `HTTP ${res.status}`;
    throw new Error(fallback);
  }
  if (json.data === undefined) {
    throw new Error("GraphQL: ямар ч өгөгдөл ирээгүй.");
  }
  return json.data;
}
