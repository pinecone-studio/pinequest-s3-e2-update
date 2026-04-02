import { eq } from "drizzle-orm";
import {
  classTable,
  examAllowedClassTable,
  studentTable,
} from "../../../../db/schema";
import { assertSchoolAdminOwnsSchoolId } from "../../../../lib/school-admin-guard";
import { GraphQLUserContext } from "../../../context";

export const deleteClass = async (
  _p: unknown,
  args: { id: string },
  ctx: GraphQLUserContext,
) => {
  const id = args.id.trim();
  const rows = await ctx.db.select().from(classTable).where(eq(classTable.id, id));
  const existing = rows[0];
  if (!existing) throw new Error("Анги олдсонгүй.");

  await assertSchoolAdminOwnsSchoolId(ctx, existing.schoolId);

  const students = await ctx.db
    .select()
    .from(studentTable)
    .where(eq(studentTable.classId, id));
  if (students.length > 0) {
    throw new Error(
      `Энэ ангид ${students.length} сурагч бүртгэлтэй байна. Эхлээд сурагчдыг шилжүүлэнэ үү.`,
    );
  }

  await ctx.db
    .delete(examAllowedClassTable)
    .where(eq(examAllowedClassTable.classId, id));
  await ctx.db.delete(classTable).where(eq(classTable.id, id));
  return true;
};
