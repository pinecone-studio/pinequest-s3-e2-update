import { GraphQLResolveInfo } from "graphql";
import { GraphQLUserContext } from "../../context";
import { testTable } from "../../../db/schema";
import { desc } from "drizzle-orm";

export async function getAllTests(_: unknown, __: unknown, ctx: GraphQLUserContext, _info: GraphQLResolveInfo) {
  return await ctx.db.select().from(testTable).orderBy(desc(testTable.createdAt));
}