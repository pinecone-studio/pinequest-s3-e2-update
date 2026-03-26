import type { SavedExamRecord } from "./types";

export function normalizeSavedExamRecord(savedExam: SavedExamRecord): SavedExamRecord {
  return {
    ...savedExam,
    durationInMinutes:
      Number.isFinite(savedExam.durationInMinutes) && savedExam.durationInMinutes > 0
        ? savedExam.durationInMinutes
        : 40,
    sentClassIds: Array.isArray(savedExam.sentClassIds) ? savedExam.sentClassIds : [],
  };
}

export function formatSavedDate(dateString: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export const inputClassName =
  "h-12 w-full rounded-2xl border border-[#d3deef] bg-white px-4 text-sm text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10";
