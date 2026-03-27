import { GraphQLUserContext } from "../../context";
import { GraphQLResolveInfo } from "graphql";
import { studentTable } from "../../../db/schema";
import { eq } from "drizzle-orm";

export default async function getStudentById(
  _parent: unknown,
  args: { id: string },
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  return ctx.db.select().from(studentTable).where(eq(studentTable.id, args.id));
}