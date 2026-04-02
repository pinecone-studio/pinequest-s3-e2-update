import { and, eq, isNull, or, sql } from "drizzle-orm";
import { teacherTable } from "../db/schema";
import type { GraphQLUserContext } from "../graphql/context";
import { clerkPrimaryEmail } from "./clerk-primary-email";

export async function ensureLinkedTeacher(ctx: GraphQLUserContext) {
  const clerkUserId = ctx.clerkUserId?.trim() ?? "";
  if (!clerkUserId) return null;

  const existing = await ctx.db
    .select()
    .from(teacherTable)
    .where(eq(teacherTable.clerkId, clerkUserId))
    .limit(1);
  if (existing[0]) return existing[0];

  const email = await clerkPrimaryEmail(clerkUserId, ctx.env);
  const normalized = (email ?? "").trim().toLowerCase();
  if (!normalized) return null;

  const candidates = await ctx.db
    .select()
    .from(teacherTable)
    .where(
      and(
        sql`lower(trim(${teacherTable.email})) = ${normalized}`,
        or(
          isNull(teacherTable.clerkId),
          eq(teacherTable.clerkId, ""),
          eq(teacherTable.clerkId, clerkUserId),
        ),
      ),
    )
    .limit(2);
  if (candidates.length === 0) return null;

  const pending = candidates.filter(
    (r) => r.clerkId == null || r.clerkId === "",
  );
  if (pending.length > 1) {
    throw new Error(
      "Ижил и-мэйлээр олон урьсан багш байна. Админаас засварлуулна уу.",
    );
  }
  const row = pending[0] ?? candidates[0]!;
  if (row.clerkId && row.clerkId === clerkUserId) return row;

  const now = new Date().toISOString();
  await ctx.db
    .update(teacherTable)
    .set({ clerkId: clerkUserId, updatedAt: now })
    .where(eq(teacherTable.id, row.id));

  return { ...row, clerkId: clerkUserId, updatedAt: now };
}
