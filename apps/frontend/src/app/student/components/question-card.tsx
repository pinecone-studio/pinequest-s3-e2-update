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
  const shouldRenderTitleVertical =
    hasTraditionalMongolianText(question.title) &&
    !/[A-Za-z\u0400-\u04FF0-9]/.test(question.title);

  return (
    <section>
      <p className="text-sm font-semibold leading-[1.2] text-[#1f2a44] sm:text-[16px]">
        Асуулт {question.questionNumber}
      </p>
      <h2
        className={`mt-2 break-words text-base font-semibold text-[#162a68] select-none sm:text-lg md:text-[24px] ${
          shouldRenderTitleVertical
            ? "min-h-20 overflow-x-auto leading-8"
            : "leading-snug"
        }`}
        style={
          shouldRenderTitleVertical
            ? {
                writingMode: "vertical-lr",
                textOrientation: "mixed",
                whiteSpace: "pre-wrap",
              }
            : undefined
        }
      >
        {question.title}
      </h2>
      <h2
        className={`mt-3 break-words text-base font-semibold text-[#162a68] select-none sm:text-lg md:text-[24px] ${
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

      <div className="mt-4 space-y-2.5 sm:space-y-3">
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
                  ? "border-[#48a7ff] bg-[#DCEEFF]"
                  : "border-[#9ca3af] bg-white hover:border-[#93c5fd]"
              }`}
            >
              <span
                className={`break-words text-base font-normal text-[#3f3f46] sm:text-[18px] ${
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
