/** @format */

"use client";

import { Calendar, Clock3, MapPin } from "lucide-react";
import type { TeacherExamSchedule } from "../_types/exam-schedule";

export function TeacherExamScheduleReadOnly({
  schedules,
}: {
  schedules: TeacherExamSchedule[];
}) {
  if (schedules.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
        Энэ багшийн товлогдсон шалгалт D1-д бүртгэгдээгүй байна.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {schedules.map((s) => (
        <li
          key={s.id}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
        >
          <p className="font-semibold text-zinc-900">{s.subject}</p>
          <p className="mt-1 text-sm text-zinc-700">{s.className} анги</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {s.examDate}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {s.startTime} – {s.endTime}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {s.status === "completed" ? "Дууссан" : "Товлогдсон"}
            </span>
          </div>
          {s.notes?.trim() ? (
            <p className="mt-2 text-xs text-zinc-500">{s.notes}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
