"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBJECT_OPTIONS } from "../_lib/mock-data";
import { QUESTION_DIFFICULTIES, QUESTION_STATUSES, type QuestionBuilderValues, type QuestionValidationErrors, type QuestionType } from "../_lib/types";
import { createEmptyOption, createQuestionBuilderValues, DIFFICULTY_LABELS, QUESTION_TYPE_LABELS, STATUS_LABELS } from "../_lib/utils";
import { FormulaEditor } from "./formula-editor";
import { ImageUploader } from "./image-uploader";
import { QuestionTypeSelector } from "./question-type-selector";

type QuestionBuilderFormProps = {
  initialValues?: QuestionBuilderValues | null;
  validationErrors?: QuestionValidationErrors;
  onClose: () => void;
  onSubmit: (values: QuestionBuilderValues) => void;
};

export function QuestionBuilderForm({
  initialValues,
  validationErrors,
  onClose,
  onSubmit,
}: QuestionBuilderFormProps) {
  const [values, setValues] = useState<QuestionBuilderValues>(
    initialValues ?? createQuestionBuilderValues(),
  );

  const updateValue = <Key extends keyof QuestionBuilderValues>(key: Key, value: QuestionBuilderValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleQuestionTypeChange = (questionType: QuestionType) => {
    setValues((current) => ({
      ...current,
      questionType,
      options:
        questionType === "multiple_choice"
          ? current.options.length > 0
            ? current.options
            : [createEmptyOption(0), createEmptyOption(1), createEmptyOption(2), createEmptyOption(3)]
          : [],
    }));
  };

  const updateOption = (optionId: string, value: string) => {
    setValues((current) => ({
      ...current,
      options: current.options.map((option) =>
        option.id === optionId ? { ...option, text: value } : option,
      ),
    }));
  };

  const markCorrectOption = (optionId: string) => {
    setValues((current) => ({
      ...current,
      options: current.options.map((option) => ({
        ...option,
        isCorrect: option.id === optionId,
      })),
    }));
  };

  const addOption = () => {
    setValues((current) => ({
      ...current,
      options: [...current.options, createEmptyOption(current.options.length)],
    }));
  };

  const removeOption = (optionId: string) => {
    setValues((current) => ({
      ...current,
      options: current.options.filter((option) => option.id !== optionId),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10233e]/30 p-4 backdrop-blur-[2px] sm:p-6">
      <div className="flex w-full max-w-3xl max-h-[calc(100vh-3rem)] flex-col overflow-y-auto rounded-[28px] border border-[#d9e4f1] bg-[#f8fbff] shadow-2xl">
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
                Ноорог эсвэл нийтэлсэн төлөвөөр хадгалахаас өмнө асуулт, үнэлгээ, мета мэдээллээ тохируулна уу.
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
          <section className="rounded-[24px] border border-[#d8e2f0] bg-white p-5 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#183153]">Асуултын төрөл</h3>
                <p className="text-sm text-[#6d7f9c]">Агуулга оруулахаас өмнө асуултын хэлбэрээ сонгоно уу.</p>
              </div>
              <QuestionTypeSelector value={values.questionType} onChange={handleQuestionTypeChange} />
            </div>
          </section>

          <section className="rounded-[24px] border border-[#d8e2f0] bg-white p-5 shadow-sm">
            <div className="grid gap-4 xl:grid-cols-2">
              <Field label="Асуултын гарчиг" error={validationErrors?.title}>
                <input
                  className={inputClassName}
                  onChange={(event) => updateValue("title", event.target.value)}
                  placeholder="Жишээ: Тригонометрийн уламжлал бодох"
                  value={values.title}
                />
              </Field>
              <Field label="Хичээл" error={validationErrors?.subject}>
                <input
                  className={inputClassName}
                  list="question-bank-subjects"
                  onChange={(event) => updateValue("subject", event.target.value)}
                  placeholder="Математик"
                  value={values.subject}
                />
                <datalist id="question-bank-subjects">
                  {SUBJECT_OPTIONS.map((subject) => (
                    <option key={subject} value={subject} />
                  ))}
                </datalist>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Асуулгын текст" error={validationErrors?.prompt}>
                <textarea
                  className={`${inputClassName} min-h-36 py-3`}
                  onChange={(event) => updateValue("prompt", event.target.value)}
                  placeholder="Сурагчид харагдах асуулгын текстээ энд бичнэ үү."
                  value={values.prompt}
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <Field label="Багшийн тайлбар">
                <textarea
                  className={`${inputClassName} min-h-28 py-3`}
                  onChange={(event) => updateValue("guidance", event.target.value)}
                  placeholder="Нэмэлт тэмдэглэл, санамж, эсвэл нөхцөлийн тайлбар."
                  value={values.guidance}
                />
              </Field>
              <Field label="Дотоод тэмдэглэл">
                <textarea
                  className={`${inputClassName} min-h-28 py-3`}
                  onChange={(event) => updateValue("explanation", event.target.value)}
                  placeholder="Энэ асуултыг дахин ашиглах бусад багшид зориулсан тайлбар."
                  value={values.explanation}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#d8e2f0] bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#183153]">Хариултын тохиргоо</h3>
              <p className="text-sm text-[#6d7f9c]">
                {QUESTION_TYPE_LABELS[values.questionType]} төрлөөс хамааран талбарууд автоматаар өөрчлөгдөнө.
              </p>
            </div>
            <DynamicQuestionFields
              validationErrors={validationErrors}
              values={values}
              onAddOption={addOption}
              onFormulaChange={(value) => updateValue("formulaRaw", value)}
              onImageChange={(value) => updateValue("imageUrl", value)}
              onMarkCorrectOption={markCorrectOption}
              onOptionChange={updateOption}
              onRemoveOption={removeOption}
              onSimpleChange={updateValue}
            />
          </section>

          <section className="rounded-[24px] border border-[#d8e2f0] bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#183153]">Үнэлгээ</h3>
              <p className="text-sm text-[#6d7f9c]">Түвшин, оноо, төлөв зэрэг үнэлгээтэй холбоотой тохиргоо.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SelectField
                label="Түвшин"
                onValueChange={(value) => updateValue("difficulty", value as QuestionBuilderValues["difficulty"])}
                options={QUESTION_DIFFICULTIES.map((difficulty) => ({
                  label: DIFFICULTY_LABELS[difficulty],
                  value: difficulty,
                }))}
                value={values.difficulty}
              />
              <Field label="Оноо" error={validationErrors?.points}>
                <input
                  className={inputClassName}
                  min={1}
                  onChange={(event) => updateValue("points", Number(event.target.value))}
                  type="number"
                  value={values.points}
                />
              </Field>
              <SelectField
                label="Төлөв"
                onValueChange={(value) => updateValue("status", value as QuestionBuilderValues["status"])}
                options={QUESTION_STATUSES.map((status) => ({
                  label: STATUS_LABELS[status],
                  value: status,
                }))}
                value={values.status}
              />
              <Field label="Үнэлгээний хэлбэр">
                <div className="flex h-12 items-center rounded-2xl border border-[#d3deef] bg-[#f8fbff] px-4 text-sm font-medium text-[#365077]">
                  {values.questionType === "multiple_choice" && "Автомат үнэлгээ"}
                  {values.questionType === "short_answer" && "Хосолмол үнэлгээ"}
                  {values.questionType === "formula_input" && "Хосолмол үнэлгээ"}
                  {(values.questionType === "long_answer" ||
                    values.questionType === "image_based" ||
                    values.questionType === "file_upload") &&
                    "Гараар үнэлэх"}
                </div>
              </Field>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 mt-auto border-t border-[#dce5f2] bg-white px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#d7e2f1] px-4 text-sm font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
              onClick={() => onSubmit({ ...values, status: "draft" })}
              type="button"
            >
              Ноорог хадгалах
            </button>
            <button
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#1f6feb] px-4 text-sm font-semibold text-white transition hover:bg-[#195fcc]"
              onClick={() => onSubmit({ ...values, status: "published" })}
              type="button"
            >
              Асуултыг нийтлэх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DynamicQuestionFields({
  values,
  validationErrors,
  onSimpleChange,
  onOptionChange,
  onMarkCorrectOption,
  onAddOption,
  onRemoveOption,
  onFormulaChange,
  onImageChange,
}: {
  values: QuestionBuilderValues;
  validationErrors?: QuestionValidationErrors;
  onSimpleChange: <Key extends keyof QuestionBuilderValues>(key: Key, value: QuestionBuilderValues[Key]) => void;
  onOptionChange: (optionId: string, value: string) => void;
  onMarkCorrectOption: (optionId: string) => void;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onFormulaChange: (value: string) => void;
  onImageChange: (value: string) => void;
}) {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  if (values.questionType === "multiple_choice") {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {values.options.map((option, index) => (
            <div className="flex gap-3" key={option.id}>
              <button
                className={`mt-3 h-5 w-5 rounded-full border-2 ${
                  option.isCorrect ? "border-[#1f6feb] bg-[#1f6feb]" : "border-[#b8c8dc] bg-white"
                }`}
                onClick={() => onMarkCorrectOption(option.id)}
                type="button"
              />
              <div className="flex-1">
                  <Field label={`Сонголт ${index + 1}`}>
                  <input
                    className={inputClassName}
                    onChange={(event) => onOptionChange(option.id, event.target.value)}
                    placeholder={`Хариултын сонголт ${index + 1}`}
                    value={option.text}
                  />
                </Field>
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
          <p className="text-sm font-medium text-[#d34f4f]">{validationErrors.options}</p>
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
    );
  }

  if (values.questionType === "short_answer") {
    return (
      <Field label="Хүлээгдэх хариулт" error={validationErrors?.correctAnswer}>
        <input
          className={inputClassName}
          onChange={(event) => onSimpleChange("correctAnswer", event.target.value)}
          placeholder="Жишээ: Хлорофилл"
          value={values.correctAnswer}
        />
      </Field>
    );
  }

  if (values.questionType === "long_answer") {
    return (
      <Field label="Рубрик эсвэл үнэлгээний тэмдэглэл" error={validationErrors?.rubric}>
        <textarea
          className={`${inputClassName} min-h-32 py-3`}
          onChange={(event) => onSimpleChange("rubric", event.target.value)}
          placeholder="Сайн, дунд, сул хариултад ямар агуулга байхыг тайлбарлана уу."
          value={values.rubric}
        />
      </Field>
    );
  }

  if (values.questionType === "formula_input") {
    return <FormulaEditor error={validationErrors?.formulaRaw} onChange={onFormulaChange} value={values.formulaRaw} />;
  }

  if (values.questionType === "image_based") {
    return <ImageUploader error={validationErrors?.imageUrl} imageUrl={values.imageUrl} onChange={onImageChange} />;
  }

  const acceptValue = values.fileUploadConfig.acceptedFileTypes.join(", ");
  const maxFiles = Math.max(1, values.fileUploadConfig.maxFiles || 1);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Field label="Файл хавсаргах" error={validationErrors?.fileUploadConfig}>
        <input
          className={`${inputClassName} h-12 py-2`}
          multiple={maxFiles > 1}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            setAttachedFiles(files.slice(0, maxFiles));
          }}
          type="file"
          {...(acceptValue ? { accept: acceptValue } : {})}
        />
        {attachedFiles.length > 0 ? (
          <p className="text-xs font-medium text-[#4f6b96]">
            Сонгосон файл: {attachedFiles.map((file) => file.name).join(", ")}
          </p>
        ) : null}
      </Field>
      <Field label="Зөвшөөрөх файлын төрөл" error={validationErrors?.fileUploadConfig}>
        <input
          className={inputClassName}
          onChange={(event) =>
            onSimpleChange("fileUploadConfig", {
              ...values.fileUploadConfig,
              acceptedFileTypes: event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          placeholder=".pdf, .docx, .png"
          value={values.fileUploadConfig.acceptedFileTypes.join(", ")}
        />
      </Field>
      <Field label="Файлын дээд тоо">
        <input
          className={inputClassName}
          min={1}
          onChange={(event) =>
            onSimpleChange("fileUploadConfig", {
              ...values.fileUploadConfig,
              maxFiles: Number(event.target.value),
            })
          }
          type="number"
          value={values.fileUploadConfig.maxFiles}
        />
      </Field>
      <div className="xl:col-span-2">
        <Field label="Хавсаргах заавар" error={validationErrors?.fileUploadConfig}>
          <textarea
            className={`${inputClassName} min-h-32 py-3`}
            onChange={(event) =>
              onSimpleChange("fileUploadConfig", {
                ...values.fileUploadConfig,
                instructions: event.target.value,
              })
            }
            placeholder="Сурагчид юу хавсаргах, хэрхэн үнэлэгдэхийг тайлбарлана уу."
            value={values.fileUploadConfig.instructions}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-[#183153]">{label}</span>
      {children}
      {error ? <p className="text-sm font-medium text-[#d34f4f]">{error}</p> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-[#183153]">{label}</span>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="h-12 rounded-2xl border-[#d3deef]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

const inputClassName =
  "h-12 w-full rounded-2xl border border-[#d3deef] bg-white px-4 text-sm text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10";
