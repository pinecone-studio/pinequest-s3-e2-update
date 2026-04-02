import type { OptionId } from "../types";

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
  onJump,
}: QuestionNavigatorProps) {
  return (
    <section className="min-h-43 w-full rounded-[14px] border border-[#9ca3af] bg-white px-3 py-3 sm:px-5 md:px-6">
      <h3 className="text-base font-semibold text-[#1a2e68] sm:text-[18px]">
        Асуултууд
      </h3>

      <div className="mt-3 rounded-[10px] bg-transparent px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 sm:gap-2.5 md:grid-cols-10 md:gap-3">
          {Array.from({ length: total }, (_, idx) => idx + 1).map((id) => {
            const isCurrent = id === currentQuestionId;
            const isAnswered = Boolean(answers[id]);
            const isFlagged = Boolean(flagged[id]);

            const stateClass = isCurrent
              ? "border-[#3b82f6] bg-[#dbeeff] text-[#1a2e68]"
              : isFlagged
                ? "border-[#facc15] bg-[#fff4b3] text-[#7a5800]"
                : isAnswered
                  ? "border-[#4ade80] bg-[#eafff1] text-[#16a34a]"
                  : "border-[#b8d9ff] bg-white text-[#5e7196] hover:bg-[#f7fbff]";

            return (
              <button
                key={id}
                type="button"
                onClick={() => onJump(id)}
                className={`flex h-8 w-10 items-center justify-center rounded-[10px] border text-sm font-medium transition sm:h-8.5 sm:w-10 sm:text-[14px] ${stateClass}`}
              >
                {id}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
