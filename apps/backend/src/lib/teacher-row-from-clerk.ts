import { eq } from "drizzle-orm";
import { teacherTable } from "../db/schema";
import type { GraphQLUserContext } from "../graphql/context";

/**
 * Clerk session (`sub`) → `teacher` хүснэгтийн `id`. Тест/дурын хариултын эзнийг D1-д бичихэд заавал.
 */
export async function requireDbTeacherIdFromClerk(
  ctx: GraphQLUserContext,
): Promise<string> {
  const clerkId = ctx.clerkUserId?.trim();
  if (!clerkId) {
    throw new Error("Нэвтрэх шаардлагатай.");
  }

  const rows = await ctx.db
    .select({ id: teacherTable.id })
    .from(teacherTable)
    .where(eq(teacherTable.clerkId, clerkId));

  const row = rows[0];
  if (!row?.id) {
    throw new Error(
      "Багшийн мөр олдсонгүй. Сургуулийн админ и-мэйлээр урьсан эсэхээ шалгаад, профайлаа холбоно уу.",
    );
  }

  return row.id;
}
