import { examTypeDefs } from "./schema/exam";
import { mutationTypeDefs } from "./mutations/mutation";
import { queryTypeDefs } from "./queris/query";
import { schoolTypeDefs } from "./schema/school";
import { subjectTypeDefs } from "./schema/subject";
import { teacherTypeDefs } from "./schema/teacher";
import { testTypeDefs } from "./schema/tests";

export const typeDefs = [
  schoolTypeDefs,
  teacherTypeDefs,
  subjectTypeDefs,
  examTypeDefs,
  testTypeDefs,
  queryTypeDefs,
  mutationTypeDefs,
].join("\n");
