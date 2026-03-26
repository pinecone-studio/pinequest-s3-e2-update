import { createSubject } from "./createSubject";
import { createExam } from "./examAndGrades";
import { addTeacher } from "./teachersAndSchool";

export const mutationResolvers = {
  addTeacher,
  createSubject,
  createExam,
};
