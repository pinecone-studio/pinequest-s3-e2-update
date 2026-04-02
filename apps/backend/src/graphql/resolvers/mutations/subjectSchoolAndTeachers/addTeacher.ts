import { teacherTable } from "../../../../db/schema";
import { serializeTeacherClassIds } from "../../../../lib/teacher-class-ids";
import { GraphQLUserContext } from "../../../context";

type AddTeacherInput = {
  clerkId?: string | null;
  email: string;
  myClassId?: string | null;
  classIds?: string[] | null;
  firstName: string;
  lastName: string;
  schoolId: string;
  role: string;
};

export const addTeacher = async (
  _parent: unknown,
  args: { input: AddTeacherInput },
  ctx: GraphQLUserContext,
) => {
  try {
    const clerkIdRaw = args.input.clerkId?.trim();
    const clerkId = clerkIdRaw && clerkIdRaw.length > 0 ? clerkIdRaw : null;
    const myClassIdRaw = args.input.myClassId?.trim();
    const myClassId =
      myClassIdRaw && myClassIdRaw.length > 0 ? myClassIdRaw : null;
    const classIdsJson = serializeTeacherClassIds(args.input.classIds ?? null);

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const email = args.input.email.trim();
    const firstName = args.input.firstName.trim();
    const lastName = args.input.lastName.trim();
    const schoolId = args.input.schoolId.trim();
    const role = args.input.role.trim();

    await ctx.db.insert(teacherTable).values({
      id,
      clerkId,
      email,
      myClassId,
      classIds: classIdsJson,
      firstName,
      lastName,
      schoolId,
      role,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id,
      clerkId,
      email,
      myClassId,
      classIds: classIdsJson,
      firstName,
      lastName,
      schoolId,
      role,
      createdAt: now,
      updatedAt: now,
    };
  } catch (err) {
    console.error("Failed to add teacher:", err);
    throw new Error(`Failed to add teacher: ${err}`);
  }
};
