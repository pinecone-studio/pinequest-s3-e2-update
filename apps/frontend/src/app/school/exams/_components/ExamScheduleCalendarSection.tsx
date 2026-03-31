"use client";

import { ChevronLeft, ChevronRight, MapPin, Pencil, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

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

type ExamScheduleForm = Omit<ExamScheduleItem, "id">;

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
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "long",
  }).format(new Date(year, monthIndex, 1));
}

function getMonthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const firstDayOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, monthIndex, 1 - firstDayOffset);
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
}

function emptyForm(prefillDate: string): ExamScheduleForm {
  return {
    examTitle: "",
    className: "",
    location: "",
    examDate: prefillDate,
    startTime: "09:00",
    endTime: "10:00",
    notes: "",
  };
}

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
          typeof item.notes === "string"
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
};

export function ExamScheduleCalendarSection({
  open,
  onOpenChange,
}: ExamScheduleCalendarSectionProps) {
  const [schedules, setSchedules] = useState<ExamScheduleItem[]>(readSchedules);
  const [shownYear, setShownYear] = useState(today.getFullYear());
  const [shownMonth, setShownMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [internalOpen, setInternalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState<ExamScheduleForm>(emptyForm(selectedDate));

  const isCalendarOpen = open ?? internalOpen;

  const monthGrid = useMemo(
    () => getMonthGrid(shownYear, shownMonth),
    [shownYear, shownMonth]
  );

  const scheduleMap = useMemo(() => {
    const map = new Map<string, ExamScheduleItem[]>();
    for (const item of schedules) {
      const existing = map.get(item.examDate) ?? [];
      existing.push(item);
      map.set(item.examDate, existing);
    }
    for (const [key, value] of map.entries()) {
      map.set(
        key,
        [...value].sort((a, b) => a.startTime.localeCompare(b.startTime))
      );
    }
    return map;
  }, [schedules]);

  const selectedDaySchedules = useMemo(
    () => scheduleMap.get(selectedDate) ?? [],
    [scheduleMap, selectedDate]
  );

  function closeCalendar() {
    if (onOpenChange) onOpenChange(false);
    else setInternalOpen(false);
    setEditingScheduleId(null);
    setIsCreateOpen(false);
    setFormError(null);
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
    setEditingScheduleId(item.id);
    setSelectedDate(item.examDate);
    setFormError(null);
    setForm({
      examTitle: item.examTitle,
      className: item.className,
      location: item.location,
      examDate: item.examDate,
      startTime: item.startTime,
      endTime: item.endTime,
      notes: item.notes,
    });
    setIsCreateOpen(true);
  }

  function createSchedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.examTitle.trim()) return setFormError("Шалгалтын нэр оруулна уу.");
    if (!form.className.trim()) return setFormError("Анги оруулна уу.");
    if (!form.examDate) return setFormError("Огноо сонгоно уу.");
    if (!form.startTime || !form.endTime) return setFormError("Цагийн мэдээлэл дутуу байна.");
    if (form.endTime <= form.startTime) {
      return setFormError("Дуусах цаг нь эхлэх цагаас хойш байх ёстой.");
    }

    const normalizedSchedule = {
      examTitle: form.examTitle.trim(),
      className: form.className.trim(),
      location: form.location.trim(),
      examDate: form.examDate,
      startTime: form.startTime,
      endTime: form.endTime,
      notes: form.notes.trim(),
    };

    const next: ExamScheduleItem[] = editingScheduleId
      ? schedules.map((item) =>
          item.id === editingScheduleId
            ? { ...item, ...normalizedSchedule }
            : item
        )
      : [
          ...schedules,
          {
            id: crypto.randomUUID(),
            ...normalizedSchedule,
          },
        ];

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
  }

  if (!isCalendarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a]">Шалгалтын календарь</h3>
            <p className="mt-1 text-sm text-[#475569]">
              Өдөр дээр дарж тухайн өдөрт шалгалтын хуваарь үүсгэнэ.
            </p>
          </div>
          <button
            type="button"
            onClick={closeCalendar}
            className="rounded-md border border-[#dbe5f0] p-1.5 text-[#334155] transition hover:bg-[#f1f5f9]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="flex items-center justify-between rounded-xl border border-[#dbe5f0] bg-[#f8fafc] px-3 py-2.5">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="rounded-md border border-[#dbe5f0] bg-white p-1.5 text-[#334155] transition hover:bg-[#f1f5f9]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-semibold capitalize text-[#0f172a]">
                {monthLabel(shownYear, shownMonth)}
              </p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="rounded-md border border-[#dbe5f0] bg-white p-1.5 text-[#334155] transition hover:bg-[#f1f5f9]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {WEEK_LABELS.map((label) => (
                <div
                  key={label}
                  className="rounded-md bg-[#f1f5f9] px-1 py-1.5 text-center text-xs font-semibold text-[#64748b]"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-1.5 grid grid-cols-7 gap-1.5">
              {monthGrid.map((day) => {
                const dateKey = toDateKey(day);
                const items = scheduleMap.get(dateKey) ?? [];
                const isCurrentMonth = day.getMonth() === shownMonth;
                const isSelected = dateKey === selectedDate;
                const isToday = dateKey === toDateKey(today);

                return (
                  <button
                    type="button"
                    key={dateKey}
                    onClick={() => openCreateForDate(dateKey)}
                    className={`min-h-[88px] rounded-lg border px-1.5 py-1.5 text-left transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-[#dbe5f0] bg-white hover:bg-[#f8fafc]"
                    } ${!isCurrentMonth ? "opacity-50" : ""}`}
                  >
                    <p className={`text-xs font-bold ${isToday ? "text-blue-700" : "text-[#0f172a]"}`}>
                      {day.getDate()}
                    </p>
                    <div className="mt-1 space-y-1">
                      {items.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="rounded bg-[#dbeafe] px-1 py-0.5 text-[10px] text-blue-800"
                        >
                          <p className="truncate font-medium">
                            {item.startTime} · {item.examTitle}
                          </p>
                          {item.location ? (
                            <p className="truncate text-[9px] font-semibold text-blue-700/90">
                              {item.location}
                            </p>
                          ) : null}
                        </div>
                      ))}
                      {items.length > 2 ? (
                        <p className="text-[10px] font-semibold text-[#64748b]">
                          +{items.length - 2} нэмэлт
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[#dbe5f0] bg-[#f8fafc] p-3">
            <p className="text-sm font-semibold text-[#0f172a]">
              {new Intl.DateTimeFormat("mn-MN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(parseDateKey(selectedDate))}
            </p>
            <p className="mt-1 text-xs text-[#64748b]">
              Өдөр дээр дарвал шинэ хуваарь хадгалах popup нээгдэнэ.
            </p>
            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-1">
              {selectedDaySchedules.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[#cbd5e1] bg-white px-3 py-2 text-sm text-[#64748b]">
                  Энэ өдөрт шалгалтын хуваарь алга байна.
                </p>
              ) : (
                selectedDaySchedules.map((item) => (
                  <div key={item.id} className="rounded-lg border border-[#dbe5f0] bg-white px-3 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">{item.examTitle}</p>
                        <p className="mt-1 text-xs text-[#475569]">
                          {item.className} · {item.startTime} - {item.endTime}
                        </p>
                        {item.location ? (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#475569]">
                            <MapPin className="h-3.5 w-3.5" />
                            {item.location}
                          </p>
                        ) : null}
                        {item.notes ? <p className="mt-1 text-xs text-[#475569]">{item.notes}</p> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditSchedule(item)}
                          className="rounded-md border border-zinc-200 bg-white p-1.5 text-zinc-600 transition hover:bg-zinc-50"
                          title="Засах"
                          aria-label="Засах"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSchedule(item.id)}
                          className="rounded-md border border-red-200 bg-red-50 p-1.5 text-red-700 transition hover:bg-red-100"
                          title="Устгах"
                          aria-label="Устгах"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-[#0f172a]">
                  {editingScheduleId ? "Хуваарь засах" : "Хуваарь хадгалах"}
                </h4>
                <p className="mt-1 text-sm text-[#475569]">
                  {new Intl.DateTimeFormat("mn-MN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(parseDateKey(form.examDate))} өдрийн шалгалтын мэдээлэл оруулна.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setFormError(null);
                }}
                className="rounded-md border border-[#dbe5f0] p-1.5 text-[#334155] transition hover:bg-[#f1f5f9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={createSchedule} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                Шалгалтын нэр
                <input
                  value={form.examTitle}
                  onChange={(e) => setForm((current) => ({ ...current, examTitle: e.target.value }))}
                  required
                  className="mt-1 w-full rounded-lg border border-[#dbe5f0] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                Анги
                <input
                  value={form.className}
                  onChange={(e) => setForm((current) => ({ ...current, className: e.target.value }))}
                  required
                  placeholder="Жишээ: 10А"
                  className="mt-1 w-full rounded-lg border border-[#dbe5f0] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                Байршил / Өрөө
                <input
                  value={form.location}
                  onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
                  placeholder="Жишээ: 101 тоот"
                  className="mt-1 w-full rounded-lg border border-[#dbe5f0] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Эхлэх
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm((current) => ({ ...current, startTime: e.target.value }))}
                    required
                    className="mt-1 w-full rounded-lg border border-[#dbe5f0] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Дуусах
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm((current) => ({ ...current, endTime: e.target.value }))}
                    required
                    className="mt-1 w-full rounded-lg border border-[#dbe5f0] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#64748b] sm:col-span-2">
                Тэмдэглэл
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
                  className="mt-1 min-h-20 w-full rounded-lg border border-[#dbe5f0] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Танхим, заавар, нэмэлт мэдээлэл..."
                />
              </label>

              <div className="sm:col-span-2">
                {formError ? <p className="text-sm font-medium text-red-600">{formError}</p> : null}
              </div>

              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingScheduleId(null);
                    setIsCreateOpen(false);
                    setFormError(null);
                  }}
                  className="rounded-lg border border-[#dbe5f0] bg-white px-3 py-2 text-sm font-medium text-[#334155] transition hover:bg-[#f8fafc]"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {editingScheduleId ? "Өөрчлөлт хадгалах" : "Хадгалах"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
