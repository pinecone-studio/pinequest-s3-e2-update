"use client";

import { Check } from "lucide-react";
import type {
  ActiveStudentEntry,
  MonitorExamCardItem,
} from "../_lib/monitoring";

export function MonitorDetailSection({
  activeClassId,
  activeClassLabel,
  activeExam,
  activeStudents,
  isMonitoring,
  monitorTotalStudents,
  remainingDurationLabel,
  onBackToList,
  onSelectClass,
  onStartMonitoring,
}: {
  activeClassId: string | null;
  activeClassLabel: string | null;
  activeExam: MonitorExamCardItem | null;
  activeStudents: ActiveStudentEntry[];
  isMonitoring: boolean;
  monitorTotalStudents: number;
  remainingDurationLabel: string;
  onBackToList: () => void;
  onSelectClass: (classId: string) => void;
  onStartMonitoring: () => void;
}) {
  const isStarted = Boolean(activeExam) && isMonitoring;
  const isTimeUp = remainingDurationLabel === "00:00";
  const isRunning = isStarted && !isTimeUp;
  const canManageExam = (activeExam?.classOptions?.length ?? 0) > 0;
  const startActionLabel = "Эхлүүлэх";
  const visibleStudents = activeStudents;
  /** Хяналт эхлээгүй үед төлөв харуулахгүй; эхэлсний дараа бүгдийг идэвхтэй гэж үзнэ (telemetry ирэх хүртэл). */
  type RowStatus = "active" | "warning" | "disconnected" | "submitted";
  const monitoredStudents = visibleStudents.map((student) => {
    const displayStatus = (isTimeUp ? "submitted" : "active") as RowStatus;
    return {
      ...student,
      monitorStatus: displayStatus,
      displayStatus,
    };
  });
  const activeCount = monitoredStudents.filter(
    (student) => student.displayStatus === "active",
  ).length;
  const warningCount = monitoredStudents.filter(
    (student) => student.displayStatus === "warning",
  ).length;
  const disconnectedCount = monitoredStudents.filter(
    (student) => student.displayStatus === "disconnected",
  ).length;

  return (
    <section className="space-y-6">
      {!activeExam ? (
        <div className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-4 text-[#66789f]">
          Одоогоор харах шалгалт алга байна.
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[#d9dee8] bg-white px-4 py-4 sm:px-6 sm:py-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[#bcd6f5] bg-[#d7ebff] px-5 py-3">
                <div className="flex items-center justify-start gap-3">
                  <p className="text-[20px] font-semibold text-[#1f2a44]">
                    Нийт сурагч
                  </p>
                  <p className="text-[44px] font-semibold leading-none text-[#1f2a44]">
                    {monitorTotalStudents}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-[#bcd6f5] bg-[#d7ebff] px-5 py-3">
                <div className="flex items-center justify-start gap-3">
                  <p className="text-[20px] font-semibold text-[#1f2a44]">
                    Идэвхтэй
                  </p>
                  <p className="text-[44px] font-semibold leading-none text-[#1f2a44]">
                    {isStarted ? activeCount : 0}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-[#bcd6f5] bg-[#d7ebff] px-[15px] py-2">
                <div className="flex items-center justify-start gap-3">
                  <p className="text-[20px] font-semibold text-[#5b3a15]">
                    Анхааруулга
                  </p>
                  <p className="text-[44px] font-semibold leading-none text-[#5b3a15]">
                    {isStarted ? warningCount : 0}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-[#bcd6f5] bg-[#d7ebff] px-5 py-3">
                <div className="flex items-center justify-start gap-3">
                  <p className="text-[20px] font-semibold text-[#d62828]">
                    Салсан
                  </p>
                  <p className="text-[44px] font-semibold leading-none text-[#d62828]">
                    {isStarted ? disconnectedCount : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-5 font-extrabold text-[#1f2a44]">
                  Сонгосон шалгалт
                </h2>
                <p className="mt-1 text-[14px] leading-[1.35] text-[#737373]">
                  Шалгалтын төлөв, ангийн сонголт, эхлүүлэх үйлдэл доор
                  нэгтгэгдэн харагдана.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBackToList}
                  className="rounded-xl border border-[#e1ecf6] bg-white  px-3 py-2 text-[10px] font-medium text-[#555]"
                >
                  Буцах
                </button>
                <span className="rounded-xl bg-[#d7ebff] px-3 py-2 text-[10px] font-medium text-[#355389]">
                  Сонгосон 1
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {(activeExam.classOptions?.length ?? 0) > 1 ? (
                <div className="flex flex-wrap gap-2">
                  {activeExam.classOptions.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => onSelectClass(group.id)}
                      className={`rounded-xl border px-3 py-2 text-[12px] font-medium transition ${
                        group.id === activeClassId
                          ? "border-[#7dc8ff] bg-[#d7ebff] text-[#355389]"
                          : "border-[#d9dee8] bg-white text-[#5c6786] hover:border-[#aac8f8]"
                      }`}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="rounded-md bg-[#d7ebff] px-3 py-0.5 text-[12px] font-medium text-[#355389]">
                  Анги: {activeClassLabel ?? activeExam.classLabel}
                </span>
              )}
              <span className="rounded-md bg-[#d7ebff] px-3 py-0.5 text-[12px] font-medium text-[#355389]">
                {activeExam.subject}
              </span>
              <span className="rounded-md bg-[#d7ebff] px-3 py-0.5 text-[12px] font-medium text-[#355389]">
                {activeExam.topic}
              </span>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_326px]">
              <div className="flex items-center justify-center rounded-xl border border-[#8fc5ff] bg-white px-4 py-3">
                <p className="text-[20px] font-semibold text-[#1f2a44]">
                  Хугацаа{" "}
                  <span className="ml-3 text-[30px] leading-none">
                    {remainingDurationLabel}
                  </span>
                </p>
              </div>
              {canManageExam ? (
                <button
                  type="button"
                  disabled={isRunning || isTimeUp}
                  onClick={onStartMonitoring}
                  className="rounded-xl bg-[#39a8ff] px-6 py-3 text-[25px] font-bold text-white transition hover:bg-[#2198f5] disabled:cursor-not-allowed disabled:bg-[#9ecff8]"
                >
                  {isTimeUp
                    ? "Дууссан"
                    : isRunning
                      ? "Явагдаж байна"
                      : startActionLabel}
                </button>
              ) : (
                <div className="rounded-xl border border-[#d9dee8] bg-white px-6 py-3 text-center text-3 text-[#66789f]">
                  Эхлүүлэх боломжгүй
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#d9dee8] bg-white p-4">
            <div className="grid grid-cols-3 gap-3">
              {monitoredStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-md bg-[#EDF6FF] px-4 py-3"
                >
                  <p className="text-[17px] font-semibold text-[#2d2d2d]">
                    {index + 1}. {student.fullName}
                  </p>
                  <span
                    className={`inline-flex items-center justify-center rounded-sm border px-3 py-1 text-[15px] font-semibold ${
                      !isStarted
                        ? "border-[#cbd5e1] text-[#64748b]"
                        : student.displayStatus === "active"
                          ? "border-[#22c55e] text-[#22c55e]"
                          : student.displayStatus === "warning"
                            ? "border-[#f59e0b] text-[#f59e0b]"
                            : student.displayStatus === "submitted"
                              ? "h-12 w-12 rounded-xl border-[#1d7bf2] px-0 py-0 text-[#1d7bf2]"
                              : "border-[#ef4444] text-[#ef4444]"
                    }`}
                  >
                    {!isStarted ? (
                      "Жагсаалт"
                    ) : student.displayStatus === "submitted" ? (
                      <Check className="h-6 w-6" strokeWidth={3} />
                    ) : student.displayStatus === "active" ? (
                      "Идэвхтэй"
                    ) : student.displayStatus === "warning" ? (
                      "Анхааруулга"
                    ) : (
                      "Салсан"
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
