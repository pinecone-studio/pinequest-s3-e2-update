"use client";

import { SUBTOPIC_OPTIONS } from "../constants";
import type {
  QuestionBuilderValues,
  QuestionValidationErrors,
} from "../types";
import {
  BuilderField,
  BuilderSelectField,
  builderInputClassName,
} from "./question-builder-form-fields";

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
    <section className="rounded-3xl border border-[#d8e2f0] bg-white p-5 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-2">
        <BuilderSelectField
          error={validationErrors?.grade}
          label="Анги"
          onValueChange={onGradeChange}
          options={gradeOptions.map((grade) => ({ label: grade, value: grade }))}
          placeholder="Анги сонгоно уу."
          value={values.grade}
        />

        <BuilderField error={validationErrors?.title} label="Асуултын гарчиг">
          <input
            className={builderInputClassName}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Жишээ: Тригонометрийн уламжлал бодох"
            value={values.title}
          />
        </BuilderField>

        <BuilderField error={validationErrors?.subject} label="Хичээл">
          <input
            className={builderInputClassName}
            list="question-bank-subjects"
            onChange={(event) => onSubjectChange(event.target.value)}
            placeholder="Математик"
            value={values.subject}
          />
          <datalist id="question-bank-subjects">
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject} />
            ))}
          </datalist>
        </BuilderField>
      </div>

      <div className="mt-4">
        <BuilderSelectField
          disabled={!subtopicOptions.length}
          label="Дэд сэдэв"
          onValueChange={onSubtopicChange}
          options={subtopicOptions.map((subtopic) => ({
            label: subtopic,
            value: subtopic,
          }))}
          placeholder="Хичээлээ сонгоно уу."
          value={values.subtopic}
        />
      </div>

      <div className="mt-4">
        <BuilderField error={validationErrors?.prompt} label="Асуулгын текст">
          <textarea
            className={`${builderInputClassName} min-h-36 py-3`}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Сурагчид харагдах асуулгын текстээ энд бичнэ үү."
            value={values.prompt}
          />
        </BuilderField>
      </div>

      <div className="mt-4">
        <BuilderField label="Тэмдэглэл">
          <textarea
            className={`${builderInputClassName} min-h-28 py-3`}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Нэмэлт тэмдэглэл, санамж, эсвэл энэ асуултыг дахин ашиглахтай холбоотой тайлбар."
            value={values.guidance || values.explanation}
          />
        </BuilderField>
      </div>
    </section>
  );
}
