import { eq } from "drizzle-orm";
import { classTable, studentTable } from "../../../../db/schema";
import { assertSchoolAdminOwnsSchoolId } from "../../../../lib/school-admin-guard";
import { GraphQLUserContext } from "../../../context";

export const deleteStudent = async (
  _p: unknown,
  args: { id: string },
  ctx: GraphQLUserContext,
) => {
  const id = args.id.trim();
  const rows = await ctx.db.select().from(studentTable).where(eq(studentTable.id, id));
  const existing = rows[0];
  if (!existing) throw new Error("Сурагч олдсонгүй.");

  const classRows = await ctx.db
    .select()
    .from(classTable)
    .where(eq(classTable.id, existing.classId));
  const c = classRows[0];
  if (!c) throw new Error("Анги олдсонгүй.");
  await assertSchoolAdminOwnsSchoolId(ctx, c.schoolId);

  await ctx.db.delete(studentTable).where(eq(studentTable.id, id));
  return true;
};
