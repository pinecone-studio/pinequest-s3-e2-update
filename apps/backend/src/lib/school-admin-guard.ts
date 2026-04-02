import { and, eq } from "drizzle-orm";
import { schoolTable, teacherTable } from "../db/schema";
import type { GraphQLUserContext } from "../graphql/context";

/**
 * Сургуулийн админ: `school.clerkId` нь одоогийн Clerk `sub`-той таарна.
 */
export async function assertSchoolAdminOwnsSchoolId(
  ctx: GraphQLUserContext,
  schoolId: string,
) {
  const sid = schoolId.trim();
  if (!sid) throw new Error("schoolId хоосон байна.");

  const clerkId = ctx.clerkUserId?.trim();
  if (!clerkId) throw new Error("Нэвтрэх шаардлагатай.");

  const rows = await ctx.db
    .select()
    .from(schoolTable)
    .where(eq(schoolTable.id, sid));
  const school = rows[0];
  if (!school) throw new Error("Сургууль олдсонгүй.");
  if (school.clerkId !== clerkId) {
    throw new Error("Энэ сургуулийн мэдээлэлд хандах эрхгүй.");
  }
  return school;
}

/**
 * Админ эсвэл тухайн сургуулийн багш.
 */
export async function assertClerkCanAccessSchool(
  ctx: GraphQLUserContext,
  schoolId: string,
) {
  const sid = schoolId.trim();
  if (!sid) throw new Error("schoolId хоосон байна.");

  const clerkId = ctx.clerkUserId?.trim();
  if (!clerkId) throw new Error("Нэвтрэх шаардлагатай.");

  const schoolRows = await ctx.db
    .select()
    .from(schoolTable)
    .where(eq(schoolTable.id, sid));
  const school = schoolRows[0];
  if (!school) throw new Error("Сургууль олдсонгүй.");

  if (school.clerkId === clerkId) return school;

  const teacherRows = await ctx.db
    .select()
    .from(teacherTable)
    .where(
      and(eq(teacherTable.schoolId, sid), eq(teacherTable.clerkId, clerkId)),
    );
  if (teacherRows[0]) return school;

  throw new Error("Энэ сургуулийн мэдээлэлд хандах эрхгүй.");
}
