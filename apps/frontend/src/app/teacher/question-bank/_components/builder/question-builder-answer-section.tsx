"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { NATIONAL_SCRIPT_SUBJECT } from "../../_lib/constants";
import type {
  QuestionBuilderValues,
  QuestionValidationErrors,
} from "../../_lib/types";
import { hasTraditionalMongolianText } from "../../_lib/utils";
import { builderInputClassName } from "./question-builder-form-fields";
import { NationalScriptAssist } from "../shared/national-script-assist";

type QuestionBuilderAnswerSectionProps = {
  mode: "multiple_choice" | "long_answer";
  onAddOption: () => void;
  onMarkCorrectOption: (optionId: string) => void;
  onOptionChange: (optionId: string, value: string) => void;
  onRemoveOption: (optionId: string) => void;
  onRubricChange: (value: string) => void;
  validationErrors?: QuestionValidationErrors;
  values: QuestionBuilderValues;
};

export function QuestionBuilderAnswerSection(
  props: QuestionBuilderAnswerSectionProps,
) {
  const {
    mode,
    onAddOption,
    onMarkCorrectOption,
    onOptionChange,
    onRemoveOption,
    validationErrors,
    values,
  } = props;
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const isNationalScript = values.subject === NATIONAL_SCRIPT_SUBJECT;
  const activeOptionId = values.options.some(
    (option) => option.id === selectedOptionId,
  )
    ? selectedOptionId
    : (values.options[0]?.id ?? "");

  return (
    <section>
      <div className="mb-4 ml-1">
        <h3 className="text-[13px] font-semibold text-[#183153]">
          Хариултын тохиргоо
        </h3>
        <p className="text-[13px] text-[#6d7f9c]">
          {mode === "multiple_choice" ? "Сонгох асуултын" : "Задгай асуултын"}{" "}
          үндсэн талбарууд энд харагдана.
        </p>
      </div>

      {mode === "multiple_choice" ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {values.options.map((option, index) => (
              <div className="flex items-center gap-3" key={option.id}>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      id={`question-option-correct-${option.id}`}
                      checked={option.isCorrect}
                      className="peer absolute left-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 cursor-pointer opacity-0"
                      onChange={(event) => {
                        if (event.target.checked) onMarkCorrectOption(option.id);
                      }}
                      title="Зөв хариулт болгох"
                      type="checkbox"
                    />
                    <span className="pointer-events-none absolute left-4 top-1/2 z-20 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[10px] border-2 border-[#4A4A4A] bg-white text-[#4A4A4A]">
                      <Check className="h-5 w-5 opacity-0 peer-checked:opacity-100" />
                    </span>
                    {isNationalScript &&
                    hasTraditionalMongolianText(option.text) ? (
                      <textarea
                        className={`${builderInputClassName} min-h-24 overflow-x-auto py-3 pl-14 leading-8`}
                        onChange={(event) =>
                          onOptionChange(option.id, event.target.value)
                        }
                        placeholder={`Хариултын сонголт ${index + 1}`}
                        style={{
                          writingMode: "vertical-lr",
                          textOrientation: "mixed",
                          whiteSpace: "pre-wrap",
                        }}
                        value={option.text}
                      />
                    ) : (
                      <input
                        className={`${builderInputClassName} pl-14`}
                        onChange={(event) =>
                          onOptionChange(option.id, event.target.value)
                        }
                        placeholder={`Хариултын сонголт ${index + 1}`}
                        value={option.text}
                      />
                    )}
                  </div>
                </div>
                {values.options.length > 2 ? (
                  <button
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#f2b6b6] bg-white text-[28px] leading-none text-[#e59a9a]"
                    onClick={() => onRemoveOption(option.id)}
                    type="button"
                  >
                    -
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {validationErrors?.options ? (
            <p className="text-[13px] font-medium text-[#d34f4f]">
              {validationErrors.options}
            </p>
          ) : null}

          <button
            className="inline-flex h-[46px] items-center rounded-[12px] border border-[#272727] px-4 py-0 text-[13px] font-semibold text-[#272727] transition"
            onClick={onAddOption}
            type="button"
          >
            Сонголт нэмэх
            <Plus className="ml-3 h-4 w-4" />
          </button>

          {isNationalScript && activeOptionId ? (
            <div className="rounded-[12px] border border-[#d7e3f4] bg-[#FAFAFA] p-4">
              <label className="block space-y-2">
                <span className="text-[13px] font-semibold text-[#183153]">
                  Хөрвүүлсэн текст оруулах сонголт
                </span>
                <select
                  className={`${builderInputClassName} appearance-none`}
                  onChange={(event) => setSelectedOptionId(event.target.value)}
                  value={activeOptionId}
                >
                  {values.options.map((option, index) => (
                    <option key={option.id} value={option.id}>
                      {`Сонголт ${index + 1}`}
                    </option>
                  ))}
                </select>
              </label>

              <NationalScriptAssist
                applyLabel="Монгол бичгийг хариултад оруулах"
                heading="Галиг эхээс хариултын сонголт бэлдэх"
                placeholder="Жишээ нь: абу"
                onApplyText={(value) => onOptionChange(activeOptionId, value)}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
