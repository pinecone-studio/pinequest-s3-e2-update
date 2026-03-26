import { examTypeDefs } from "./exam";
import { mutationTypeDefs } from "./mutation";
import { queryTypeDefs } from "./query";
import { schoolTypeDefs } from "./school";
import { subjectTypeDefs } from "./subject";
import { teacherTypeDefs } from "./teacher";
import { testTypeDefs } from "./tests";

export const typeDefs = [
  schoolTypeDefs,
  teacherTypeDefs,
  subjectTypeDefs,
  examTypeDefs,
  testTypeDefs,
  queryTypeDefs,
  mutationTypeDefs,
].join("\n");
