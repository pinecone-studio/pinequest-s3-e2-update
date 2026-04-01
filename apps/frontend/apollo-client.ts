import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

export function getGraphqlUri() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!backendUrl) {
    return "https://backend.pureverdenej93.workers.dev";
  }

  return backendUrl.endsWith("/graphql")
    ? backendUrl
    : `${backendUrl.replace(/\/+$/, "")}/graphql`;
}

export type CreateApolloClientOptions = {
  /** Clerk session JWT; omitted on SSR / when anonymous. */
  getToken?: () => Promise<string | null>;
};

function normalizeHeaders(headers: unknown): Record<string, string> {
  if (!headers || typeof headers !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
    if (v === undefined || v === null) continue;
    out[k] = String(v);
  }
  return out;
}

export function createApolloClient(options?: CreateApolloClientOptions) {
  const httpLink = new HttpLink({
    uri: getGraphqlUri(),
  });

  const authLink = new SetContextLink(async (prevContext) => {
    const getToken = options?.getToken;
    let token: string | null = null;
    if (getToken) {
      try {
        token = await getToken();
      } catch {
        token = null;
      }
    }
    const headers = {
      ...normalizeHeaders(prevContext.headers),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    };
    return { headers };
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  });
}

export const graphqlEndpoint = getGraphqlUri();
