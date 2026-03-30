"use client";

import { X } from "lucide-react";
import { GRADE_OPTIONS, SUBJECT_OPTIONS } from "../_lib/constants";
import {
  type QuestionBuilderValues,
  type QuestionType,
  type QuestionValidationErrors,
} from "../_lib/types";
import { QuestionBuilderAdditionalSection } from "./question-builder-additional-section";
import { QuestionBuilderAnswerSection } from "./question-builder-answer-section";
import { QuestionBuilderDetailsSection } from "./question-builder-details-section";
import { QuestionBuilderScoringSection } from "./question-builder-scoring-section";
import { QuestionBuilderTypeSection } from "./question-builder-type-section";
import { useQuestionBuilderForm } from "../_hooks/use-question-builder-form";

type QuestionBuilderFormProps = {
  initialValues?: QuestionBuilderValues | null;
  onClose: () => void;
  onSubmit: (values: QuestionBuilderValues) => void;
  subjectOptions?: string[];
  validationErrors?: QuestionValidationErrors;
};

export function QuestionBuilderForm({
  initialValues,
  onClose,
  onSubmit,
  subjectOptions = SUBJECT_OPTIONS as unknown as string[],
  validationErrors,
}: QuestionBuilderFormProps) {
  const gradeOptions = GRADE_OPTIONS.filter((grade) => {
    const gradeNumber = Number.parseInt(grade, 10);
    return gradeNumber >= 6 && gradeNumber <= 12;
  });
  const {
    addOption,
    featureErrors,
    formulaHelpers,
    handleFeatureToggle,
    handleQuestionTypeChange,
    handleSubjectChange,
    includesFormula,
    includesImage,
    markCorrectOption,
    removeOption,
    selectedMode,
    setFeatureErrors,
    supportsFormulaInput,
    updateOption,
    updateValue,
    values,
  } = useQuestionBuilderForm(initialValues);

  const handleSubmit = () => {
    const nextFeatureErrors: Pick<QuestionValidationErrors, "formulaRaw" | "imageUrl"> = {};
    if (includesImage && !values.imageUrl.trim()) nextFeatureErrors.imageUrl = "Зураг оруулах эсвэл хавсаргана уу.";
    if (supportsFormulaInput && includesFormula && !values.formulaRaw.trim()) {
      nextFeatureErrors.formulaRaw = "Томьёоны оролтоо бөглөнө үү.";
    }
    if (nextFeatureErrors.imageUrl || nextFeatureErrors.formulaRaw) {
      setFeatureErrors(nextFeatureErrors);
      return;
    }

    const nextQuestionType: QuestionType =
      selectedMode === "multiple_choice"
        ? "multiple_choice"
        : supportsFormulaInput && includesFormula
          ? "formula_input"
          : includesImage
            ? "image_based"
            : "long_answer";

    setFeatureErrors({});
    onSubmit({
      ...values,
      topic: values.subtopic.trim() || values.subject.trim(),
      questionType: nextQuestionType,
      status: "published",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10233e]/30 p-4 backdrop-blur-[2px] sm:p-6">
      <div className="flex max-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-y-auto rounded-[28px] border border-[#d9e4f1] bg-[#f8fbff] shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-[#dce5f2] bg-[#f8fbff]/95 px-6 py-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7c8ba4]">
                {initialValues ? "Асуулт засах" : "Асуулт үүсгэх"}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#183153]">
                {initialValues ? "Асуултын агуулгыг сайжруулах" : "Дахин ашиглах асуулт зохиох"}
              </h2>
              <p className="mt-2 text-sm text-[#5f7394]">
                Асуулт, үнэлгээ, мета мэдээллээ тохируулаад системийн санд шууд нийтэлнэ.
              </p>
            </div>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d7e2f1] bg-white text-[#4f6b96] transition hover:text-[#1f6feb]"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-8 px-6 py-6">
          <QuestionBuilderTypeSection
            includesFormula={includesFormula}
            includesImage={includesImage}
            onFeatureToggle={handleFeatureToggle}
            onQuestionTypeChange={handleQuestionTypeChange}
            questionType={values.questionType}
            subject={values.subject}
            supportsFormulaInput={supportsFormulaInput}
          />
          <QuestionBuilderDetailsSection
            gradeOptions={gradeOptions}
            onGradeChange={(value) => updateValue("grade", value)}
            onNotesChange={(value) => {
              updateValue("guidance", value);
              updateValue("explanation", value);
            }}
            onPromptChange={(value) => updateValue("prompt", value)}
            onSubjectChange={handleSubjectChange}
            onSubtopicChange={(value) => updateValue("subtopic", value)}
            onTitleChange={(value) => updateValue("title", value)}
            subjectOptions={subjectOptions}
            validationErrors={validationErrors}
            values={values}
          />
          <QuestionBuilderAdditionalSection
            formulaError={featureErrors.formulaRaw || validationErrors?.formulaRaw}
            formulaHelpers={formulaHelpers}
            formulaRaw={values.formulaRaw}
            imageError={featureErrors.imageUrl || validationErrors?.imageUrl}
            imageUrl={values.imageUrl}
            includesFormula={includesFormula}
            includesImage={includesImage}
            onFormulaChange={(value) => updateValue("formulaRaw", value)}
            onImageChange={(value) => updateValue("imageUrl", value)}
            supportsFormulaInput={supportsFormulaInput}
          />
          <QuestionBuilderAnswerSection
            mode={selectedMode}
            onAddOption={addOption}
            onMarkCorrectOption={markCorrectOption}
            onOptionChange={updateOption}
            onRemoveOption={removeOption}
            onRubricChange={(value) => updateValue("rubric", value)}
            validationErrors={validationErrors}
            values={values}
          />
          <QuestionBuilderScoringSection
            difficulty={values.difficulty}
            onDifficultyChange={(value) => updateValue("difficulty", value)}
            onPointsChange={(value) => updateValue("points", value)}
            points={values.points}
            validationErrors={validationErrors}
          />
        </div>

        <div className="sticky bottom-0 mt-auto border-t border-[#dce5f2] bg-white px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#1f6feb] px-4 text-sm font-semibold text-white transition hover:bg-[#195fcc]"
              onClick={handleSubmit}
              type="button"
            >
              Асуултыг нэмэх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
