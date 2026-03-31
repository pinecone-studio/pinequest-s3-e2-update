import { getClassBySchoolId } from "./classAndStudent/getClassBySchoold";
import { getClassByTeacherAndSchoolId } from "./classAndStudent/getClassByTeacherAndSchoolId";
import { getStudentByClassId } from "./classAndStudent/getStudentByClassId";
import { getAllExams } from "./exam/getAllExams";
import { getExamById } from "./exam/getExamById";
import { hello } from "./hello";
import { getAllSubject } from "./subjectSchoolAndTeachers/getAllSubjects";
import { getSchoolByClerkId } from "./subjectSchoolAndTeachers/getSchoolByClerkId";
import { getTeachersBySchoolId } from "./subjectSchoolAndTeachers/getTeachersBySchoolId";
import { getAllTests } from "./testAndOpenExircices/getAllTests";
import { getOpenExerciesBySubjectAndGrade } from "./testAndOpenExircices/getOpenExerciesBySubjectAndGrade";
import { getTestsBySybjectAndGrade } from "./testAndOpenExircices/getTestsBySubjectAndGrade";

export const queryResolvers = {
  hello,
  getAllTests,
  getStudentByClassId,
  getClassBySchoolId,
  getSchoolByClerkId,
  getTeachersBySchoolId,
  getAllExams,
  getExamById,
  getAllSubject,
  getTestsBySybjectAndGrade,
  getClassByTeacherAndSchoolId,
  getOpenExerciesBySubjectAndGrade,
};
