import type { ExamQuestion, OptionId } from "../types";

type QuestionCardProps = {
  question: ExamQuestion;
  selectedOption?: OptionId;
  onSelectOption: (optionId: OptionId) => void;
};

export function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <section className="rounded-3xl border border-[#dbe3f0] bg-white p-6 shadow-[0_12px_30px_rgba(27,39,80,0.06)]">
      <p className="text-3 font-semibold text-[#61739a]">
        Асуулт {question.questionNumber}
      </p>
      <h2 className="mt-2 text-5 font-bold leading-snug text-[#1f2a44]">
        {question.text}
      </h2>

      <div className="mt-5 space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                isSelected
                  ? "border-[#3b82f6] bg-[#eff6ff]"
                  : "border-[#dbe3f0] bg-white hover:border-[#93c5fd]"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-3 font-bold ${
                  isSelected
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#eef3fb] text-[#4a5d86]"
                }`}
              >
                {option.id}
              </span>
              <span
                className={`text-4 font-semibold ${
                  isSelected ? "text-[#1d4ed8]" : "text-[#2d3d62]"
                }`}
              >
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
