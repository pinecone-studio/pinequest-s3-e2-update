import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <section className="flex min-h-[5.5rem] w-full items-center justify-start bg-transparent px-0 py-0 sm:px-0 sm:py-0 md:min-h-[86px]">
      <div className="flex w-full max-w-xl flex-wrap items-center justify-start gap-2 sm:gap-4 md:flex-nowrap md:gap-6">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className="inline-flex min-h-[44px] min-w-[6.5rem] flex-1 items-center justify-center gap-2 rounded-[12px] border border-[#97c7ff] bg-[#e9f3ff] px-3 py-2.5 text-sm font-medium text-[#1f2a44] transition hover:bg-[#dcecff] disabled:cursor-not-allowed disabled:border-[#dbe3f0] disabled:bg-[#edf4fb] disabled:text-[#8ea1bf] sm:h-[46px] sm:min-w-[122px] sm:flex-none sm:px-4 sm:py-3 sm:text-[18px]"
        >
          <ChevronLeft className="h-3 w-3 shrink-0" />
          Өмнөх
        </button>
        <button
          type="button"
          onClick={onToggleFlag}
          className={`inline-flex min-h-[44px] min-w-[7rem] flex-1 items-center justify-center gap-2 rounded-[12px] border px-3 py-2.5 text-sm font-normal transition sm:h-11.5 sm:min-w-[158px] sm:flex-none sm:px-4 sm:py-3 sm:text-[18px] ${
            isFlagged
              ? "border-[#facc15] bg-[#fff2b8] text-[#7a5800]"
              : "border-[#facc15] bg-[#fff2b8] text-[#7a5800] hover:bg-[#ffef9c]"
          }`}
        >
          Тэмдэглэх
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          className="inline-flex min-h-[44px] min-w-[6.5rem] flex-1 items-center justify-center gap-2 rounded-[12px] border border-[#97c7ff] bg-[#e9f3ff] px-3 py-2.5 text-sm font-medium text-[#1f2a44] transition hover:bg-[#dcecff] disabled:cursor-not-allowed disabled:border-[#c7def6] disabled:bg-[#eef7ff] disabled:text-[#8ea1bf] sm:h-11.5 sm:min-w-[126px] sm:flex-none sm:px-4 sm:py-3 sm:text-[18px]"
        >
          Дараах
          <ChevronRight className="h-3 w-3 shrink-0" />
        </button>
      </div>
    </section>
  );
}
