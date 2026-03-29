import { examTypeDefs } from "./schema/exam";
import { mutationTypeDefs } from "./mutations/mutation";
import { queryTypeDefs } from "./queris/query";
import { schoolTypeDefs } from "./schema/school";
import { subjectTypeDefs } from "./schema/subject";
import { teacherTypeDefs } from "./schema/teacher";
import { testTypeDefs } from "./schema/tests";
import { openExerciesTypeDefs } from "./schema/openExercies";
import { studentTypeDefs } from "./schema/student";
import { classTypeDefs } from "./schema/class";
import { examCheatLogTypeDefs } from "./schema/examCheatLog";
import { studentExamResultTypeDefs } from "./schema/studentExamResult";
import { scalarTypeDefs } from "./scalarTypeDefs";

export const typeDefs = [
  scalarTypeDefs,
  openExerciesTypeDefs,
  studentTypeDefs,
  teacherTypeDefs,
  classTypeDefs,
  testTypeDefs,
  examTypeDefs,
  examCheatLogTypeDefs,
  studentExamResultTypeDefs,
  schoolTypeDefs,
  subjectTypeDefs,
  queryTypeDefs,
  mutationTypeDefs,
].join("\n");
