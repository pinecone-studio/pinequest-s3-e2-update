import { examTypeDefs } from "./exam";
import { mutationTypeDefs } from "./mutation";
import { queryTypeDefs } from "./query";
import { schoolTypeDefs } from "./school";
import { subjectTypeDefs } from "./subject";
import { teacherTypeDefs } from "./teacher";

export const typeDefs = [
  schoolTypeDefs,
  teacherTypeDefs,
  subjectTypeDefs,
  examTypeDefs,
  queryTypeDefs,
  mutationTypeDefs,
].join("\n");
