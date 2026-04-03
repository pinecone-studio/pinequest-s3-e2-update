import { eq } from "drizzle-orm";
import { classTable, teacherTable } from "../../../../db/schema";
import { assertSchoolAdminOwnsSchoolId } from "../../../../lib/school-admin-guard";
import { GraphQLUserContext } from "../../../context";

type CreateClassInput = {
  schoolId: string;
  grade: number;
  section: string;
  sectionTeacherId: string;
};

export const createClass = async (
  _parent: unknown,
  args: { input: CreateClassInput },
  ctx: GraphQLUserContext,
) => {
  const schoolId = args.input.schoolId.trim();
  await assertSchoolAdminOwnsSchoolId(ctx, schoolId);

  const section = args.input.section.trim();
  const sectionTeacherId = args.input.sectionTeacherId.trim();
  if (!section) {
    throw new Error("Бүлэг заавал оруулна.");
  }
  if (!sectionTeacherId) {
    throw new Error("Анги даасан багш сонгоно уу.");
  }

  const teacherRows = await ctx.db
    .select()
    .from(teacherTable)
    .where(eq(teacherTable.id, sectionTeacherId));
  const teacher = teacherRows[0];
  if (!teacher || teacher.schoolId !== schoolId) {
    throw new Error("Багш олдсонгүй эсвэл энэ сургуулийн багш биш.");
  }

  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await ctx.db.insert(classTable).values({
      id,
      schoolId,
      grade: args.input.grade,
      section,
      sectionTeacherId,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id,
      schoolId,
      grade: args.input.grade,
      section,
      sectionTeacherId,
      createdAt: now,
      updatedAt: now,
    };
  } catch (err) {
    console.error("Failed to create class:", err);
    throw new Error(`Failed to create class: ${err}`);
  }
};
