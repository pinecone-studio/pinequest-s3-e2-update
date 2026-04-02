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
    <section className="flex min-h-[5.5rem] w-full items-center justify-center rounded-[18px] border border-[#b8d9ff] px-2 py-3 sm:rounded-[22px] sm:px-4 sm:py-4 md:min-h-[86px]">
      <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-2 sm:gap-4 md:flex-nowrap md:gap-6">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className="inline-flex min-h-[44px] min-w-[6.5rem] flex-1 items-center justify-center gap-2 rounded-[12px] border border-[#B8DCFF] px-3 py-2.5 text-sm font-normal text-[#304670] transition hover:bg-[#e6eef8] disabled:cursor-not-allowed disabled:border-[#dbe3f0] disabled:bg-[#edf4fb] disabled:text-[#8ea1bf] sm:h-[46px] sm:min-w-[122px] sm:flex-none sm:px-4 sm:py-3 sm:text-[18px]"
        >
          <ChevronLeft className="h-3 w-3 shrink-0" />
          Өмнөх
        </button>
        <button
          type="button"
          onClick={onToggleFlag}
          className={`inline-flex min-h-[44px] min-w-[7rem] flex-1 items-center justify-center gap-2 rounded-[12px] border px-3 py-2.5 text-sm font-normal transition sm:h-11.5 sm:min-w-[158px] sm:flex-none sm:px-4 sm:py-3 sm:text-[18px] ${
            isFlagged
              ? "border-[#facc15] bg-[#FEFCE6] text-[#7a5800]"
              : "border-[#facc15] bg-[#FEFCE6] text-[#7a5800] hover:bg-[#fffdf2]"
          }`}
        >
          Тэмдэглэх
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          className="inline-flex min-h-[44px] min-w-[6.5rem] flex-1 items-center justify-center gap-2 rounded-[12px] border border-[#29A4FF] bg-[#D7ECFF] px-3 py-2.5 text-sm font-normal text-[#304670] transition hover:bg-[#e1f0ff] disabled:cursor-not-allowed disabled:border-[#c7def6] disabled:bg-[#eef7ff] disabled:text-[#8ea1bf] sm:h-11.5 sm:min-w-[126px] sm:flex-none sm:px-4 sm:py-3 sm:text-[18px]"
        >
          Дараах
          <ChevronRight className="h-3 w-3 shrink-0" />
        </button>
      </div>
    </section>
  );
}
