import { examTypeDefs } from "./exam";
import { mutationTypeDefs } from "./mutation";
import { queryTypeDefs } from "./query";
import { schoolTypeDefs } from "./school";
import { teacherTypeDefs } from "./teacher";

export const typeDefs = [
  schoolTypeDefs,
  teacherTypeDefs,
  examTypeDefs,
  queryTypeDefs,
  mutationTypeDefs,
].join("\n");
