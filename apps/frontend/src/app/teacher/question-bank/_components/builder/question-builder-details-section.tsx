"use client";

import {
  NATIONAL_SCRIPT_SUBJECT,
  SUBTOPIC_OPTIONS,
} from "../../_lib/constants";
import type {
  QuestionBuilderValues,
  QuestionValidationErrors,
} from "../../_lib/types";
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
  gradeOptions: string[];
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
  gradeOptions,
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
          <SelectTrigger className="h-[46px] rounded-[12px] border-[#d3deef] bg-[#fafafa] px-[14px] text-[13px] shadow-none focus:border-[#4f9dff] focus:ring-[#4f9dff]/10">
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
          className={`${builderInputClassName} h-[46px] rounded-[12px] bg-[#fafafa] px-[14px] shadow-none`}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Асуултын гарчиг бичих"
          value={values.title}
        />
      </div>

      {validationErrors?.grade ||
      validationErrors?.subject ||
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
              className={`${builderInputClassName} min-h-18 px-[20px] py-3`}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="Сурагчид харагдах асуулгын текстээ энд бичнэ үү."
              value={values.prompt}
            />
            {values.subject === NATIONAL_SCRIPT_SUBJECT ? (
              <NationalScriptAssist
                key={values.subject}
                onApplyText={onPromptChange}
              />
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
