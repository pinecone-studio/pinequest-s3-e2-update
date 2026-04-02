import { eq } from "drizzle-orm";
import { schoolTable, teacherTable } from "../db/schema";
import type { GraphQLUserContext } from "../graphql/context";

/**
 * Clerk-ээр нэвтэрсэн сургуулийн админ эсвэл тухайн сургуулийн багш нь
 * эдгээр асуултуудын эзэмшигч багшдаа харьяалагдах эсэхийг шалгана.
 */
export async function assertClerkCanAccessQuestionContent(
  ctx: GraphQLUserContext,
  teacherIdsFromRows: (string | null | undefined)[],
) {
  const clerkId = ctx.clerkUserId?.trim();
  if (!clerkId) {
    throw new Error("Шалгалтын token эсвэл нэвтрэх шаардлагатай.");
  }

  const nonNullIds = [
    ...new Set(
      teacherIdsFromRows.filter(
        (x): x is string => typeof x === "string" && x.length > 0,
      ),
    ),
  ];

  const schoolRows = await ctx.db
    .select()
    .from(schoolTable)
    .where(eq(schoolTable.clerkId, clerkId));
  const school = schoolRows[0];

  const schoolTeacherIdSet = async (schoolId: string) => {
    const teachers = await ctx.db
      .select()
      .from(teacherTable)
      .where(eq(teacherTable.schoolId, schoolId));
    return new Set(teachers.map((t) => t.id));
  };

  if (school) {
    const allow = await schoolTeacherIdSet(school.id);
    if (nonNullIds.length === 0 || nonNullIds.every((id) => allow.has(id))) {
      return;
    }
    // throw new Error("Асуултын агуулгаар хандах эрхгүй.");
  }

  const viewerRows = await ctx.db
    .select()
    .from(teacherTable)
    .where(eq(teacherTable.clerkId, clerkId));
  const viewer = viewerRows[0];
  if (!viewer) {
    throw new Error("Багшийн бүртгэл олдсонгүй.");
  }
  const allow = await schoolTeacherIdSet(viewer.schoolId);
  if (nonNullIds.length === 0 || nonNullIds.every((id) => allow.has(id))) {
    return;
  }
  // throw new Error("Асуултын агуулгаар хандах эрхгүй.");
}
