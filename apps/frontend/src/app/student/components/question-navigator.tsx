import type { OptionId } from "../types";
import { NavigatorLegend } from "./navigator-legend";

type QuestionNavigatorProps = {
  total: number;
  currentQuestionId: number;
  answers: Partial<Record<number, OptionId>>;
  flagged: Partial<Record<number, boolean>>;
  answeredCount: number;
  onJump: (questionId: number) => void;
  onFinish: () => void;
};

export function QuestionNavigator({
  total,
  currentQuestionId,
  answers,
  flagged,
  answeredCount,
  onJump,
  onFinish,
}: QuestionNavigatorProps) {
  return (
    <section className="rounded-3xl border border-[#dbe3f0] bg-white p-6 shadow-[0_10px_26px_rgba(27,39,80,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-4 font-bold text-[#1f2a44]">Асуултууд</h3>
        <NavigatorLegend />
      </div>

      <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
        {Array.from({ length: total }, (_, idx) => idx + 1).map((id) => {
          const isCurrent = id === currentQuestionId;
          const isAnswered = Boolean(answers[id]);
          const isFlagged = Boolean(flagged[id]);

          const stateClass = isCurrent
            ? "border-[#2563eb] bg-[#2563eb] text-white"
            : isFlagged
              ? "border-[#f59e0b] bg-[#fffbeb] text-[#b45309]"
              : isAnswered
                ? "border-[#22c55e] bg-[#f0fdf4] text-[#15803d]"
                : "border-[#dbe3f0] bg-white text-[#4b5f89] hover:bg-[#f8fbff]";

          return (
            <button
              key={id}
              type="button"
              onClick={() => onJump(id)}
              className={`h-11 rounded-xl border text-3 font-bold transition ${stateClass}`}
            >
              {id}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-3 text-[#5f7090]">Явц: {answeredCount}/{total} хариулсан</p>
        <button
          type="button"
          onClick={onFinish}
          className="rounded-xl bg-[#1d4ed8] px-6 py-2.5 text-3 font-semibold text-white hover:bg-[#1b43bd]"
        >
          Шалгалт дуусгах
        </button>
      </div>
    </section>
  );
}
