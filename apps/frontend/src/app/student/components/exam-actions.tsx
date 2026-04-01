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
    <section className="inline-flex h-[86px] w-full  justify-center items-center rounded-[22px] border border-[#b8d9ff] px-4 py-4">
      <div className="flex flex-nowrap items-center  justify-center gap-6">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className="inline-flex h-[46px] w-[122px] shrink-0 items-center justify-center gap-2 rounded-[12px] border border-[#B8DCFF]  px-4 py-3 text-[18px] font-normal text-[#304670] transition hover:bg-[#e6eef8] disabled:cursor-not-allowed disabled:border-[#dbe3f0] disabled:bg-[#edf4fb] disabled:text-[#8ea1bf]"
        >
          <ChevronLeft className="h-3 w-3" />
          Өмнөх
        </button>
        <button
          type="button"
          onClick={onToggleFlag}
          className={`inline-flex h-11.5 w-[158px] shrink-0 items-center justify-center gap-2 rounded-[12px] border px-4 py-3 text-[18px] font-normal transition ${
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
          className="inline-flex h-11.5 w-[126px] shrink-0 items-center justify-center gap-2 rounded-[12px] border border-[#29A4FF] bg-[#D7ECFF] px-4 py-3 text-[18px] font-normal text-[#304670] transition hover:bg-[#e1f0ff] disabled:cursor-not-allowed disabled:border-[#c7def6] disabled:bg-[#eef7ff] disabled:text-[#8ea1bf]"
        >
          Дараах
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </section>
  );
}
