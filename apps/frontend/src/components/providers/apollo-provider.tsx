"use client";

import { useAuth } from "@clerk/nextjs";
import { ApolloProvider } from "@apollo/client/react";
import { useMemo, type ReactNode } from "react";
import { createApolloClient } from "../../../apollo-client";

export function AppApolloProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();

  const client = useMemo(
    () =>
      createApolloClient({
        getToken: async () => (await getToken()) ?? null,
      }),
    [getToken],
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
