"use client";

import { SavedExamCard } from "./saved-exam-card";
import type { SavedExamRecord } from "../_lib/types";
import type { TeacherClassOption } from "../../_lib/teacher-class-options";

export function SavedExamsSection({
  activeSavedExamId,
  hasLoadedSavedExams,
  savedExams,
  teacherClasses,
  selectedClassByExamId,
  onDeleteSavedExam,
  onOpenMonitoring,
  onOpenSavedExam,
  onSelectClass,
  onSendSavedExam,
}: {
  activeSavedExamId: string | null;
  hasLoadedSavedExams: boolean;
  savedExams: SavedExamRecord[];
  teacherClasses: TeacherClassOption[];
  selectedClassByExamId: Record<string, string>;
  onDeleteSavedExam: (savedExamId: string) => void;
  onOpenMonitoring: (savedExam: SavedExamRecord) => void;
  onOpenSavedExam: (savedExam: SavedExamRecord) => void;
  onSelectClass: (savedExamId: string, classId: string) => void;
  onSendSavedExam: (savedExam: SavedExamRecord, openMonitoring?: boolean) => void;
}) {
  return (
    <section className="mx-5 rounded-xl border border-[#d7e6fb] bg-[#EDF6FF] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4  pb-4">
        <div>
          <div className="text-[15px] font-extrabold uppercase tracking-[0.14em] text-[#233e7c]">
            Хадгалсан шалгалтууд
          </div>
        </div>
        <div className="text-right">
          <p className="text-[20px] font-medium text-[#122459]">
            {savedExams.length} шалгалт
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {hasLoadedSavedExams && savedExams.length === 0 ? (
          <div className="h-29.75 rounded-[20px] border border-dashed border-[#404040] px-5 py-8 text-center">
            <p className="text-[20px] font-medium tracking-[0.04em] text-[#122459]">
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
            selectedClassId={selectedClassByExamId[savedExam.id]}
            onDelete={() => onDeleteSavedExam(savedExam.id)}
            onOpenMonitoring={() => onOpenMonitoring(savedExam)}
            onOpen={() => onOpenSavedExam(savedExam)}
            onSelectClass={(classId) => onSelectClass(savedExam.id, classId)}
            onSend={() => onSendSavedExam(savedExam)}
          />
        ))}
      </div>
    </section>
  );
}
