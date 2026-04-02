import type { SavedExamRecord } from "./types";

export function normalizeSavedExamRecord(savedExam: SavedExamRecord): SavedExamRecord {
  return {
    ...savedExam,
    classGroup: savedExam.classGroup ?? "",
    durationInMinutes:
      Number.isFinite(savedExam.durationInMinutes) && savedExam.durationInMinutes > 0
        ? savedExam.durationInMinutes
        : 40,
    requiresSchoolApproval: Boolean(savedExam.requiresSchoolApproval),
    approvalStatus: savedExam.requiresSchoolApproval
      ? savedExam.approvalStatus ?? "pending"
      : "not_required",
    sentClassIds: Array.isArray(savedExam.sentClassIds) ? savedExam.sentClassIds : [],
    sentClassLabels:
      savedExam.sentClassLabels && typeof savedExam.sentClassLabels === "object"
        ? savedExam.sentClassLabels
        : {},
    approvalExamDate: savedExam.approvalExamDate ?? "",
    approvalStartTime: savedExam.approvalStartTime ?? "09:00",
    approvalEndTime: savedExam.approvalEndTime ?? "10:00",
    approvalLocation: savedExam.approvalLocation ?? "",
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
  "h-12 w-full rounded-xl border border-[#7f7f7f] bg-white px-4 text-[12px] text-[#183153] outline-none transition placeholder:text-[#A1A1A1] data-[placeholder]:text-[#A1A1A1] focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10";
