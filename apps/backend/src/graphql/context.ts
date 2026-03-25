import type { Db } from "../db/drizzle";

export type GraphQLUserContext = {
  db: Db;
};
