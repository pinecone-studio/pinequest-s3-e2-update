import { eq } from "drizzle-orm";
import { classTable, studentTable } from "../../../../db/schema";
import { assertSchoolAdminOwnsSchoolId } from "../../../../lib/school-admin-guard";
import { GraphQLUserContext } from "../../../context";

type Input = {
  id: string;
  classId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  studentCode?: string | null;
};

async function classSchoolId(
  ctx: GraphQLUserContext,
  classId: string,
): Promise<string> {
  const rows = await ctx.db
    .select()
    .from(classTable)
    .where(eq(classTable.id, classId.trim()));
  const c = rows[0];
  if (!c) throw new Error("Анги олдсонгүй.");
  return c.schoolId;
}

export const updateStudent = async (
  _p: unknown,
  args: { input: Input },
  ctx: GraphQLUserContext,
) => {
  const id = args.input.id.trim();
  const rows = await ctx.db.select().from(studentTable).where(eq(studentTable.id, id));
  const existing = rows[0];
  if (!existing) throw new Error("Сурагч олдсонгүй.");

  const currentSchool = await classSchoolId(ctx, existing.classId);
  await assertSchoolAdminOwnsSchoolId(ctx, currentSchool);

  let nextClassId = existing.classId;
  if (args.input.classId != null && args.input.classId.trim() !== "") {
    nextClassId = args.input.classId.trim();
    const nextSchool = await classSchoolId(ctx, nextClassId);
    if (nextSchool !== currentSchool) {
      await assertSchoolAdminOwnsSchoolId(ctx, nextSchool);
    }
  }

  const firstName = (args.input.firstName?.trim() ?? existing.firstName) || existing.firstName;
  const lastName = (args.input.lastName?.trim() ?? existing.lastName) || existing.lastName;
  const email =
    args.input.email !== undefined
      ? args.input.email?.trim() || null
      : existing.email;
  const studentCode =
    args.input.studentCode != null && args.input.studentCode.trim() !== ""
      ? args.input.studentCode.trim()
      : existing.studentCode;

  const now = new Date().toISOString();
  await ctx.db
    .update(studentTable)
    .set({
      classId: nextClassId,
      firstName,
      lastName,
      email,
      studentCode,
      updatedAt: now,
    })
    .where(eq(studentTable.id, id));

  return {
    ...existing,
    classId: nextClassId,
    firstName,
    lastName,
    email,
    studentCode,
    updatedAt: now,
  };
};
