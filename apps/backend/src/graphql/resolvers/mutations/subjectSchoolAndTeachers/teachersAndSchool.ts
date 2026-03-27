import type { GraphQLResolveInfo } from "graphql";
import { teacherTable } from "../../../../db/schema/teacherTable";
import type { GraphQLUserContext } from "../../../context";

export async function addTeacher(
  _parent: unknown,
  args: { schoolId: string; name: string },
  ctx: GraphQLUserContext,
  _info: GraphQLResolveInfo,
) {
  const id = crypto.randomUUID();
  await ctx.db.insert(teacherTable).values({
    id,
    schoolId: args.schoolId,
    name: args.name,
  });
  return { id, schoolId: args.schoolId, name: args.name };
}
