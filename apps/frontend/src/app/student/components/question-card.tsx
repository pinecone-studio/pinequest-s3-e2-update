import type { ExamQuestion, OptionId } from "../types";

function hasTraditionalMongolianText(value: string) {
  return /[\u1800-\u18AF]/.test(value);
}

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
  const shouldRenderQuestionVertical = hasTraditionalMongolianText(question.text);

  return (
    <section>
      <p className="text-sm font-medium leading-[1.2] text-[#373737] sm:text-[16px]">
        Асуулт {question.questionNumber}
      </p>
      <h2
        className={`mt-2 break-words text-base font-normal text-[#1a2e68] select-none sm:text-lg md:text-[20px] ${
          shouldRenderQuestionVertical
            ? "min-h-20 overflow-x-auto leading-8"
            : "leading-snug"
        }`}
        style={
          shouldRenderQuestionVertical
            ? {
                writingMode: "vertical-lr",
                textOrientation: "mixed",
                whiteSpace: "pre-wrap",
              }
            : undefined
        }
      >
        {question.text}
      </h2>

      <div className="mt-4 space-y-2 sm:space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          const shouldRenderOptionVertical = hasTraditionalMongolianText(
            option.text,
          );
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={`flex w-full rounded-[14px] border px-4 py-2.5 text-left transition sm:rounded-[18px] sm:px-5 sm:py-3 ${
                isSelected
                  ? "border-[#48a7ff] bg-[#D7ECFF]"
                  : "border-[#A1A1A1] bg-[#FAFAFA] hover:border-[#93c5fd]"
              }`}
            >
              <span
                className={`break-words text-base font-normal text-[#575757] sm:text-[18px] ${
                  shouldRenderOptionVertical
                    ? "min-h-20 overflow-x-auto leading-8"
                    : ""
                }`}
                style={
                  shouldRenderOptionVertical
                    ? {
                        writingMode: "vertical-lr",
                        textOrientation: "mixed",
                        whiteSpace: "pre-wrap",
                      }
                    : undefined
                }
              >
                {index + 1}. {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
