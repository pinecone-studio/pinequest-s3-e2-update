import type { Question, QuestionQuality, ToastState } from "./types";
import { QuestionCard } from "./question-card";

type Props = {
  questions: Question[];
  totalCount: number;
  selectedIds: string[];
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: string, checked: boolean) => void;
  onArchive: (id: string) => void;
  onPreview: (question: Question) => void;
  onTryBulkAdd: () => void;
  showActionToast: (toast: ToastState) => void;
  qualityFn: (question: Question) => QuestionQuality;
};

export function QuestionList({
  questions,
  totalCount,
  selectedIds,
  allSelected,
  onSelectAll,
  onToggleSelect,
  onArchive,
  onPreview,
  onTryBulkAdd,
  showActionToast,
  qualityFn,
}: Props) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-[#d6e7ff] bg-white px-3 py-2">
          <input
            checked={allSelected}
            onChange={(event) => onSelectAll(event.target.checked)}
            type="checkbox"
          />
          <p className="text-sm text-[#5d6e8c]">Олон сонголт (дараагийн хувилбар)</p>
        </div>
        <button
          className="rounded-xl border border-dashed border-[#4F9DFF]/45 bg-[#4F9DFF]/10 px-3 py-2 text-xs font-semibold text-[#2568bc]"
          onClick={onTryBulkAdd}
          type="button"
        >
          Сонгосныг шалгалтад нэмэх ({selectedIds.length})
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d6e7ff] bg-white p-10 text-center">
          {totalCount === 0 ? (
            <>
              <p className="text-lg font-semibold text-[#1F2A44]">
                Асуултын сан одоогоор хоосон байна.
              </p>
              <p className="mt-1 text-sm text-[#5d6e8c]">
                Эхний асуултаа нэмээд ухаалаг сангаа эхлүүлээрэй.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-[#1F2A44]">Илэрц олдсонгүй.</p>
              <p className="mt-1 text-sm text-[#5d6e8c]">
                Хайлтын үг эсвэл шүүлтүүрээ өөрчлөөд дахин оролдоно уу.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              isSelected={selectedIds.includes(question.id)}
              key={question.id}
              onAddToExam={() =>
                showActionToast({
                  tone: "success",
                  message: `“${question.title}” асуултыг шалгалтад нэмлээ.`,
                })
              }
              onArchive={() => onArchive(question.id)}
              onEdit={() =>
                showActionToast({
                  tone: "info",
                  message: "Засварлах урсгал туршилтын горимд байна.",
                })
              }
              onPreview={() => onPreview(question)}
              onSelect={(checked) => onToggleSelect(question.id, checked)}
              quality={qualityFn(question)}
              question={question}
            />
          ))}
        </div>
      )}
    </section>
  );
}
