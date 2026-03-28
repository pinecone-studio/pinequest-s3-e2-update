import { getClassBySchoolId } from "./classAndStudent/getClassBySchoold";
import { getStudentByClassId } from "./classAndStudent/getStudentByClassId";
import { getAllExams } from "./exam/getAllExams";
import { getExamById } from "./exam/getExamById";
import { hello } from "./hello";
import { getSchoolByClerkId } from "./subjectSchoolAndTeachers/getSchoolByClerkId";
import { getTeachersBySchoolId } from "./subjectSchoolAndTeachers/getTeachersBySchoolId";
import { getAllTests } from "./testAndOpenExircices/getAllTests";

export const queryResolvers = {
  hello,
  getAllTests,
  getStudentByClassId,
  getClassBySchoolId,
  getSchoolByClerkId,
  getTeachersBySchoolId,
  getAllExams,
  getExamById,
};
