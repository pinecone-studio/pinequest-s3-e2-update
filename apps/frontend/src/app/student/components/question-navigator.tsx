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
    <section className="min-h-43 w-full rounded-xl border border-[#b8d9ff] bg-[#eef7ff] px-6 py-3">
      <h3 className="text-[18px] font-normal text-[#1a2e68]">Асуултууд</h3>

      <div className="mt-3 grid grid-cols-10 gap-3">
        {Array.from({ length: total }, (_, idx) => idx + 1).map((id) => {
          const isCurrent = id === currentQuestionId;
          const isAnswered = Boolean(answers[id]);
          const isFlagged = Boolean(flagged[id]);

          const stateClass = isCurrent
            ? "border-[#3b82f6] bg-[#e9f3ff] text-[#1a2e68]"
            : isFlagged
              ? "border-[#facc15] bg-[#fff8db] text-[#7a5800]"
              : isAnswered
                ? "border-[#4ade80] bg-[#effdf3] text-[#16a34a]"
                : "border-[#b8d9ff] bg-[#f4faff] text-[#5e7196] hover:bg-white";

          return (
            <button
              key={id}
              type="button"
              onClick={() => onJump(id)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-[18px] font-medium transition ${stateClass}`}
            >
              {id}
            </button>
          );
        })}
      </div>
    </section>
  );
}
