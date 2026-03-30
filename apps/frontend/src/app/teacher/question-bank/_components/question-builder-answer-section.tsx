"use client";

import { Plus, X } from "lucide-react";
import type {
  QuestionBuilderValues,
  QuestionValidationErrors,
} from "../types";
import {
  BuilderField,
  builderInputClassName,
} from "./question-builder-form-fields";

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

export function QuestionBuilderAnswerSection({
  mode,
  onAddOption,
  onMarkCorrectOption,
  onOptionChange,
  onRemoveOption,
  onRubricChange,
  validationErrors,
  values,
}: QuestionBuilderAnswerSectionProps) {
  return (
    <section className="rounded-3xl border border-[#d8e2f0] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#183153]">
          Хариултын тохиргоо
        </h3>
        <p className="text-sm text-[#6d7f9c]">
          {mode === "multiple_choice" ? "Сонгох асуултын" : "Задгай асуултын"}{" "}
          үндсэн талбарууд энд харагдана.
        </p>
      </div>

      {mode === "multiple_choice" ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {values.options.map((option, index) => (
              <div className="flex gap-3" key={option.id}>
                <button
                  className={`mt-3 h-5 w-5 rounded-full border-2 ${
                    option.isCorrect
                      ? "border-[#1f6feb] bg-[#1f6feb]"
                      : "border-[#b8c8dc] bg-white"
                  }`}
                  onClick={() => onMarkCorrectOption(option.id)}
                  type="button"
                />
                <div className="flex-1">
                  <BuilderField label={`Сонголт ${index + 1}`}>
                    <input
                      className={builderInputClassName}
                      onChange={(event) =>
                        onOptionChange(option.id, event.target.value)
                      }
                      placeholder={`Хариултын сонголт ${index + 1}`}
                      value={option.text}
                    />
                  </BuilderField>
                </div>
                {values.options.length > 2 ? (
                  <button
                    className="mt-8 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#f0d0d0] bg-[#fff5f5] text-[#c95050]"
                    onClick={() => onRemoveOption(option.id)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {validationErrors?.options ? (
            <p className="text-sm font-medium text-[#d34f4f]">
              {validationErrors.options}
            </p>
          ) : null}

          <button
            className="inline-flex h-11 items-center rounded-2xl border border-[#d7e2f1] px-4 text-sm font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
            onClick={onAddOption}
            type="button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Сонголт нэмэх
          </button>
        </div>
      ) : (
        <BuilderField
          error={validationErrors?.rubric}
          label="Рубрик эсвэл үнэлгээний тэмдэглэл"
        >
          <textarea
            className={`${builderInputClassName} min-h-32 py-3`}
            onChange={(event) => onRubricChange(event.target.value)}
            placeholder="Сайн, дунд, сул хариултад ямар агуулга байхыг тайлбарлана уу."
            value={values.rubric}
          />
        </BuilderField>
      )}
    </section>
  );
}
