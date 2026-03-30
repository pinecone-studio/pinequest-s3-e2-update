"use client";
import { useMutation } from "@apollo/client/react";
import { CREATE_TESTS } from "../typeDefs/mutations";

export function useCreateTests() {
  const [createTests, { data, loading, error }] = useMutation(CREATE_TESTS);
  return {
    createTests,
    data,
    loading,
    error,
  };
}
