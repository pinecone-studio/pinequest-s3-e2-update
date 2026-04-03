"use client";

import { GRADE_OPTIONS, SUBJECT_OPTIONS } from "../../_lib/constants";
import {
  type QuestionBuilderValues,
  type QuestionType,
  type QuestionValidationErrors,
} from "../../_lib/types";
import { createEmptyOption } from "../../_lib/utils";
import { QuestionBuilderAdditionalSection } from "./question-builder-additional-section";
import { QuestionBuilderAnswerSection } from "./question-builder-answer-section";
import { QuestionBuilderDetailsSection } from "./question-builder-details-section";
import { QuestionBuilderScoringSection } from "./question-builder-scoring-section";
import { QuestionBuilderTypeSection } from "./question-builder-type-section";
import { useQuestionBuilderForm } from "../../_hooks/use-question-builder-form";
import {
  NATIONAL_SCRIPT_FORM_DEMO,
  NATIONAL_SCRIPT_SUBJECT,
} from "../../_lib/constants";
import { convertTextToTraditionalMongolian } from "@/app/lib/mongolian-script";

type QuestionBuilderFormProps = {
  initialValues?: QuestionBuilderValues | null;
  onClose: () => void;
  onDelete?: (questionId: string) => void;
  onSubmit: (values: QuestionBuilderValues) => void | Promise<void | boolean>;
  subjectOptions?: string[];
  validationErrors?: QuestionValidationErrors;
};

export function QuestionBuilderForm({
  initialValues,
  onClose,
  onDelete,
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
    replaceValues,
    selectedMode,
    setFeatureErrors,
    supportsFormulaInput,
    updateOption,
    updateValue,
    values,
  } = useQuestionBuilderForm(initialValues);

  const handleApplyNationalScriptDemo = () => {
    if (values.subject !== NATIONAL_SCRIPT_SUBJECT) return;

    handleFeatureToggle("image", false);
    if (supportsFormulaInput) {
      handleFeatureToggle("formula", false);
    }

    const nextQuestionType: QuestionType =
      selectedMode === "multiple_choice" ? "multiple_choice" : "long_answer";
    const convertedLead = convertTextToTraditionalMongolian(
      NATIONAL_SCRIPT_FORM_DEMO.promptLead,
    );
    const convertedWord = convertTextToTraditionalMongolian(
      NATIONAL_SCRIPT_FORM_DEMO.promptWord,
    );

    const demoOptions = NATIONAL_SCRIPT_FORM_DEMO.options.map((option, index) => ({
      ...createEmptyOption(index),
      text: option,
      isCorrect: index === NATIONAL_SCRIPT_FORM_DEMO.correctOptionIndex,
    }));

    replaceValues({
      ...values,
      questionType: nextQuestionType,
      title: NATIONAL_SCRIPT_FORM_DEMO.title,
      subtopic: values.subtopic || NATIONAL_SCRIPT_FORM_DEMO.subtopic,
      topic: values.topic || values.subtopic || NATIONAL_SCRIPT_FORM_DEMO.subtopic,
      prompt: `${convertedLead}\n\n${convertedWord}`,
      guidance: NATIONAL_SCRIPT_FORM_DEMO.guidance,
      explanation: NATIONAL_SCRIPT_FORM_DEMO.guidance,
      rubric:
        nextQuestionType === "long_answer"
          ? NATIONAL_SCRIPT_FORM_DEMO.rubric
          : values.rubric,
      correctAnswer:
        nextQuestionType === "long_answer"
          ? NATIONAL_SCRIPT_FORM_DEMO.openAnswer
          : values.correctAnswer,
      options:
        nextQuestionType === "multiple_choice" ? demoOptions : values.options,
      imageUrl: "",
      formulaRaw: "",
    });
    setFeatureErrors({});
  };

  const handleSubmit = async () => {
    const nextFeatureErrors: Pick<
      QuestionValidationErrors,
      "formulaRaw" | "imageUrl"
    > = {};
    if (includesImage && !values.imageUrl.trim())
      nextFeatureErrors.imageUrl = "Зураг оруулах эсвэл хавсаргана уу.";
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

    const finalValues: QuestionBuilderValues = {
      ...values,
      topic:
        values.topic.trim() || values.subtopic.trim() || values.subject.trim(),
      questionType: nextQuestionType,
      status: "published",
    };

    await onSubmit(finalValues);
  };

  const isEditing = Boolean(initialValues?.id);

  const handleDelete = () => {
    if (!initialValues?.id || !onDelete) return;
    onDelete(initialValues.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#10233e]/30 p-4 backdrop-blur-[2px] sm:p-6">
      <div className="my-2 flex max-h-[calc(100dvh-36px)] w-full max-w-[768px] flex-col overflow-x-hidden overflow-y-hidden rounded-[12px] border border-[#d9e4f1] bg-[#F5F5F5] shadow-2xl sm:my-4">
        <div className="sticky top-0 z-10 border-b border-[#dce5f2] bg-[#F5F5F5]/95 px-6 py-5 backdrop-blur">
          <div className="flex items-start gap-4">
            <div>
              <h2 className="mt-1 text-[23px] font-bold leading-[1.2] text-[#183153]">
                {initialValues
                  ? "Асуултын агуулгыг сайжруулах"
                  : "Асуултын агуулгыг сайжруулах"}
              </h2>
              <p className="mt-1 text-[13px] text-[#5f7394]">
                Системийн санд шууд нийтэлнэ.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-6">
          <div className="space-y-8">
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
              formulaRaw={values.formulaRaw}
              gradeOptions={gradeOptions}
              includesFormula={includesFormula}
              includesImage={includesImage}
              imageUrl={values.imageUrl}
              onGradeChange={(value) => updateValue("grade", value)}
              onNotesChange={(value) => {
                updateValue("guidance", value);
                updateValue("explanation", value);
              }}
              onApplyNationalScriptDemo={handleApplyNationalScriptDemo}
              onPromptChange={(value) => updateValue("prompt", value)}
              onSubjectChange={handleSubjectChange}
              onSubtopicChange={(value) => updateValue("subtopic", value)}
              onTitleChange={(value) => updateValue("title", value)}
              subjectOptions={subjectOptions}
              validationErrors={validationErrors}
              values={values}
            />
            <QuestionBuilderAdditionalSection
              formulaError={
                featureErrors.formulaRaw || validationErrors?.formulaRaw
              }
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
        </div>

        <div className="sticky bottom-0 mt-auto border-t border-[#dce5f2] bg-white px-[14px] py-[16px]">
          <div className="flex flex-col gap-[16px] sm:flex-row sm:justify-center">
            <button
              className="inline-flex h-[50px] w-full items-center justify-center rounded-[12px] border border-[#3a9df2] bg-white px-[4px] text-[13px] font-semibold text-[#3a9df2] transition hover:bg-[#f4faff] sm:w-[278px]"
              onClick={onClose}
              type="button"
            >
              Цуцлах
            </button>
            {isEditing ? (
              <button
                className="inline-flex h-[50px] w-full items-center justify-center rounded-[12px] border border-[#ff8e8e] bg-white px-[4px] text-[13px] font-semibold text-[#ef4444] transition hover:bg-[#fff5f5] sm:w-[278px]"
                onClick={handleDelete}
                type="button"
              >
                Устгах
              </button>
            ) : null}
            <button
              className="inline-flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#29A4FF] px-[4px] text-[13px] font-semibold text-white transition hover:bg-[#1f97f1] sm:w-[278px]"
              onClick={handleSubmit}
              type="button"
            >
              {isEditing ? "Засварлах" : "Асуулт нэмэх"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
