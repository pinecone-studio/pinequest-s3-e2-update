import { exam, exams } from "./exams/exams";
import { getAllSubjects } from "./subjectSchoolAndTeachers/getAllSubjects";
import { getAllTests } from "./testAndOpenExircices/getAllTests";
import { hello } from "./hello";
import { schools } from "./subjectSchoolAndTeachers/schools";
import { subjects } from "./subjectSchoolAndTeachers/subjects";

export const queryResolvers = {
  hello,
  schools,
  subjects,
  getAllSubjects,
  exams,
  exam,
  getAllTests,
};
