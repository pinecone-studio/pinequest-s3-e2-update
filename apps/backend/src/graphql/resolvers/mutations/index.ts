import { addExamAllowedClasses } from "./exam/addExamAllowedClasses";
import { startExamMonitoringForClass } from "./exam/startExamMonitoringForClass";
import { createExam } from "./exam/createExam";
import { studentExamAuth } from "./exam/studentExamAuth";
import { submitStudentExam } from "./exam/submitStudentExam";
import { addStudent } from "./student/addStudent";
import { createClass } from "./student/createClass";
import { deleteClass } from "./schoolAdmin/deleteClass";
import { deleteStudent } from "./schoolAdmin/deleteStudent";
import { deleteTeacher } from "./schoolAdmin/deleteTeacher";
import { syncClassTeacherAssignments } from "./schoolAdmin/syncClassTeacherAssignments";
import { updateClass } from "./schoolAdmin/updateClass";
import { updateStudent } from "./schoolAdmin/updateStudent";
import { updateTeacher } from "./schoolAdmin/updateTeacher";
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
  createClass,
  addTeacher,
  linkTeacherClerk,
  studentExamAuth,
  submitStudentExam,
  addExamAllowedClasses,
  startExamMonitoringForClass,
  updateClass,
  deleteClass,
  updateStudent,
  deleteStudent,
  updateTeacher,
  deleteTeacher,
  syncClassTeacherAssignments,
};
