import { createExam } from "./exam/createExam";
import { createSubject } from "./subjectSchoolAndTeachers/createSubject";
import { createOpenExercies } from "./testAndOpenExircices/createOpenExercies";
import { createTests } from "./testAndOpenExircices/createTests";

export const mutationResolvers = {
  createSubject,
  createTests,
  createOpenExercies,
  createExam,
};
