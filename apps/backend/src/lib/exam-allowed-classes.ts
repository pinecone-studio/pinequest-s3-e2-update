import { inArray } from "drizzle-orm";
import type { Db } from "../db/drizzle";
import { examAllowedClassTable } from "../db/schema";

export async function loadAllowedClassIdsByExamIds(
  db: Db,
  examIds: string[],
): Promise<Map<string, string[]>> {
  const out = new Map<string, string[]>();
  const ids = [...new Set(examIds.map((x) => x.trim()).filter(Boolean))];
  if (ids.length === 0) return out;

  const rows = await db
    .select()
    .from(examAllowedClassTable)
    .where(inArray(examAllowedClassTable.examId, ids));

  for (const r of rows) {
    const list = out.get(r.examId) ?? [];
    list.push(r.classId);
    out.set(r.examId, list);
  }
  return out;
}
