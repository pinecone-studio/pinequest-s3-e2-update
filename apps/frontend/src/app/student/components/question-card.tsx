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
    <section>
      <p className="text-[16px] font-medium leading-[1.2] text-[#373737]">
        Асуулт {question.questionNumber}
      </p>
      <h2 className="mt-2 text-[20px] font-normal leading-tight text-[#1a2e68] select-none">
        {question.text}
      </h2>

      <div className="mt-4 space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={`flex min-h-10.25 w-full items-center rounded-[18px] border px-5 py-3 text-left transition ${
                isSelected
                  ? "border-[#48a7ff] bg-[#D7ECFF]"
                  : "border-[#A1A1A1] bg-[#FAFAFA] hover:border-[#93c5fd]"
              }`}
            >
              <span className="text-[18px] font-normal text-[#575757]">
                {index + 1}. {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
