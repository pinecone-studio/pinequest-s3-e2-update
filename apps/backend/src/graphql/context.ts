import type { Db } from "../db/drizzle";

export type GraphQLUserContext = {
  db: Db;
  /** Clerk user id from verified session JWT (`sub`), or null if anonymous / invalid token. */
  clerkUserId: string | null;
};
