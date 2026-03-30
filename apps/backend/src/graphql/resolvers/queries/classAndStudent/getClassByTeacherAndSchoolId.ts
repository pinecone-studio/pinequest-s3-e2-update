import { and, eq } from "drizzle-orm";
import { classTable, teacherTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

type ClassByTeacherAndSchoolIdInput = {
  teacherId: string;
  schoolId: string;
};

export const getClassByTeacherAndSchoolId = async (
  _parent: unknown,
  args: { input: ClassByTeacherAndSchoolIdInput },
  ctx: GraphQLUserContext,
) => {
  if (!args.input.teacherId || !args.input.schoolId) {
    throw new Error("Teacher id and school id are required");
  }
  try {
    const teacher = await ctx.db
      .select()
      .from(teacherTable)
      .where(eq(teacherTable.id, args.input.teacherId));
    if (teacher[0]?.schoolId !== args.input.schoolId) {
      throw new Error("Teacher is not associated with the school");
    }
    const classes = await ctx.db
      .select()
      .from(classTable)
      .where(
        and(
          eq(classTable.sectionTeacherId, args.input.teacherId),
          eq(classTable.schoolId, args.input.schoolId),
        ),
      );
    return classes;
  } catch (err) {
    console.error("Cannot get class by teacher and school id. Error: ", err);
    throw new Error("Cannot get class by teacher and school id");
  }
};
