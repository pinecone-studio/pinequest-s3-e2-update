import { ChevronLeft, ChevronRight, Flag } from "lucide-react";

type ExamActionsProps = {
  isFirst: boolean;
  isLast: boolean;
  isFlagged: boolean;
  onPrevious: () => void;
  onToggleFlag: () => void;
  onNext: () => void;
};

export function ExamActions({
  isFirst,
  isLast,
  isFlagged,
  onPrevious,
  onToggleFlag,
  onNext,
}: ExamActionsProps) {
  return (
    <section className="rounded-2xl border border-[#dbe3f0] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className="inline-flex items-center gap-2 rounded-xl border border-[#dbe3f0] bg-white px-4 py-2 text-3 font-semibold text-[#384b75] hover:bg-[#f6f9ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Өмнөх
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleFlag}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-3 font-semibold transition ${
              isFlagged
                ? "border-[#f59e0b] bg-[#fffbeb] text-[#b45309]"
                : "border-[#dbe3f0] bg-white text-[#384b75] hover:bg-[#f6f9ff]"
            }`}
          >
            <Flag className="h-4 w-4" />
            Тэмдэглэх
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={isLast}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2 text-3 font-semibold text-white hover:bg-[#1e4fd8] disabled:cursor-not-allowed disabled:bg-[#9dbaf6]"
          >
            Дараах
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
