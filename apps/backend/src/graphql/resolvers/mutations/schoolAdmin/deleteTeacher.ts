import { eq } from "drizzle-orm";
import { teacherTable } from "../../../../db/schema";
import { assertSchoolAdminOwnsSchoolId } from "../../../../lib/school-admin-guard";
import { GraphQLUserContext } from "../../../context";

export const deleteTeacher = async (
  _p: unknown,
  args: { id: string },
  ctx: GraphQLUserContext,
) => {
  const id = args.id.trim();
  const rows = await ctx.db.select().from(teacherTable).where(eq(teacherTable.id, id));
  const existing = rows[0];
  if (!existing) throw new Error("Багш олдсонгүй.");

  await assertSchoolAdminOwnsSchoolId(ctx, existing.schoolId);

  await ctx.db.delete(teacherTable).where(eq(teacherTable.id, id));
  return true;
};
