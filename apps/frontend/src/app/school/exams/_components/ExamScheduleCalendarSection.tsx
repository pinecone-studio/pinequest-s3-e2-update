"use client";

import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  type ApprovalRequest,
  getApprovalRequestsClient,
  getApprovalUpdatedEventName,
  updateApprovalRequestStatus,
} from "@/app/lib/exam-approval-store";

type ExamScheduleItem = {
  id: string;
  examTitle: string;
  className: string;
  location: string;
  examDate: string;
  startTime: string;
  endTime: string;
  notes: string;
};

type ExamScheduleForm = {
  examTitle: string;
  teacherName: string;
  classGrade: string;
  classGroup: string;
  location: string;
  examDate: string;
  startTime: string;
  endTime: string;
  notes: string;
};
type ExamStatus = "draft" | "scheduled" | "ongoing" | "grading" | "completed";

type EnrichedExamScheduleItem = ExamScheduleItem & {
  status: ExamStatus;
  teacherName: string;
  progress: string | null;
};

const STORAGE_KEY = "pinequest.schoolExamSchedule.v1";
const WEEK_LABELS = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];
const today = new Date();

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

function monthLabel(year: number, monthIndex: number) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(new Date(year, monthIndex, 1));
}

function selectedDateLabel(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parseDateKey(dateKey));
}

function getMonthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const firstDayOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, monthIndex, 1 - firstDayOffset);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;
  return Array.from({ length: totalCells }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
}

function emptyForm(prefillDate: string): ExamScheduleForm {
  return {
    examTitle: "",
    teacherName: "",
    classGrade: "",
    classGroup: "",
    location: "",
    examDate: prefillDate,
    startTime: "09:00",
    endTime: "10:00",
    notes: "",
  };
}

function normalizeClassName(value: string) {
  return value.trim().toUpperCase();
}

function splitClassName(value: string) {
  const normalized = normalizeClassName(value).replace(/\s+/g, "");
  const matched = normalized.match(/^(\d+)[-_/ ]*([A-ZА-ЯӨҮЁ]+)$/u);
  if (matched) {
    return { classGrade: matched[1] ?? "", classGroup: matched[2] ?? "" };
  }
  return { classGrade: normalized, classGroup: "" };
}

function parseTeacher(notes: string) {
  const match = notes.match(/(?:teacher|багш)\s*:\s*([^\n,;]+)/i);
  return match ? match[1].trim() : "Тодорхойгүй";
}

function extractTeacher(notes: string) {
  const match = notes.match(/(?:teacher|багш)\s*:\s*([^\n,;]+)/i);
  return match ? match[1].trim() : "";
}

function stripTeacherLine(notes: string) {
  return notes
    .replace(/(?:teacher|багш)\s*:\s*[^\n,;]+[,\s;]*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function parseProgress(notes: string) {
  const match = notes.match(/\b(\d{1,3}\s*\/\s*\d{1,3})\b/);
  return match ? match[1].replace(/\s+/g, "") : null;
}

function formatRoom(value: string) {
  const room = value.trim();
  if (!room) return "Тодорхойгүй";
  if (room.toLowerCase().includes("тоот")) return room;
  return `${room} тоот`;
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function deriveExamStatus(item: ExamScheduleItem, now = new Date()): ExamStatus {
  const note = item.notes.toLowerCase();
  if (note.includes("ноорог") || note.includes("draft")) return "draft";
  if (note.includes("шалгаж") || note.includes("grading")) return "grading";

  const start = new Date(`${item.examDate}T${item.startTime}:00`);
  const end = new Date(`${item.examDate}T${item.endTime}:00`);

  if (now < start) return "scheduled";
  if (now >= start && now <= end) return "ongoing";
  return "completed";
}

const STATUS_META: Record<
  ExamStatus,
  { label: string; cellCardClass: string; chipClass: string; panelClass: string }
> = {
  draft: {
    label: "Ноорог",
    cellCardClass: "border-l-zinc-400 bg-zinc-50/95",
    chipClass: "bg-zinc-100 text-zinc-700",
    panelClass: "border-zinc-200 bg-zinc-50/70",
  },
  scheduled: {
    label: "Товлогдсон",
    cellCardClass: "border-l-blue-500 bg-blue-50/95",
    chipClass: "bg-[#dbe7ff] text-[#4d6aa8]",
    panelClass: "border-blue-200 bg-blue-50/70",
  },
  ongoing: {
    label: "Явагдаж буй",
    cellCardClass: "border-l-emerald-500 bg-emerald-50/95",
    chipClass: "bg-emerald-100 text-emerald-700",
    panelClass: "border-emerald-200 bg-emerald-50/70",
  },
  grading: {
    label: "Шалгаж буй",
    cellCardClass: "border-l-amber-500 bg-amber-50/95",
    chipClass: "bg-amber-100 text-amber-700",
    panelClass: "border-amber-200 bg-amber-50/70",
  },
  completed: {
    label: "Дууссан",
    cellCardClass: "border-l-slate-700 bg-slate-50/95",
    chipClass: "bg-slate-100 text-slate-700",
    panelClass: "border-slate-200 bg-slate-50/70",
  },
};

function readSchedules() {
  if (typeof window === "undefined") return [] as ExamScheduleItem[];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ExamScheduleItem[]) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === "object")
      .filter(
        (item) =>
          typeof item.id === "string" &&
          typeof item.examTitle === "string" &&
          typeof item.className === "string" &&
          typeof item.location === "string" &&
          typeof item.examDate === "string" &&
          typeof item.startTime === "string" &&
          typeof item.endTime === "string" &&
          typeof item.notes === "string",
      );
  } catch {
    return [];
  }
}

function writeSchedules(next: ExamScheduleItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

type ExamScheduleCalendarSectionProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  embedded?: boolean;
};

export function ExamScheduleCalendarSection({
  open,
  onOpenChange,
  embedded = false,
}: ExamScheduleCalendarSectionProps) {
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [schedules, setSchedules] = useState<ExamScheduleItem[]>(readSchedules);
  const [shownYear, setShownYear] = useState(today.getFullYear());
  const [shownMonth, setShownMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [internalOpen, setInternalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [detailScheduleId, setDetailScheduleId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState<ExamScheduleForm>(emptyForm(selectedDate));
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);

  const isCalendarOpen = embedded ? true : open ?? internalOpen;

  const monthGrid = useMemo(() => getMonthGrid(shownYear, shownMonth), [shownYear, shownMonth]);

  useEffect(() => {
    const sync = () => setApprovalRequests(getApprovalRequestsClient());
    sync();
    const eventName = getApprovalUpdatedEventName();
    window.addEventListener(eventName, sync);
    return () => window.removeEventListener(eventName, sync);
  }, []);

  const scheduleMap = useMemo(() => {
    const map = new Map<string, ExamScheduleItem[]>();

    for (const item of schedules) {
      const existing = map.get(item.examDate) ?? [];
      existing.push(item);
      map.set(item.examDate, existing);
    }

    for (const [key, value] of map.entries()) {
      map.set(key, [...value].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    }

    return map;
  }, [schedules]);

  const selectedDaySchedules = useMemo(() => scheduleMap.get(selectedDate) ?? [], [scheduleMap, selectedDate]);
  const selectedDayApprovalRequests = useMemo(
    () =>
      approvalRequests.filter(
        (item) =>
          item.status === "pending" &&
          item.requestedExamDate === selectedDate &&
          Boolean(item.requestedStartTime) &&
          Boolean(item.requestedEndTime),
      ),
    [approvalRequests, selectedDate],
  );

  const approvalRequestMap = useMemo(() => {
    const map = new Map<string, ApprovalRequest[]>();
    for (const item of approvalRequests) {
      if (item.status !== "pending" || !item.requestedExamDate) continue;
      const existing = map.get(item.requestedExamDate) ?? [];
      existing.push(item);
      map.set(item.requestedExamDate, existing);
    }
    return map;
  }, [approvalRequests]);

  const selectedDayExamItems = useMemo<EnrichedExamScheduleItem[]>(
    () =>
      selectedDaySchedules.map((item) => ({
        ...item,
        status: deriveExamStatus(item),
        teacherName: parseTeacher(item.notes),
        progress: parseProgress(item.notes),
      })),
    [selectedDaySchedules],
  );

  const todayExamItems = useMemo<EnrichedExamScheduleItem[]>(
    () =>
      (scheduleMap.get(toDateKey(today)) ?? []).map((item) => ({
        ...item,
        status: deriveExamStatus(item),
        teacherName: parseTeacher(item.notes),
        progress: parseProgress(item.notes),
      })),
    [scheduleMap],
  );

  const overlappingExams = useMemo(() => {
    const sorted = [...selectedDayExamItems].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
    );
    const overlaps: Array<{ first: EnrichedExamScheduleItem; second: EnrichedExamScheduleItem }> = [];

    for (let i = 1; i < sorted.length; i += 1) {
      const prev = sorted[i - 1];
      const current = sorted[i];
      if (timeToMinutes(current.startTime) < timeToMinutes(prev.endTime)) {
        overlaps.push({ first: prev, second: current });
      }
    }

    return overlaps;
  }, [selectedDayExamItems]);

  const unpublishedExams = useMemo(
    () => selectedDayExamItems.filter((item) => item.status === "draft" || item.location.trim().length === 0),
    [selectedDayExamItems],
  );

  const pendingGradingExams = useMemo(
    () => selectedDayExamItems.filter((item) => item.status === "grading"),
    [selectedDayExamItems],
  );

  const weekGrid = useMemo(() => {
    const selected = parseDateKey(selectedDate);
    const mondayOffset = (selected.getDay() + 6) % 7;
    const start = new Date(selected);
    start.setDate(selected.getDate() - mondayOffset);

    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [selectedDate]);

  const dayCells = viewMode === "month" ? monthGrid : weekGrid;
  const todayKey = toDateKey(today);
  const isSelectedDatePast = parseDateKey(selectedDate).getTime() < parseDateKey(todayKey).getTime();
  const detailSchedule = useMemo(
    () => schedules.find((item) => item.id === detailScheduleId) ?? null,
    [detailScheduleId, schedules],
  );
  const detailExamItem = useMemo(
    () =>
      detailSchedule
        ? {
            ...detailSchedule,
            status: deriveExamStatus(detailSchedule),
            teacherName: parseTeacher(detailSchedule.notes),
            progress: parseProgress(detailSchedule.notes),
          }
        : null,
    [detailSchedule],
  );

  function closeCalendar() {
    if (onOpenChange) onOpenChange(false);
    else setInternalOpen(false);
    setEditingScheduleId(null);
    setIsCreateOpen(false);
    setFormError(null);
  }

  function isCompleted(item: EnrichedExamScheduleItem) {
    return item.status === "completed";
  }

  function shiftMonth(direction: -1 | 1) {
    const next = new Date(shownYear, shownMonth + direction, 1);
    setShownYear(next.getFullYear());
    setShownMonth(next.getMonth());
  }

  function openCreateForDate(dateKey: string) {
    setSelectedDate(dateKey);
    setFormError(null);
    setEditingScheduleId(null);
    setForm(emptyForm(dateKey));
    setIsCreateOpen(true);
  }

  function openEditSchedule(item: ExamScheduleItem) {
    const { classGrade, classGroup } = splitClassName(item.className);
    setEditingScheduleId(item.id);
    setDetailScheduleId(null);
    setSelectedDate(item.examDate);
    setFormError(null);
    setForm({
      examTitle: item.examTitle,
      teacherName: extractTeacher(item.notes),
      classGrade,
      classGroup,
      location: item.location,
      examDate: item.examDate,
      startTime: item.startTime,
      endTime: item.endTime,
      notes: item.notes,
    });
    setIsCreateOpen(true);
  }

  function openDetailSchedule(item: ExamScheduleItem) {
    setSelectedDate(item.examDate);
    setDetailScheduleId(item.id);
  }

  function createSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.examTitle.trim()) return setFormError("Шалгалтын нэр оруулна уу.");
    if (!form.classGrade.trim()) return setFormError("Анги оруулна уу.");
    if (!form.classGroup.trim()) return setFormError("Бүлэг оруулна уу.");
    if (!form.examDate) return setFormError("Огноо сонгоно уу.");
    if (!form.startTime || !form.endTime) return setFormError("Цагийн мэдээлэл дутуу байна.");
    if (form.endTime <= form.startTime) {
      return setFormError("Дуусах цаг нь эхлэх цагаас хойш байх ёстой.");
    }

    const normalizedSchedule = {
      examTitle: form.examTitle.trim(),
      className: normalizeClassName(`${form.classGrade}${form.classGroup}`),
      location: form.location.trim(),
      examDate: form.examDate,
      startTime: form.startTime,
      endTime: form.endTime,
      notes: [
        form.teacherName.trim() ? `Багш: ${form.teacherName.trim()}` : "",
        stripTeacherLine(form.notes),
      ]
        .filter(Boolean)
        .join(" · "),
    };

    const next: ExamScheduleItem[] = editingScheduleId
      ? schedules.map((item) => (item.id === editingScheduleId ? { ...item, ...normalizedSchedule } : item))
      : [...schedules, { id: crypto.randomUUID(), ...normalizedSchedule }];

    writeSchedules(next);
    setSchedules(next);
    setSelectedDate(form.examDate);
    setEditingScheduleId(null);
    setIsCreateOpen(false);
    setFormError(null);
  }

  function deleteSchedule(id: string) {
    const next = schedules.filter((item) => item.id !== id);
    writeSchedules(next);
    setSchedules(next);
    if (detailScheduleId === id) setDetailScheduleId(null);
  }

  function approveRequestToSchedule(request: ApprovalRequest) {
    if (!request.requestedExamDate || !request.requestedStartTime || !request.requestedEndTime) return;

    const requestScheduleId = `approval-${request.id}`;
    const alreadyExists = schedules.some((item) => item.id === requestScheduleId);
    if (!alreadyExists) {
      const nextSchedule: ExamScheduleItem = {
        id: requestScheduleId,
        examTitle: request.title,
        className: request.className,
        location: request.requestedLocation ?? "",
        examDate: request.requestedExamDate,
        startTime: request.requestedStartTime,
        endTime: request.requestedEndTime,
        notes: `Багш: ${request.teacherName}`,
      };

      const next = [...schedules, nextSchedule];
      writeSchedules(next);
      setSchedules(next);
    }

    updateApprovalRequestStatus(request.id, "approved");
    setSelectedDate(request.requestedExamDate);
  }

  if (!isCalendarOpen) return null;

  const calendarContent = (
    <div
      className={`w-full rounded-2xl border border-[#e2e8f0] bg-[#fcfdff] p-6 ${
        embedded ? "shadow-sm" : "max-w-7xl shadow-2xl"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[22px] font-semibold text-[#0f172a]">Шалгалтын календарь</h3>
          <p className="mt-1 text-sm text-[#64748b]">Өдөр дээр дарж тухайн өдөр шалгалтын хуваарь үүсгэнэ</p>
        </div>
        {!embedded ? (
          <button
            type="button"
            onClick={closeCalendar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#475569] transition hover:bg-[#f8fafc]"
            aria-label="Хаах"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#334155] transition hover:bg-[#f8fafc]"
                aria-label="Өмнөх сар"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#334155] transition hover:bg-[#f8fafc]"
                aria-label="Дараагийн сар"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <p className="text-lg font-semibold text-[#0f172a]">{monthLabel(shownYear, shownMonth)}</p>

            <div className="inline-flex items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-1">
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  viewMode === "month" ? "bg-white text-[#0f172a] shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                Сар
              </button>
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  viewMode === "week" ? "bg-white text-[#0f172a] shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                7 хоног
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-3">
            {WEEK_LABELS.map((label) => (
              <div
                key={label}
                className="rounded-xl bg-[#f1f5f9] px-2 py-2 text-center text-xs font-semibold text-[#64748b]"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-3">
            {dayCells.map((day) => {
              const dateKey = toDateKey(day);
              const enrichedItems = (scheduleMap.get(dateKey) ?? []).map((item) => ({
                ...item,
                status: deriveExamStatus(item),
                teacherName: parseTeacher(item.notes),
                progress: parseProgress(item.notes),
              }));
              const dayApprovalRequests = approvalRequestMap.get(dateKey) ?? [];

              const isCurrentMonth = day.getMonth() === shownMonth;
              const isSelected = dateKey === selectedDate;
              const isToday = dateKey === toDateKey(today);
              const isPastDay = parseDateKey(dateKey).getTime() < parseDateKey(todayKey).getTime();

              if (viewMode === "month" && !isCurrentMonth) {
                return (
                  <div key={dateKey} className="min-h-[118px] rounded-xl border border-[#e2e8f0] bg-[#f8fafc]" />
                );
              }

              return (
                <div
                  role="button"
                  tabIndex={0}
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedDate(dateKey);
                    }
                  }}
                  className={`group relative min-h-[118px] rounded-xl border p-2.5 text-left transition ${
                    isSelected
                      ? "border-[#3b82f6] bg-[#eff6ff]"
                      : "border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${isToday ? "text-[#2563eb]" : "text-[#0f172a]"}`}>
                      {day.getDate()}
                    </p>

                    {!isPastDay ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCreateForDate(dateKey);
                        }}
                        className="opacity-0 rounded-md border border-[#dbe5f0] bg-white px-2 py-0.5 text-[11px] font-medium text-[#2563eb] transition group-hover:opacity-100"
                      >
                        + Шалгалт нэмэх
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {dayApprovalRequests.slice(0, 1).map((request) => (
                      <div
                        key={`request-${request.id}`}
                        className="rounded-lg border border-amber-200 bg-amber-50/80 px-1.5 py-1"
                      >
                        <p className="truncate text-[10px] font-semibold text-amber-800">Хүсэлт</p>
                        <p className="truncate text-[10px] text-amber-700">
                          {request.className} · {request.requestedStartTime}-{request.requestedEndTime}
                        </p>
                      </div>
                    ))}

                    {enrichedItems.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-lg border-l-2 p-1.5 transition group-hover:shadow-sm ${STATUS_META[item.status].cellCardClass}`}
                      >
                        <p className="truncate text-[11px] font-semibold text-[#0f172a]">{item.examTitle}</p>
                        <p className="truncate text-[10px] text-[#475569]">
                          {item.className} анги · {item.startTime}-{item.endTime}
                        </p>
                        <p className="inline-flex items-center gap-1 truncate text-[10px] text-[#64748b]">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {formatRoom(item.location)}
                        </p>
                        {item.progress ? <p className="text-[10px] font-medium text-[#334155]">{item.progress}</p> : null}
                      </div>
                    ))}

                    {dayApprovalRequests.length + enrichedItems.length > 3 ? (
                      <p className="text-[10px] font-semibold text-[#64748b]">
                        +{dayApprovalRequests.length + enrichedItems.length - 3} нэмэлт
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <h4 className="text-2xl font-semibold text-[#0f172a]">{selectedDateLabel(selectedDate)}</h4>

          <div className="mt-6 space-y-6">
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Өнөөдрийн шалгалтууд</p>
              <div className="mt-2 space-y-2">
                {todayExamItems.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-3 py-2 text-sm text-[#64748b]">
                    Өнөөдөр шалгалт алга.
                  </p>
                ) : (
                  todayExamItems.map((item) => (
                    <div key={`today-${item.id}`} className={`rounded-xl border px-3 py-2 ${STATUS_META[item.status].panelClass}`}>
                      <p className="text-sm font-semibold text-[#0f172a]">{item.examTitle}</p>
                      <p className="text-xs text-[#475569]">
                        {item.className} · {item.startTime}-{item.endTime}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Асуудлууд</p>
              <div className="mt-2 space-y-2">
                {overlappingExams.length === 0 && unpublishedExams.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-3 py-2 text-sm text-[#64748b]">
                    Давхцал болон хэвлэгдээгүй шалгалт алга.
                  </p>
                ) : (
                  <>
                    {overlappingExams.map((item, index) => (
                      <p
                        key={`overlap-${index}`}
                        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
                      >
                        Давхцал: {item.first.examTitle} / {item.second.examTitle}
                      </p>
                    ))}
                    {unpublishedExams.map((item) => (
                      <p
                        key={`unpub-${item.id}`}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
                      >
                        Нийтлэгдээгүй: {item.examTitle}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Хүлээгдэж буй</p>
              <div className="mt-2 space-y-2">
                {pendingGradingExams.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-3 py-2 text-sm text-[#64748b]">
                    Шалгах хүлээгдэж буй шалгалт алга.
                  </p>
                ) : (
                  pendingGradingExams.map((item) => (
                    <div key={`pending-${item.id}`} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                      <p className="text-sm font-semibold text-[#0f172a]">{item.examTitle}</p>
                      <p className="text-xs text-[#475569]">
                        {item.className} · {item.teacherName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Батлуулах хүсэлтүүд</p>
              <div className="mt-2 space-y-2">
                {selectedDayApprovalRequests.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-3 py-2 text-sm text-[#64748b]">
                    Энэ өдөр батлуулах хүсэлт алга.
                  </p>
                ) : (
                  selectedDayApprovalRequests.map((request) => (
                    <div
                      key={`approval-${request.id}`}
                      className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5"
                    >
                      <p className="text-sm font-semibold text-[#0f172a]">{request.title}</p>
                      <p className="mt-0.5 text-xs text-[#475569]">
                        {request.className} · {request.requestedStartTime}-{request.requestedEndTime}
                      </p>
                      <p className="mt-0.5 text-xs text-[#64748b]">
                        Багш: {request.teacherName}
                        {request.requestedLocation ? ` · Өрөө: ${request.requestedLocation}` : ""}
                      </p>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => approveRequestToSchedule(request)}
                          className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Батлах
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              {selectedDayExamItems.length === 0 ? (
                <div className="space-y-3 rounded-2xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-3">
                  <p className="text-sm text-[#64748b]">
                    {isSelectedDatePast
                      ? "Өнгөрсөн өдөрт шинэ шалгалт нэмэх боломжгүй."
                      : "Энэ өдөр шалгалт байхгүй байна"}
                  </p>
                  {!isSelectedDatePast ? (
                    <button
                      type="button"
                      onClick={() => openCreateForDate(selectedDate)}
                      className="w-full rounded-xl bg-[#4d73c9] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#4266b6]"
                    >
                      Шалгалт нэмэх
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDayExamItems.map((item) => (
                    <div key={item.id} className={`rounded-xl border px-3 py-2.5 ${STATUS_META[item.status].panelClass}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">{item.examTitle}</p>
                          <p className="mt-0.5 text-xs text-[#475569]">
                            {item.className} · {item.startTime} - {item.endTime}
                          </p>
                          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#64748b]">
                            <MapPin className="h-3.5 w-3.5" />
                            {item.location || "Өрөө оноогоогүй"}
                          </p>
                          <p className="mt-0.5 text-xs text-[#64748b]">{item.teacherName}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[item.status].chipClass}`}>
                          {STATUS_META[item.status].label}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-end gap-2">
                        {isCompleted(item) ? (
                          <button
                            type="button"
                            onClick={() => openDetailSchedule(item)}
                            className="rounded-md border border-[#dbe5f0] bg-white px-2 py-1 text-[11px] font-medium text-[#334155] transition hover:bg-[#f8fafc]"
                          >
                            Дэлгэрэнгүй
                          </button>
                        ) : null}
                        {!isCompleted(item) ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditSchedule(item)}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50"
                              aria-label="Засах"
                              title="Засах"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSchedule(item.id)}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              aria-label="Устгах"
                              title="Устгах"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {!isSelectedDatePast ? (
                    <button
                      type="button"
                      onClick={() => openCreateForDate(selectedDate)}
                      className="mt-2 w-full rounded-xl bg-[#4d73c9] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#4266b6]"
                    >
                      Шалгалт нэмэх
                    </button>
                  ) : null}
                </div>
              )}
            </section>
          </div>
        </aside>
      </div>
    </div>
  );

  return (
    <>
      {embedded ? (
        calendarContent
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">{calendarContent}</div>
      )}

      {isCreateOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="w-full max-w-[700px] rounded-2xl border border-[#e2e8f0] bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-[22px] font-semibold leading-7 text-[#0f172a]">
                  {editingScheduleId ? "Хуваарь засах" : "Хуваарь нэмэх"}
                </h4>
                <p className="mt-1 text-sm text-[#64748b]">{selectedDateLabel(form.examDate)} өдрийн шалгалтын мэдээлэл</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setFormError(null);
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#475569] transition hover:bg-[#f8fafc]"
                aria-label="Хаах"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={createSchedule} className="mt-8 space-y-8">
              <section className="space-y-4">
                <p className="text-[13px] font-semibold text-[#475569]">Ерөнхий мэдээлэл</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-[13px] font-medium text-[#475569]">
                    <span className="mb-2 block">Шалгалтын нэр</span>
                    <input
                      value={form.examTitle}
                      onChange={(e) => setForm((current) => ({ ...current, examTitle: e.target.value }))}
                      required
                      placeholder="Жишээ: Математик улирлын шалгалт"
                      className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10"
                    />
                  </label>
                  <label className="block text-[13px] font-medium text-[#475569]">
                    <span className="mb-2 block">Багшийн нэр</span>
                    <input
                      value={form.teacherName}
                      onChange={(e) => setForm((current) => ({ ...current, teacherName: e.target.value }))}
                      placeholder="Жишээ: Н.Содном"
                      className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10"
                    />
                  </label>
                  <label className="block text-[13px] font-medium text-[#475569]">
                    <span className="mb-2 block">Анги</span>
                    <input
                      value={form.classGrade}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          classGrade: e.target.value.replace(/[^\d]/g, ""),
                        }))
                      }
                      required
                      placeholder="Жишээ: 10"
                      className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10"
                    />
                  </label>
                  <label className="block text-[13px] font-medium text-[#475569]">
                    <span className="mb-2 block">Бүлэг</span>
                    <input
                      value={form.classGroup}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          classGroup: normalizeClassName(e.target.value),
                        }))
                      }
                      required
                      placeholder="Жишээ: А"
                      className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10"
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-[13px] font-semibold text-[#475569]">Байршил</p>
                <input
                  value={form.location}
                  onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
                  placeholder="Жишээ: 203 тоот"
                  aria-label="Байршил / Өрөө"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10"
                />
              </section>

              <section className="space-y-4">
                <p className="text-[13px] font-semibold text-[#475569]">Цаг</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-[13px] font-medium text-[#475569]">
                    <span className="mb-2 block">Эхлэх</span>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) => setForm((current) => ({ ...current, startTime: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10"
                    />
                  </label>
                  <label className="block text-[13px] font-medium text-[#475569]">
                    <span className="mb-2 block">Дуусах</span>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) => setForm((current) => ({ ...current, endTime: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10"
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-[13px] font-semibold text-[#475569]">Тэмдэглэл</p>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
                  rows={4}
                  placeholder="Танхим, заавар, нэмэлт мэдээлэл..."
                  aria-label="Тэмдэглэл"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10"
                />
              </section>

              {formError ? <p className="text-sm font-medium text-red-600">{formError}</p> : null}

              <div className="flex justify-end gap-3 border-t border-[#e2e8f0] pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingScheduleId(null);
                    setIsCreateOpen(false);
                    setFormError(null);
                  }}
                  className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#f8fafc]"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                  {editingScheduleId ? "Өөрчлөлт хадгалах" : "Хадгалах"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {detailExamItem ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="w-full max-w-[560px] rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-xl font-semibold text-[#0f172a]">Шалгалтын дэлгэрэнгүй</h4>
                <p className="mt-1 text-sm text-[#64748b]">{selectedDateLabel(detailExamItem.examDate)}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailScheduleId(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#475569] transition hover:bg-[#f8fafc]"
                aria-label="Хаах"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-semibold text-[#0f172a]">{detailExamItem.examTitle}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[13px] font-semibold ${STATUS_META[detailExamItem.status].chipClass}`}
                >
                  {STATUS_META[detailExamItem.status].label}
                </span>
              </div>
              <p className="text-sm text-[#475569]">Анги: {detailExamItem.className}</p>
              <p className="inline-flex items-center gap-2 text-sm text-[#475569]">
                <Clock3 className="h-4 w-4" />
                {detailExamItem.startTime} - {detailExamItem.endTime}
              </p>
              <p className="inline-flex items-center gap-2 text-sm text-[#475569]">
                <MapPin className="h-4 w-4" />
                {detailExamItem.location || "Өрөө оноогоогүй"}
              </p>
              <p className="text-sm text-[#475569]">Багш: {detailExamItem.teacherName}</p>
              {detailExamItem.progress ? (
                <p className="text-sm text-[#475569]">Явц: {detailExamItem.progress}</p>
              ) : null}
              {detailExamItem.notes ? (
                <p className="text-sm text-[#64748b]">Тэмдэглэл: {detailExamItem.notes}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
