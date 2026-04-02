/** @format */

"use client";

import { useQuery } from "@apollo/client/react";
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { GET_VIEWER_TEACHER } from "@/graphql/typeDefs/queries";

export type ViewerTeacherRow = {
  id: string;
  schoolId: string;
  clerkId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  myClassId: string | null;
  classIds: string[];
};

type ViewerTeacherResponse = {
  viewerTeacher: ViewerTeacherRow | null;
};

const TeacherDbContext = createContext<{
  teacher: ViewerTeacherRow | null;
  loading: boolean;
}>({ teacher: null, loading: true });

export function TeacherDbProvider({ children }: { children: ReactNode }) {
  const { data, loading } = useQuery<ViewerTeacherResponse>(GET_VIEWER_TEACHER, {
    fetchPolicy: "cache-and-network",
  });

  return (
    <TeacherDbContext.Provider
      value={{ teacher: data?.viewerTeacher ?? null, loading }}
    >
      {children}
    </TeacherDbContext.Provider>
  );
}

export function useTeacherDb() {
  return useContext(TeacherDbContext);
}
