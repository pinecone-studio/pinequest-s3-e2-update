import { parseTeacherClassIdsJson } from "../../lib/teacher-class-ids";
import { mutationResolvers } from "./mutations";
import { queryResolvers } from "./queries/index";

/**
 * DB stores `studentExamResultIds` as nullable text (JSON array); GraphQL expects [String].
 */
function studentExamResultIdsFromParent(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      // not JSON — treat as empty list for GraphQL
    }
  }
  return [];
}

export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Student: {
    studentExamResultIds: (parent: { studentExamResultIds?: unknown }) =>
      studentExamResultIdsFromParent(parent.studentExamResultIds),
  },
  Teacher: {
    classIds: (parent: { classIds?: unknown }) =>
      parseTeacherClassIdsJson(parent.classIds),
  },
};
