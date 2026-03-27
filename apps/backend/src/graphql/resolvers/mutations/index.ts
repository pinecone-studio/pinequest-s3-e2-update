import { createTest } from "./testAndOpenExircices/createTests";
import { createSubject } from "./subjectSchoolAndTeachers/createSubject";
import { createExam } from "./exams/examAndGrades";
import { incrementTestUsage } from "./testAndOpenExircices/incrementTestUsage";
import { addTeacher } from "./subjectSchoolAndTeachers/teachersAndSchool";
import { updateTest } from "./testAndOpenExircices/updateTest";

export const mutationResolvers = {
  addTeacher,
  createSubject,
  createExam,
  createTest,
  updateTest,
  incrementTestUsage,
};
