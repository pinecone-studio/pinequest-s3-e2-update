import { eq } from "drizzle-orm";
import { classTable, teacherTable } from "../../../../db/schema";
import { assertSchoolAdminOwnsSchoolId } from "../../../../lib/school-admin-guard";
import { GraphQLUserContext } from "../../../context";

type Input = {
  id: string;
  grade?: number | null;
  section?: string | null;
  sectionTeacherId?: string | null;
};

export const updateClass = async (
  _p: unknown,
  args: { input: Input },
  ctx: GraphQLUserContext,
) => {
  const id = args.input.id.trim();
  const rows = await ctx.db.select().from(classTable).where(eq(classTable.id, id));
  const existing = rows[0];
  if (!existing) throw new Error("Анги олдсонгүй.");

  await assertSchoolAdminOwnsSchoolId(ctx, existing.schoolId);

  const grade =
    args.input.grade != null ? Number(args.input.grade) : existing.grade;
  const section = (args.input.section?.trim() ?? existing.section) || existing.section;

  let sectionTeacherId = existing.sectionTeacherId;
  if (
    args.input.sectionTeacherId !== undefined &&
    args.input.sectionTeacherId !== null
  ) {
    const tid = String(args.input.sectionTeacherId).trim();
    if (!tid) {
      throw new Error("Анги даасан багш сонгоно уу.");
    }
    const teacherRows = await ctx.db
      .select()
      .from(teacherTable)
      .where(eq(teacherTable.id, tid));
    const teacher = teacherRows[0];
    if (!teacher || teacher.schoolId !== existing.schoolId) {
      throw new Error("Багш олдсонгүй эсвэл энэ сургуулийн багш биш.");
    }
    sectionTeacherId = tid;
  }

  const now = new Date().toISOString();
  await ctx.db
    .update(classTable)
    .set({
      grade,
      section,
      sectionTeacherId,
      updatedAt: now,
    })
    .where(eq(classTable.id, id));

  return {
    ...existing,
    grade,
    section,
    sectionTeacherId,
    updatedAt: now,
  };
};
