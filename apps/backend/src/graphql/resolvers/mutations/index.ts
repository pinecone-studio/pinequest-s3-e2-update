import { createTest } from "./createTests";
import { createSubject } from "./createSubject";
import { createExam } from "./examAndGrades";
import { incrementTestUsage } from "./incrementTestUsage";
import { addTeacher } from "./teachersAndSchool";
import { updateTest } from "./updateTest";

export const mutationResolvers = {
  addTeacher,
  createSubject,
  createExam,
  createTest,
  updateTest,
  incrementTestUsage,
};
