import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

function getGraphqlUri() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!backendUrl) {
    return "http://localhost:8787/graphql";
  }

  return backendUrl.endsWith("/graphql") ? backendUrl : `${backendUrl.replace(/\/+$/, "")}/graphql`;
}

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: getGraphqlUri(),
    }),
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

let browserApolloClient: ApolloClient | null = null;

export function getApolloClient() {
  if (typeof window === "undefined") {
    return createApolloClient();
  }

  if (!browserApolloClient) {
    browserApolloClient = createApolloClient();
  }

  return browserApolloClient;
}

export const graphqlEndpoint = getGraphqlUri();
