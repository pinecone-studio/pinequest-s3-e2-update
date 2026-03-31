"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { QuestionBuilderValues, QuestionType } from "../_lib/types";
import { createEmptyOption, createQuestionBuilderValues } from "../_lib/utils";
import {
  getFormulaHelpers,
  subjectSupportsFormula,
} from "../_components/question-builder-form-utils";

function syncFeatureFlags(values: QuestionBuilderValues) {
  return {
    includesImage:
      values.questionType === "image_based" || Boolean(values.imageUrl?.trim()),
    includesFormula:
      values.questionType === "formula_input" ||
      Boolean(values.formulaRaw?.trim()),
  };
}

export function useQuestionBuilderForm(
  initialValues?: QuestionBuilderValues | null,
) {
  const [values, setValues] = useState<QuestionBuilderValues>(() =>
    initialValues ? { ...initialValues } : createQuestionBuilderValues(),
  );
  const [includesImage, setIncludesImage] = useState(
    () =>
      syncFeatureFlags(initialValues ?? createQuestionBuilderValues())
        .includesImage,
  );
  const [includesFormula, setIncludesFormula] = useState(
    () =>
      syncFeatureFlags(initialValues ?? createQuestionBuilderValues())
        .includesFormula,
  );
  const [featureErrors, setFeatureErrors] = useState<{
    formulaRaw?: string;
    imageUrl?: string;
  }>({});

  const key = initialValues?.id ?? "new";
  useEffect(() => {
    const next = initialValues
      ? { ...initialValues }
      : createQuestionBuilderValues();
    setTimeout(() => {
      setValues(next);
    }, 0);
  }, [key]);

  const supportsFormulaInput = subjectSupportsFormula(values.subject);
  const formulaHelpers = useMemo(
    () => getFormulaHelpers(values.subject),
    [values.subject],
  );

  const selectedMode =
    values.questionType === "multiple_choice"
      ? ("multiple_choice" as const)
      : ("long_answer" as const);

  const updateValue = useCallback(
    <K extends keyof QuestionBuilderValues>(
      field: K,
      next: QuestionBuilderValues[K],
    ) => {
      setValues((current) => ({ ...current, [field]: next }));
    },
    [],
  );

  const handleSubjectChange = useCallback((subject: string) => {
    setValues((current) => ({ ...current, subject }));
    if (!subjectSupportsFormula(subject)) {
      setIncludesFormula(false);
    }
  }, []);

  const handleQuestionTypeChange = useCallback((questionType: QuestionType) => {
    if (questionType === "image_based") setIncludesImage(true);
    if (questionType === "formula_input") setIncludesFormula(true);
    setValues((current) => {
      const next = { ...current, questionType };
      if (questionType === "multiple_choice") {
        return {
          ...next,
          options:
            current.options.length >= 2
              ? current.options
              : [
                  createEmptyOption(0),
                  createEmptyOption(1),
                  createEmptyOption(2),
                  createEmptyOption(3),
                ],
        };
      }
      return next;
    });
  }, []);

  const handleFeatureToggle = useCallback(
    (feature: "image" | "formula", checked: boolean) => {
      if (feature === "image") setIncludesImage(checked);
      else setIncludesFormula(checked);
    },
    [],
  );

  const addOption = useCallback(() => {
    setValues((current) => ({
      ...current,
      options: [...current.options, createEmptyOption(current.options.length)],
    }));
  }, []);

  const removeOption = useCallback((optionId: string) => {
    setValues((current) => {
      const next = current.options.filter((option) => option.id !== optionId);
      if (next.length === 0) {
        return { ...current, options: [createEmptyOption(0)] };
      }
      if (!next.some((option) => option.isCorrect)) {
        next[0] = { ...next[0], isCorrect: true };
      }
      return { ...current, options: next };
    });
  }, []);

  const updateOption = useCallback((optionId: string, text: string) => {
    setValues((current) => ({
      ...current,
      options: current.options.map((option) =>
        option.id === optionId ? { ...option, text } : option,
      ),
    }));
  }, []);

  const markCorrectOption = useCallback((optionId: string) => {
    setValues((current) => ({
      ...current,
      options: current.options.map((option) => ({
        ...option,
        isCorrect: option.id === optionId,
      })),
    }));
  }, []);

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
