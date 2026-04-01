import type { Db } from "../db/drizzle";
import type { Env } from "../types";

export type GraphQLUserContext = {
  db: Db;
  env: Env;
  /** Clerk user id from verified session JWT (`sub`), or null if anonymous / invalid token. */
  clerkUserId: string | null;
};
