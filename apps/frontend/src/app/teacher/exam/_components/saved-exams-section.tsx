"use client";

import { History } from "lucide-react";
import { SavedExamCard } from "./saved-exam-card";
import type { SavedExamRecord } from "../_lib/types";

export function SavedExamsSection({
  activeSavedExamId,
  hasLoadedSavedExams,
  savedExams,
  selectedClassByExamId,
  onDeleteSavedExam,
  onOpenSavedExam,
  onSelectClass,
  onSendSavedExam,
}: {
  activeSavedExamId: string | null;
  hasLoadedSavedExams: boolean;
  savedExams: SavedExamRecord[];
  selectedClassByExamId: Record<string, string>;
  onDeleteSavedExam: (savedExamId: string) => void;
  onOpenSavedExam: (savedExam: SavedExamRecord) => void;
  onSelectClass: (savedExamId: string, classId: string) => void;
  onSendSavedExam: (savedExam: SavedExamRecord) => void;
}) {
  return (
    <section className="rounded-[28px] border border-[#d7e6fb] bg-[#f5faff] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[#ecf1f7] pb-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#74839b]">
            <History className="h-4 w-4" />
            Хадгалсан шалгалтууд
          </div>
          <h2 className="mt-2 text-2xl font-bold text-[#183153]">Өмнө хадгалсан шалгалтын жагсаалт</h2>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-[#183153]">{savedExams.length} шалгалт</p>
          <p className="text-sm text-[#5f7394]">Ноорог болон нийтэлсэн төлөвүүд</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {hasLoadedSavedExams && savedExams.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#c6d9f8] bg-[#f4f9ff] px-5 py-8 text-center">
            <p className="text-lg font-semibold text-[#183153]">Хадгалсан шалгалт алга байна</p>
            <p className="mt-2 text-sm text-[#60728f]">Доорх бүтээгчээр шалгалтаа хадгалмагц энд шууд харагдана.</p>
          </div>
        ) : null}

        {savedExams.map((savedExam) => (
          <SavedExamCard
            isActive={activeSavedExamId === savedExam.id}
            key={savedExam.id}
            savedExam={savedExam}
            selectedClassId={selectedClassByExamId[savedExam.id]}
            onDelete={() => onDeleteSavedExam(savedExam.id)}
            onOpen={() => onOpenSavedExam(savedExam)}
            onSelectClass={(classId) => onSelectClass(savedExam.id, classId)}
            onSend={() => onSendSavedExam(savedExam)}
          />
        ))}
      </div>
    </section>
  );
}
