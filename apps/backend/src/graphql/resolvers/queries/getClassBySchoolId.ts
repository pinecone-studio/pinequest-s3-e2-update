import { GraphQLResolveInfo } from "graphql";
import { GraphQLUserContext } from "../../context";
import { classTable } from "../../../db/schema";
import { eq } from "drizzle-orm";

export default async function getClassBySchoolId(
  _parent: unknown,
  args: { schoolId: string },
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  return ctx.db.select().from(classTable).where(eq(classTable.schoolId, args.schoolId));
}