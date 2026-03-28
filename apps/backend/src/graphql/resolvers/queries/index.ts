import { getClassBySchoolId } from "./classAndStudent/getClassBySchoold";
import { getStudentByClassId } from "./classAndStudent/getStudentByClassId";
import { hello } from "./hello";
import { getSchoolByClerkId } from "./subjectSchoolAndTeachers/getSchoolByClerkId";
import { getAllTests } from "./testAndOpenExircices/getAllTests";

export const queryResolvers = {
  hello,
  getAllTests,
  getStudentByClassId,
  getClassBySchoolId,
  getSchoolByClerkId,
};
