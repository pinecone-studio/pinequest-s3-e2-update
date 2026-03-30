"use client";

import { SendHorizontal, Users } from "lucide-react";
import type { Student } from "@/app/lib/types";

type TeacherClassPendingExamDeliveryPanelProps = {
  className: string;
  deliveryMode: "all" | "sample";
  examTitle: string;
  onChangeDeliveryMode: (mode: "all" | "sample") => void;
  onClearSample: () => void;
  onSelectAllSample: () => void;
  onSubmit: () => void;
  onToggleStudent: (studentId: string) => void;
  selectedStudentIds: string[];
  students: Student[];
};

export function TeacherClassPendingExamDeliveryPanel({
  className,
  deliveryMode,
  examTitle,
  onChangeDeliveryMode,
  onClearSample,
  onSelectAllSample,
  onSubmit,
  onToggleStudent,
  selectedStudentIds,
  students,
}: TeacherClassPendingExamDeliveryPanelProps) {
  const selectedCount = selectedStudentIds.length;

  return (
    <section className="rounded-2xl border border-[#cfe0fb] bg-gradient-to-br from-[#eff6ff] via-white to-[#f8fbff] p-6 shadow-[0_12px_32px_rgba(79,157,255,0.10)] sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-[#122459]">Шалгалт илгээх</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#122459]">{examTitle}</h2>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-[#122459] sm:text-base">
            {className} ангид энэ шалгалтыг илгээхээс өмнө <span className="font-semibold">Бүгд</span> эсвэл <span className="font-semibold">Түүвэр</span> сонгоно уу.
          </p>
        </div>

        <button className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#1f6feb] px-5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(31,111,235,0.28)] transition hover:bg-[#195fcc]" onClick={onSubmit} type="button">
          <SendHorizontal className="mr-2 h-4 w-4" />
          Илгээх
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <div className="space-y-3 rounded-2xl border border-[#d7e6fb] bg-white p-3 shadow-sm">
          {[
            ["all", "Бүх сурагч", `${students.length} сурагчид бүгдэд нь илгээнэ`, "Бүгд"],
            ["sample", "Түүвэр", "Сонгосон сурагчдад л илгээнэ", `${selectedCount} сонгосон`],
          ].map(([mode, title, description, badge]) => (
            <button
              key={mode}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition ${
                deliveryMode === mode ? "bg-[#eaf3ff] text-[#122459]" : "bg-[#fbfdff] text-[#122459] hover:bg-[#f4f8ff]"
              }`}
              onClick={() => onChangeDeliveryMode(mode as "all" | "sample")}
              type="button"
            >
              <div>
                <p className="text-base font-semibold">{title}</p>
                <p className="mt-1 text-sm text-[#122459]">{description}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#122459]">{badge}</span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-[#d7e6fb] bg-white p-4 shadow-sm sm:p-5">
          {deliveryMode === "all" ? (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbdaf3] bg-[#f9fbff] px-6 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#122459]"><Users className="h-7 w-7" /></div>
              <p className="mt-4 text-lg font-semibold text-[#122459]">{className} ангийн бүх сурагч</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#122459] sm:text-base">
                Илгээх дарахад энэ ангийн {students.length} сурагч бүгд шалгалтыг авна.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#122459]">Сурагч сонгох</h3>
                  <p className="mt-1 text-sm text-[#122459]">Түүвэрт оруулах сурагчдаа сонгоно уу.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full border border-[#d7e2f1] bg-white px-3 py-1.5 text-xs font-semibold text-[#122459] transition hover:border-[#4f9dff] hover:text-[#122459]" onClick={onSelectAllSample} type="button">Бүгдийг сонгох</button>
                  <button className="rounded-full border border-[#d7e2f1] bg-white px-3 py-1.5 text-xs font-semibold text-[#122459] transition hover:border-[#4f9dff] hover:text-[#122459]" onClick={onClearSample} type="button">Цэвэрлэх</button>
                </div>
              </div>

              <div className="mt-4 max-h-[320px] overflow-y-auto rounded-2xl border border-[#e2e8f0]">
                <ul className="divide-y divide-[#eef3fa]">
                  {students.map((student) => {
                    const checked = selectedStudentIds.includes(student.id);
                    return (
                      <li key={student.id}>
                        <button
                          className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${checked ? "bg-[#edf5ff]" : "bg-white hover:bg-[#f8fbff]"}`}
                          onClick={() => onToggleStudent(student.id)}
                          type="button"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-[#122459]">{student.firstName} {student.lastName}</p>
                            <p className="mt-1 text-sm text-[#122459]">{student.studentNumber}</p>
                          </div>
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${checked ? "border-[#1f6feb] bg-[#1f6feb] text-white" : "border-[#c7d5ea] bg-white text-transparent"}`}>✓</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
