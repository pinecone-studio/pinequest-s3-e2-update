"use client";

import { useRef } from "react";
import {
  NATIONAL_SCRIPT_SUBJECT,
  SUBTOPIC_OPTIONS,
} from "../../_lib/constants";
import type {
  QuestionBuilderValues,
  QuestionValidationErrors,
} from "../../_lib/types";
import { hasTraditionalMongolianText } from "../../_lib/utils";
import {
  BuilderField,
  builderInputClassName,
} from "./question-builder-form-fields";
import { NationalScriptAssist } from "../shared/national-script-assist";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QuestionBuilderDetailsSectionProps = {
  formulaRaw: string;
  gradeOptions: string[];
  includesFormula: boolean;
  includesImage: boolean;
  imageUrl: string;
  onGradeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onSubtopicChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  subjectOptions: string[];
  validationErrors?: QuestionValidationErrors;
  values: QuestionBuilderValues;
};

export function QuestionBuilderDetailsSection({
  formulaRaw,
  gradeOptions,
  includesFormula,
  includesImage,
  imageUrl,
  onGradeChange,
  onNotesChange,
  onPromptChange,
  onSubjectChange,
  onSubtopicChange,
  onTitleChange,
  subjectOptions,
  validationErrors,
  values,
}: QuestionBuilderDetailsSectionProps) {
  const subtopicOptions =
    SUBTOPIC_OPTIONS[values.subject as keyof typeof SUBTOPIC_OPTIONS] ?? [];
  const promptTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const shouldRenderPromptVertical =
    values.subject === NATIONAL_SCRIPT_SUBJECT &&
    hasTraditionalMongolianText(values.prompt) &&
    !/[A-Za-z\u0400-\u04FF0-9]/.test(values.prompt);

  const insertIntoPrompt = (snippet: string) => {
    const textarea = promptTextareaRef.current;
    const currentValue = values.prompt;

    if (!textarea) {
      const nextValue = currentValue.trim()
        ? `${currentValue}\n${snippet}`
        : snippet;
      onPromptChange(nextValue);
      return;
    }

    const start = textarea.selectionStart ?? currentValue.length;
    const end = textarea.selectionEnd ?? currentValue.length;
    const prefix = currentValue.slice(0, start);
    const suffix = currentValue.slice(end);
    const needsLeadingBreak = prefix.length > 0 && !prefix.endsWith("\n");
    const needsTrailingBreak = suffix.length > 0 && !suffix.startsWith("\n");
    const insertion = `${needsLeadingBreak ? "\n" : ""}${snippet}${needsTrailingBreak ? "\n" : ""}`;
    const nextValue = `${prefix}${insertion}${suffix}`;
    const nextCursor = prefix.length + insertion.length;

    onPromptChange(nextValue);

    requestAnimationFrame(() => {
      if (!promptTextareaRef.current) return;
      promptTextareaRef.current.focus();
      promptTextareaRef.current.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleInsertImage = () => {
    if (!includesImage || !imageUrl.trim()) return;
    insertIntoPrompt("[ЗУРАГ]");
  };

  const handleInsertFormula = () => {
    if (!includesFormula || !formulaRaw.trim()) return;
    insertIntoPrompt(formulaRaw.trim());
  };

  return (
    <section>
      <div className="grid gap-3 lg:grid-cols-[136px_120px_200px_228px]">
        <Select onValueChange={onSubjectChange} value={values.subject}>
          <SelectTrigger className="h-[46px] rounded-[12px] border-[#6cb4ff] bg-[#eef6ff] px-[10px] text-[13px] font-semibold text-[#183153] shadow-none focus:border-[#4f9dff] focus:ring-[#4f9dff]/10">
            <SelectValue placeholder="Математик" />
          </SelectTrigger>
          <SelectContent>
            {subjectOptions.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={onGradeChange} value={values.grade}>
          <SelectTrigger className="h-[46px] rounded-[12px] border-[#6cb4ff] bg-[#eef6ff] px-[10px] text-[13px] font-semibold text-[#183153] shadow-none focus:border-[#4f9dff] focus:ring-[#4f9dff]/10">
            <SelectValue placeholder="10-р анги" />
          </SelectTrigger>
          <SelectContent>
            {gradeOptions.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          disabled={!subtopicOptions.length}
          onValueChange={onSubtopicChange}
          value={values.subtopic}
        >
          <SelectTrigger className="h-11.5 rounded-[12px] border-[#d3deef] bg-[#fafafa] px-[14px] text-[13px] shadow-none focus:border-[#4f9dff] focus:ring-[#4f9dff]/10">
            <SelectValue placeholder="Дэд сэдэв сонгоно уу." />
          </SelectTrigger>
          <SelectContent>
            {subtopicOptions.map((subtopic) => (
              <SelectItem key={subtopic} value={subtopic}>
                {subtopic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          className={`${builderInputClassName} h-11.5 rounded-xl bg-[#fafafa] px-3.5 shadow-none`}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Асуултын гарчиг бичих"
          value={values.title}
        />
      </div>

      {validationErrors?.grade ||
      validationErrors?.subject ||
      validationErrors?.topic ||
      validationErrors?.title ? (
        <div className="mt-2 space-y-1">
          {validationErrors?.grade ? (
            <p className="text-[13px] font-medium text-[#d34f4f]">
              {validationErrors.grade}
            </p>
          ) : null}
          {validationErrors?.subject ? (
            <p className="text-[13px] font-medium text-[#d34f4f]">
              {validationErrors.subject}
            </p>
          ) : null}
          {validationErrors?.title ? (
            <p className="text-[13px] font-medium text-[#d34f4f]">
              {validationErrors.title}
            </p>
          ) : null}
          {validationErrors?.topic ? (
            <p className="text-[13px] font-medium text-[#d34f4f]">
              {validationErrors.topic}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="mt-4">
        <BuilderField
          error={validationErrors?.prompt}
          gapClassName="space-y-0"
          label="Асуулгын текст"
          labelClassName="ml-1"
        >
          <>
            <textarea
              className={`${builderInputClassName} px-5 py-3 ${
                shouldRenderPromptVertical
                  ? "min-h-20 overflow-x-auto leading-8"
                  : "min-h-32 leading-7"
              }`}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="Сурагчид харагдах асуулгын текстээ энд бичнэ үү."
              ref={promptTextareaRef}
              style={
                shouldRenderPromptVertical
                  ? {
                      writingMode: "vertical-lr",
                      textOrientation: "mixed",
                      whiteSpace: "pre-wrap",
                    }
                  : undefined
              }
              value={values.prompt}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className={`inline-flex h-10 items-center rounded-[12px] border px-4 text-[13px] font-semibold transition ${
                  includesImage && imageUrl.trim()
                    ? "border-[#d3deef] bg-white text-[#365077] hover:border-[#aac8f8] hover:text-[#1f6feb]"
                    : "border-[#e4ebf5] bg-[#f8fbff] text-[#b6c0d0]"
                }`}
                disabled={!includesImage || !imageUrl.trim()}
                onClick={handleInsertImage}
                type="button"
              >
                Зургийг асуултад оруулах
              </button>
              <button
                className={`inline-flex h-10 items-center rounded-[12px] border px-4 text-[13px] font-semibold transition ${
                  includesFormula && formulaRaw.trim()
                    ? "border-[#d3deef] bg-white text-[#365077] hover:border-[#aac8f8] hover:text-[#1f6feb]"
                    : "border-[#e4ebf5] bg-[#f8fbff] text-[#b6c0d0]"
                }`}
                disabled={!includesFormula || !formulaRaw.trim()}
                onClick={handleInsertFormula}
                type="button"
              >
                Томьёог асуултад оруулах
              </button>
            </div>
            {values.subject === NATIONAL_SCRIPT_SUBJECT ? (
              <NationalScriptAssist
                key={values.subject}
                onApplyText={onPromptChange}
              />
            ) : null}
            {includesImage || includesFormula ? (
              <p className="mt-2 text-[12px] leading-5 text-[#7a8aa5]">
                Зураг болон томьёог асуулгын текст дотор оруулахын тулд дээрх
                товчийг ашиглана уу.
              </p>
            ) : null}
          </>
        </BuilderField>
      </div>

      <div className="mt-4">
        <BuilderField
          gapClassName="space-y-0"
          label="Тэмдэглэл"
          labelClassName="ml-1"
        >
          <textarea
            className={`${builderInputClassName} min-h-18 px-[20px] py-3`}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Нэмэлт тэмдэглэл, санамж, эсвэл энэ асуултыг дахин ашиглахтай холбоотой тайлбар."
            value={values.guidance || values.explanation}
          />
        </BuilderField>
      </div>
    </section>
  );
}
