"use client";

import { useState } from "react";
import type {
  QuestionBuilderValues,
  QuestionType,
  QuestionValidationErrors,
} from "../_lib/types";
import { createEmptyOption, createQuestionBuilderValues } from "../_lib/utils";
import {
  getFormulaHelpers,
  subjectSupportsFormula,
} from "../_components/question-builder-form-utils";

export function useQuestionBuilderForm(initialValues?: QuestionBuilderValues | null) {
  const [values, setValues] = useState<QuestionBuilderValues>(
    initialValues ?? createQuestionBuilderValues(),
  );
  const [featureErrors, setFeatureErrors] = useState<
    Pick<QuestionValidationErrors, "formulaRaw" | "imageUrl">
  >({});
  const [includesImage, setIncludesImage] = useState(Boolean(initialValues?.imageUrl));
  const [includesFormula, setIncludesFormula] = useState(
    Boolean(initialValues?.formulaRaw) || initialValues?.questionType === "formula_input",
  );

  const selectedMode: "multiple_choice" | "long_answer" =
    values.questionType === "multiple_choice" ? "multiple_choice" : "long_answer";
  const supportsFormulaInput = subjectSupportsFormula(values.subject);
  const formulaHelpers = getFormulaHelpers(values.subject);

  const updateValue = <Key extends keyof QuestionBuilderValues>(
    key: Key,
    value: QuestionBuilderValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (key === "formulaRaw") setFeatureErrors((current) => ({ ...current, formulaRaw: undefined }));
    if (key === "imageUrl") setFeatureErrors((current) => ({ ...current, imageUrl: undefined }));
  };

  const handleQuestionTypeChange = (questionType: QuestionType) => {
    setValues((current) => ({
      ...current,
      questionType: questionType === "multiple_choice" ? "multiple_choice" : "long_answer",
      options:
        questionType === "multiple_choice"
          ? current.options.length > 0
            ? current.options
            : [createEmptyOption(0), createEmptyOption(1), createEmptyOption(2), createEmptyOption(3)]
          : [],
    }));
  };

  const handleFeatureToggle = (feature: "image" | "formula", checked: boolean) => {
    if (feature === "image") {
      setIncludesImage(checked);
      setFeatureErrors((current) => ({ ...current, imageUrl: undefined }));
      if (!checked) updateValue("imageUrl", "");
      return;
    }

    setIncludesFormula(checked);
    setFeatureErrors((current) => ({ ...current, formulaRaw: undefined }));
    if (!checked) updateValue("formulaRaw", "");
  };

  const handleSubjectChange = (nextSubject: string) => {
    const nextSupportsFormula = subjectSupportsFormula(nextSubject);
    if (!nextSupportsFormula) {
      setIncludesFormula(false);
      setFeatureErrors((current) => ({ ...current, formulaRaw: undefined }));
    }

    setValues((current) => ({
      ...current,
      subject: nextSubject,
      subtopic: "",
      formulaRaw: nextSupportsFormula ? current.formulaRaw : "",
    }));
  };

  const addOption = () =>
    setValues((current) => ({
      ...current,
      options: [...current.options, createEmptyOption(current.options.length)],
    }));

  const updateOption = (optionId: string, value: string) =>
    setValues((current) => ({
      ...current,
      options: current.options.map((option) =>
        option.id === optionId ? { ...option, text: value } : option,
      ),
    }));

  const markCorrectOption = (optionId: string) =>
    setValues((current) => ({
      ...current,
      options: current.options.map((option) => ({
        ...option,
        isCorrect: option.id === optionId,
      })),
    }));

  const removeOption = (optionId: string) =>
    setValues((current) => ({
      ...current,
      options: current.options.filter((option) => option.id !== optionId),
    }));

  return {
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
  };
}
