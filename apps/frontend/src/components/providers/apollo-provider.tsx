"use client";

import type { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { getApolloClient } from "../../../apollo-client";

export function AppApolloProvider({ children }: { children: ReactNode }) {
  return <ApolloProvider client={getApolloClient()}>{children}</ApolloProvider>;
}
