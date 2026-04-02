"use client";

import { useAuth } from "@clerk/nextjs";
import { ApolloProvider } from "@apollo/client/react";
import { useMemo, type ReactNode } from "react";
import { createApolloClient } from "../../../apollo-client";
import { STUDENT_EXAM_TOKEN_STORAGE_KEY } from "@/app/student/_lib/exam-session-storage";

export function AppApolloProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();

  const client = useMemo(
    () =>
      createApolloClient({
        getToken: async () => (await getToken()) ?? null,
        getExamToken: () => {
          if (typeof window === "undefined") return null;
          try {
            return sessionStorage.getItem(STUDENT_EXAM_TOKEN_STORAGE_KEY);
          } catch {
            return null;
          }
        },
      }),
    [getToken],
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
