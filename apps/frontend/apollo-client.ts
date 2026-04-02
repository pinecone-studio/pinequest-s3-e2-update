import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

export function getGraphqlUri() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  // If no env is provided, prefer same-origin proxy (service binding).
  if (!backendUrl) return "/api/graphql";

  // Allow passing a relative URL like "/api/graphql" in env.
  if (backendUrl.startsWith("/")) return backendUrl;

  return backendUrl.endsWith("/graphql")
    ? backendUrl
    : `${backendUrl.replace(/\/+$/, "")}/graphql`;
}

export type CreateApolloClientOptions = {
  /** Clerk session JWT; omitted on SSR / when anonymous. */
  getToken?: () => Promise<string | null>;
  /** Сурагчийн шалгалтын token (`x-exam-token`); синхрон уншина. */
  getExamToken?: () => string | null;
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
    let examToken: string | null = null;
    if (options?.getExamToken) {
      try {
        examToken = options.getExamToken();
      } catch {
        examToken = null;
      }
    }
    const headers = {
      ...normalizeHeaders(prevContext.headers),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(examToken ? { "x-exam-token": examToken } : {}),
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
