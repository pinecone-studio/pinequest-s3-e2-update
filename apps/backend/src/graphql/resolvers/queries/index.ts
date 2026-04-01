import { getClassBySchoolId } from "./classAndStudent/getClassBySchoold";
import { getClassByTeacherAndSchoolId } from "./classAndStudent/getClassByTeacherAndSchoolId";
import { getStudentByClassId } from "./classAndStudent/getStudentByClassId";
import { getAllExams } from "./exam/getAllExams";
import { getExamById } from "./exam/getExamById";
import { getExamBySchoolId } from "./exam/getExamBySchoolId";
import { hello } from "./hello";
import { viewerClerkId } from "./viewer-clerk-id";
import { getAllSubject } from "./subjectSchoolAndTeachers/getAllSubjects";
import { getSchoolByClerkId } from "./subjectSchoolAndTeachers/getSchoolByClerkId";
import { getTeachersBySchoolId } from "./subjectSchoolAndTeachers/getTeachersBySchoolId";
import { getAllTests } from "./testAndOpenExircices/getAllTests";
import { getOpenExerciesById } from "./testAndOpenExircices/getOpenExerciesById";
import { getOpenExerciesByIds } from "./testAndOpenExircices/getOpenExerciesByIds";
import { getOpenExerciesBySubjectAndGrade } from "./testAndOpenExircices/getOpenExerciesBySubjectAndGrade";
import { getTestById } from "./testAndOpenExircices/getTestById";
import { getTestsByIds } from "./testAndOpenExircices/getTestsByIds";
import { getTestsBySybjectAndGrade } from "./testAndOpenExircices/getTestsBySubjectAndGrade";

export const queryResolvers = {
  viewerClerkId,
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
  getExamBySchoolId,
  getTestById,
  getOpenExerciesById,
  getTestsByIds,
  getOpenExerciesByIds,
};
