/** D1 `teacher.classIds`: JSON string array, жишээ нь ["id1","id2"]. */

export function serializeTeacherClassIds(
  ids: string[] | null | undefined,
): string | null {
  if (!ids?.length) return null;
  const cleaned = [
    ...new Set(ids.map((x) => x.trim()).filter(Boolean)),
  ];
  if (!cleaned.length) return null;
  return JSON.stringify(cleaned);
}

export function parseTeacherClassIdsJson(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      // ignore
    }
  }
  return [];
}
