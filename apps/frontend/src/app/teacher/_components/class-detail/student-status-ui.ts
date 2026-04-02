"use client";

export type StudentStatus = "active" | "transferred" | "graduated";

export const STUDENT_STATUS_STORAGE_KEY = "teacher-class-student-status-ui.v1";
export const STUDENT_STATUS_UPDATED_EVENT =
  "teacher-class-student-status-ui.updated";

export const STUDENT_STATUS_OPTIONS: Array<{
  value: StudentStatus;
  label: string;
  badgeClass: string;
  buttonClass: string;
}> = [
  {
    value: "active",
    label: "Идэвхтэй байгаа",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    buttonClass: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  {
    value: "transferred",
    label: "Шилжсэн",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
    buttonClass: "border-amber-300 bg-amber-50 text-amber-800",
  },
  {
    value: "graduated",
    label: "Төгссөн",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-800",
    buttonClass: "border-sky-300 bg-sky-50 text-sky-800",
  },
];

export function readStudentStatusMap() {
  if (typeof window === "undefined") return {} as Record<string, StudentStatus>;
  try {
    const raw = window.localStorage.getItem(STUDENT_STATUS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StudentStatus>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeStudentStatusMap(next: Record<string, StudentStatus>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STUDENT_STATUS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(STUDENT_STATUS_UPDATED_EVENT));
  } catch {
    // Ignore local persistence issues and keep the UI interactive.
  }
}
