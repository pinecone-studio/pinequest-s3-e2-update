"use client";

import { Check } from "lucide-react";
import type {
  ActiveStudentEntry,
  MonitorExamCardItem,
} from "../_lib/monitoring";

export function MonitorDetailSection({
  activeClassLabel,
  activeExam,
  activeStudents,
  isMonitoring,
  monitoringElapsedSeconds,
  monitorTotalStudents,
  remainingDurationLabel,
  onBackToList,
  onStartMonitoring,
}: {
  activeClassId: string | null;
  activeClassLabel: string | null;
  activeExam: MonitorExamCardItem | null;
  activeStudents: ActiveStudentEntry[];
  isMonitoring: boolean;
  monitoringElapsedSeconds: number;
  monitorTotalStudents: number;
  remainingDurationLabel: string;
  onBackToList: () => void;
  onStartMonitoring: () => void;
}) {
  const isStarted = Boolean(activeExam) && isMonitoring;
  const isTimeUp = remainingDurationLabel === "00:00";
  const isRunning = isStarted && !isTimeUp;
  const canManageExam = (activeExam?.classOptions?.length ?? 0) > 0;
  const startActionLabel = "Эхлүүлэх";
  const hashSeed = (value: string) => {
    let h = 0;
    for (let i = 0; i < value.length; i += 1) {
      h = (h * 31 + value.charCodeAt(i)) % 10007;
    }
    return h;
  };
  const visibleStudents = activeStudents;
  const rankedIndexes = visibleStudents
    .map((student, index) => ({
      index,
      score: hashSeed(
        `${student.id || `student-${index}`}-${student.fullName}-${monitoringElapsedSeconds}`,
      ),
    }))
    .sort((a, b) => a.score - b.score);
  const disconnectedIndexSet = new Set<number>();
  const warningIndexSet = new Set<number>();
  if (isStarted && rankedIndexes.length > 0) {
    disconnectedIndexSet.add(rankedIndexes[0].index);
    const warningCount = Math.min(3, Math.max(0, rankedIndexes.length - 1));
    rankedIndexes
      .slice(1, 1 + warningCount)
      .forEach((entry) => warningIndexSet.add(entry.index));
  }
  const monitoredStudents = visibleStudents.map((student, index) => {
    const monitorStatus: "active" | "warning" | "disconnected" | "submitted" =
      student.status === "submitted"
        ? "submitted"
        : disconnectedIndexSet.has(index)
          ? "disconnected"
          : warningIndexSet.has(index)
            ? "warning"
            : "active";
    const displayStatus: "active" | "warning" | "disconnected" | "submitted" =
      isTimeUp && monitorStatus !== "disconnected"
        ? "submitted"
        : monitorStatus;
    return {
      ...student,
      monitorStatus,
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
              <div className="rounded-xl border border-[#f2cf66] bg-[#fff8df] px-5 py-3">
                <div className="flex items-center justify-start gap-3">
                  <p className="text-[20px] font-semibold text-[#5b3a15]">
                    Анхааруулга
                  </p>
                  <p className="text-[44px] font-semibold leading-none text-[#5b3a15]">
                    {isStarted ? warningCount : 0}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-[#f3b3b3] px-5 py-3">
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
                  className="rounded-2xl border border-[#e1ecf6] bg-white px-4 py-1.5 text-3 font-medium text-[#555]"
                >
                  Буцах
                </button>
                <span className="rounded-2xl bg-[#d7ebff] px-4 py-1.5 text-3 font-medium text-[#355389]">
                  Сонгосон 1
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-[#d7ebff] px-3 py-0.5 text-[12px] font-medium text-[#355389]">
                Илгээсэн анги: {activeClassLabel ?? activeExam.classLabel}
              </span>
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
                      student.displayStatus === "active"
                        ? "border-[#22c55e] text-[#22c55e]"
                        : student.displayStatus === "warning"
                          ? "border-[#f59e0b] text-[#f59e0b]"
                          : student.displayStatus === "submitted"
                            ? "h-12 w-12 rounded-xl border-[#1d7bf2] px-0 py-0 text-[#1d7bf2]"
                            : "border-[#ef4444] text-[#ef4444]"
                    }`}
                  >
                    {student.displayStatus === "submitted" ? (
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
