import { eq } from "drizzle-orm";
import { teacherTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";

/**
 * Bearer session-ийн Clerk user id-тай таарсан багшийн D1 мөр.
 * `linkTeacherClerk` амжилттай болсны дараа энд гарна.
 */
export const viewerTeacher = async (
  _parent: unknown,
  _args: unknown,
  ctx: GraphQLUserContext,
) => {
  if (!ctx.clerkUserId) {
    return null;
  }
  try {
    const rows = await ctx.db
      .select()
      .from(teacherTable)
      .where(eq(teacherTable.clerkId, ctx.clerkUserId));
    return rows[0] ?? null;
  } catch (err) {
    console.error("viewerTeacher error:", err);
    throw new Error("Cannot load teacher profile");
  }
};
