import { eq } from "drizzle-orm";
import { teacherTable } from "../../../../db/schema";
import { assertSchoolAdminOwnsSchoolId } from "../../../../lib/school-admin-guard";
import { parseTeacherClassIdsJson, serializeTeacherClassIds } from "../../../../lib/teacher-class-ids";
import { GraphQLUserContext } from "../../../context";

type Input = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role?: string | null;
  myClassId?: string | null;
  classIds?: string[] | null;
};

export const updateTeacher = async (
  _p: unknown,
  args: { input: Input },
  ctx: GraphQLUserContext,
) => {
  const id = args.input.id.trim();
  const rows = await ctx.db.select().from(teacherTable).where(eq(teacherTable.id, id));
  const existing = rows[0];
  if (!existing) throw new Error("Багш олдсонгүй.");

  await assertSchoolAdminOwnsSchoolId(ctx, existing.schoolId);

  const firstName =
    (args.input.firstName?.trim() ?? existing.firstName) || existing.firstName;
  const lastName =
    (args.input.lastName?.trim() ?? existing.lastName) || existing.lastName;
  const email = (args.input.email?.trim() ?? existing.email) || existing.email;
  const role = (args.input.role?.trim() ?? existing.role) || existing.role;

  let myClassId = existing.myClassId;
  if (args.input.myClassId !== undefined) {
    const raw = args.input.myClassId?.trim();
    myClassId = raw && raw.length > 0 ? raw : null;
  }

  let classIdsJson = existing.classIds;
  if (args.input.classIds != null) {
    classIdsJson = serializeTeacherClassIds(args.input.classIds);
  }

  const now = new Date().toISOString();
  await ctx.db
    .update(teacherTable)
    .set({
      firstName,
      lastName,
      email,
      role,
      myClassId,
      classIds: classIdsJson,
      updatedAt: now,
    })
    .where(eq(teacherTable.id, id));

  return {
    ...existing,
    firstName,
    lastName,
    email,
    role,
    myClassId,
    classIds: parseTeacherClassIdsJson(classIdsJson),
    updatedAt: now,
  };
};
