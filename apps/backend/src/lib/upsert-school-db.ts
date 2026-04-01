import { eq } from "drizzle-orm";
import type { Db } from "../db/drizzle";
import { schoolTable } from "../db/schema";
import {
  buildSchoolSignupRow,
  type SchoolSignupInput,
} from "./school-signup-metadata";

export async function upsertSchoolFromSignupInput(
  db: Db,
  clerkUserId: string,
  input: SchoolSignupInput,
): Promise<void> {
  const row = buildSchoolSignupRow(clerkUserId, input);
  const now = new Date().toISOString();

  const existing = await db
    .select()
    .from(schoolTable)
    .where(eq(schoolTable.clerkId, clerkUserId))
    .limit(1);

  if (existing[0]) {
    await db
      .update(schoolTable)
      .set({
        email: row.email,
        name: row.name,
        register: row.register,
        provinceOrCity: row.provinceOrCity,
        soumOrDistrict: row.soumOrDistrict,
        address: row.address,
        updatedAt: now,
      })
      .where(eq(schoolTable.id, existing[0].id));
    return;
  }

  await db.insert(schoolTable).values({
    id: crypto.randomUUID(),
    clerkId: clerkUserId,
    email: row.email,
    name: row.name,
    register: row.register,
    provinceOrCity: row.provinceOrCity,
    soumOrDistrict: row.soumOrDistrict,
    address: row.address,
    createdAt: now,
    updatedAt: now,
  });
}
