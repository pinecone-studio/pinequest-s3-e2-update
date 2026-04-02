import { and, eq, isNull, or, sql } from "drizzle-orm";
import { teacherTable } from "../../../../db/schema";
import { GraphQLUserContext } from "../../../context";
import { clerkPrimaryEmail } from "../../../../lib/clerk-primary-email";

function rowToTeacher(r: typeof teacherTable.$inferSelect) {
  return {
    id: r.id,
    clerkId: r.clerkId,
    email: r.email,
    myClassId: r.myClassId,
    classIds: r.classIds,
    firstName: r.firstName,
    lastName: r.lastName,
    schoolId: r.schoolId,
    role: r.role,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export const linkTeacherClerk = async (
  _parent: unknown,
  _args: Record<string, never>,
  ctx: GraphQLUserContext,
) => {
  if (!ctx.clerkUserId) {
    throw new Error("Нэвтэрсэн хэрэглэгч шаардлагатай (Clerk Bearer token).");
  }

  console.log("clerk userId:", ctx.clerkUserId);

  const email = await clerkPrimaryEmail(ctx.clerkUserId, ctx.env);
  if (!email) {
    throw new Error("Clerk хэрэглэгчийн и-мэйл авахад алдаа гарлаа.");
  }

  const normalized = email.trim().toLowerCase();

  const candidates = await ctx.db
    .select()
    .from(teacherTable)
    .where(
      and(
        sql`lower(trim(${teacherTable.email})) = ${normalized}`,
        or(
          isNull(teacherTable.clerkId),
          eq(teacherTable.clerkId, ""),
          eq(teacherTable.clerkId, ctx.clerkUserId),
        ),
      ),
    );

  if (candidates.length === 0) {
    throw new Error(
      "Таны и-мэйлээр урьсан багшийн бүртгэл олдсонгүй эсвэл аль хэдийн холбогдсон.",
    );
  }

  const pending = candidates.filter(
    (r) => r.clerkId == null || r.clerkId === "",
  );
  if (pending.length > 1) {
    throw new Error(
      "Ижил и-мэйлээр олон урьсан багш байна. Админаас засварлуулна уу.",
    );
  }

  const row = pending[0] ?? candidates[0];
  if (row.clerkId && row.clerkId === ctx.clerkUserId) {
    return rowToTeacher(row);
  }

  const now = new Date().toISOString();
  await ctx.db
    .update(teacherTable)
    .set({ clerkId: ctx.clerkUserId, updatedAt: now })
    .where(eq(teacherTable.id, row.id));

  return rowToTeacher({ ...row, clerkId: ctx.clerkUserId, updatedAt: now });
};
