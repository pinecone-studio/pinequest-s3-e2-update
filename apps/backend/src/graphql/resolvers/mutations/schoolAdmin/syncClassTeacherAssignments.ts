import { eq } from "drizzle-orm";
import { classTable, teacherTable } from "../../../../db/schema";
import { assertSchoolAdminOwnsSchoolId } from "../../../../lib/school-admin-guard";
import { parseTeacherClassIdsJson, serializeTeacherClassIds } from "../../../../lib/teacher-class-ids";
import { GraphQLUserContext } from "../../../context";

type Input = {
  classId: string;
  teacherIds: string[];
};

export const syncClassTeacherAssignments = async (
  _p: unknown,
  args: { input: Input },
  ctx: GraphQLUserContext,
) => {
  const classId = args.input.classId.trim();
  const desired = [
    ...new Set(
      args.input.teacherIds.map((x) => x.trim()).filter((x) => x.length > 0),
    ),
  ];

  const classRows = await ctx.db
    .select()
    .from(classTable)
    .where(eq(classTable.id, classId));
  const klass = classRows[0];
  if (!klass) throw new Error("Анги олдсонгүй.");

  await assertSchoolAdminOwnsSchoolId(ctx, klass.schoolId);

  const teachers = await ctx.db
    .select()
    .from(teacherTable)
    .where(eq(teacherTable.schoolId, klass.schoolId));

  const teacherIdInSchool = new Set(teachers.map((t) => t.id));
  for (const tid of desired) {
    if (!teacherIdInSchool.has(tid)) {
      throw new Error("Сонгосон багш энэ сургуульд харъяалагдах ёстой.");
    }
  }

  const desiredSet = new Set(desired);
  const now = new Date().toISOString();

  for (const t of teachers) {
    const ids = parseTeacherClassIdsJson(t.classIds);
    const set = new Set(ids);
    if (desiredSet.has(t.id)) set.add(classId);
    else set.delete(classId);
    const next = serializeTeacherClassIds([...set]);
    await ctx.db
      .update(teacherTable)
      .set({ classIds: next, updatedAt: now })
      .where(eq(teacherTable.id, t.id));
  }

  return true;
};
