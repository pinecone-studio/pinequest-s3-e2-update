type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export function getGraphqlEndpoint(): string | null {
  const url =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:8787";
  return url ? `${url}/graphql` : null;
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const endpoint = getGraphqlEndpoint();
  if (!endpoint) {
    return { ok: false, error: "NEXT_PUBLIC_BACKEND_URL тохируулаагүй байна." };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const json = (await res.json()) as GraphQLResponse<T>;
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    if (json.errors?.length) {
      return { ok: false, error: json.errors.map((e) => e.message).join("; ") };
    }
    if (!json.data) {
      return { ok: false, error: "Өгөгдөл ирээгүй." };
    }
    return { ok: true, data: json.data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "холболтын алдаа";
    return { ok: false, error: msg };
  }
}
