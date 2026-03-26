import { exam, exams } from "./exams";
import { getAllSubjects } from "./getAllSubjects";
import { getAllTests } from "./getAllTests";
import { hello } from "./hello";
import { schools } from "./schools";
import { subjects } from "./subjects";

export const queryResolvers = {
  hello,
  schools,
  subjects,
  getAllSubjects,
  exams,
  exam,
  getAllTests,
};
