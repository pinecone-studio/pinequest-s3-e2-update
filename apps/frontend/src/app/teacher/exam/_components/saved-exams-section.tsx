"use client";

import { SavedExamCard } from "./saved-exam-card";
import type { SavedExamRecord } from "../_lib/types";
import type { TeacherClassOption } from "../../_lib/teacher-class-options";

export function SavedExamsSection({
  activeSavedExamId,
  hasLoadedSavedExams,
  savedExams,
  teacherClasses,
  onDeleteSavedExam,
  onOpenMonitoring,
  onOpenSavedExam,
}: {
  activeSavedExamId: string | null;
  hasLoadedSavedExams: boolean;
  savedExams: SavedExamRecord[];
  teacherClasses: TeacherClassOption[];
  onDeleteSavedExam: (savedExamId: string) => void;
  onOpenMonitoring: (savedExam: SavedExamRecord) => void;
  onOpenSavedExam: (savedExam: SavedExamRecord) => void;
}) {
  const hasSavedExams = savedExams.length > 0;

  return (
    <section
      className={`mx-3 rounded-xl border p-4 shadow-sm sm:mx-4 sm:p-5 md:mx-5 ${
        hasSavedExams
          ? "border-[#d7e6fb] bg-[#EDF6FF]"
          : "border-[#e5e7eb] bg-[#FAFAFA]"
      }`}
    >
      <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="text-sm font-extrabold uppercase tracking-[0.1em] text-[#233e7c] sm:text-[15px] sm:tracking-[0.14em]">
            Хадгалсан шалгалтууд
          </div>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="text-lg font-medium text-[#122459] sm:text-[20px]">
            {savedExams.length} шалгалт
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {hasLoadedSavedExams && !hasSavedExams ? (
          <div className="h-29.75 rounded-[20px] border border-dashed border-[#404040] px-4 py-6 text-center sm:px-5 sm:py-8">
            <p className="text-base font-medium tracking-[0.04em] text-[#122459] sm:text-[20px]">
              Хадгалсан шалгалт алга байна
            </p>
          </div>
        ) : null}

        {savedExams.map((savedExam) => (
          <SavedExamCard
            isActive={activeSavedExamId === savedExam.id}
            key={savedExam.id}
            savedExam={savedExam}
            teacherClasses={teacherClasses}
            onDelete={() => onDeleteSavedExam(savedExam.id)}
            onOpenMonitoring={() => onOpenMonitoring(savedExam)}
            onOpen={() => onOpenSavedExam(savedExam)}
          />
        ))}
      </div>
    </section>
  );
}
