import { createExam } from "./exam/createExam";
import { studentExamAuth } from "./exam/studentExamAuth";
import { addStudent } from "./student/addStudent";
import { addTeacher } from "./subjectSchoolAndTeachers/addTeacher";
import { linkTeacherClerk } from "./subjectSchoolAndTeachers/linkTeacherClerk";
import { createSubject } from "./subjectSchoolAndTeachers/createSubject";
import { createOpenExercies } from "./testAndOpenExircices/createOpenExercies";
import { createTests } from "./testAndOpenExircices/createTests";

export const mutationResolvers = {
  createSubject,
  createTests,
  createOpenExercies,
  createExam,
  addStudent,
  addTeacher,
  linkTeacherClerk,
  studentExamAuth,
};
