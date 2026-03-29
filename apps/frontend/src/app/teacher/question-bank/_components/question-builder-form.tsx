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
import {
  GRADE_OPTIONS,
  SUBJECT_OPTIONS,
  SUBTOPIC_OPTIONS,
} from "../_lib/constants";
import {
  QUESTION_DIFFICULTIES,
  type QuestionBuilderValues,
  type QuestionValidationErrors,
  type QuestionType,
} from "../_lib/types";
import {
  createEmptyOption,
  createQuestionBuilderValues,
  DIFFICULTY_LABELS,
} from "../_lib/utils";
import { FormulaEditor } from "./formula-editor";
import { ImageUploader } from "./image-uploader";
import { QuestionTypeSelector } from "./question-type-selector";

const MATH_FORMULA_HELPERS = [
  { label: "sin", value: "\\sin(x)" },
  { label: "cos", value: "\\cos(x)" },
  { label: "tan", value: "\\tan(x)" },
  { label: "frac", value: "\\frac{a}{b}" },
  { label: "sqrt", value: "\\sqrt{x}" },
  { label: "pi", value: "\\pi" },
  { label: "lim", value: "\\lim_{x \\to a}" },
];

const PHYSICS_FORMULA_HELPERS = [
  { label: "v = s/t", value: "v = \\frac{s}{t}" },
  { label: "F = ma", value: "F = ma" },
  { label: "sqrt", value: "\\sqrt{x}" },
  { label: "delta", value: "\\Delta x" },
  { label: "lambda", value: "\\lambda" },
];

const GENERIC_FORMULA_HELPERS = [
  { label: "frac", value: "\\frac{a}{b}" },
  { label: "sqrt", value: "\\sqrt{x}" },
  { label: "x^2", value: "x^{2}" },
];

type QuestionBuilderFormProps = {
  initialValues?: QuestionBuilderValues | null;
  subjectOptions?: string[];
  validationErrors?: QuestionValidationErrors;
  onClose: () => void;
  onSubmit: (values: QuestionBuilderValues) => void;
};

export function QuestionBuilderForm({
  initialValues,
  subjectOptions = SUBJECT_OPTIONS as unknown as string[],
  validationErrors,
  onClose,
  onSubmit,
}: QuestionBuilderFormProps) {
  const builderGradeOptions = GRADE_OPTIONS.filter((grade) => {
    const gradeNumber = Number.parseInt(grade, 10);
    return gradeNumber >= 6 && gradeNumber <= 12;
  });

  const [values, setValues] = useState<QuestionBuilderValues>(
    initialValues ?? createQuestionBuilderValues(),
  );
  const [featureErrors, setFeatureErrors] = useState<
    Pick<QuestionValidationErrors, "formulaRaw" | "imageUrl">
  >({});
  const [includesImage, setIncludesImage] = useState(
    Boolean(initialValues?.imageUrl),
  );
  const [includesFormula, setIncludesFormula] = useState(
    Boolean(initialValues?.formulaRaw)
      || initialValues?.questionType === "formula_input",
  );

  const selectedMode =
    values.questionType === "multiple_choice" ? "multiple_choice" : "long_answer";
  const formulaHelpers = getFormulaHelpers(values.subject);
  const formulaHelperTitle = values.subject.trim()
    ? `${values.subject} хичээлийн томьёоны туслах`
    : "Томьёоны туслах";

  const updateValue = <Key extends keyof QuestionBuilderValues>(
    key: Key,
    value: QuestionBuilderValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));

    if (key === "formulaRaw") {
      setFeatureErrors((current) => ({ ...current, formulaRaw: undefined }));
    }

    if (key === "imageUrl") {
      setFeatureErrors((current) => ({ ...current, imageUrl: undefined }));
    }
  };

  const handleQuestionTypeChange = (questionType: QuestionType) => {
    setValues((current) => ({
      ...current,
      questionType:
        questionType === "multiple_choice" ? "multiple_choice" : "long_answer",
      options:
        questionType === "multiple_choice"
          ? current.options.length > 0
            ? current.options
            : [
                createEmptyOption(0),
                createEmptyOption(1),
                createEmptyOption(2),
                createEmptyOption(3),
              ]
          : [],
    }));
  };

  const handleFeatureToggle = (feature: "image" | "formula", checked: boolean) => {
    if (feature === "image") {
      setIncludesImage(checked);
      setFeatureErrors((current) => ({ ...current, imageUrl: undefined }));
      if (!checked) {
        updateValue("imageUrl", "");
      }
      return;
    }

    setIncludesFormula(checked);
    setFeatureErrors((current) => ({ ...current, formulaRaw: undefined }));
    if (!checked) {
      updateValue("formulaRaw", "");
    }
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

  const applyDemoValues = () => {
    setIncludesFormula(true);
    setFeatureErrors({});
    setValues((current) => ({
      ...current,
      title: "Тригонометрийн уламжлал бодох",
      questionType: "multiple_choice",
      prompt: "y = sin(x^2) функцийг дифференциалдаж хариуг сонгоно уу.",
      guidance: "Гинжин дүрмийг ашиглана уу.",
      explanation: "11-р ангийн тригонометрийн жишиг даалгавар.",
      options: [
        { id: "option-1", text: "2xcos(x^2)", isCorrect: true },
        { id: "option-2", text: "cos(x^2)", isCorrect: false },
        { id: "option-3", text: "2sin(x^2)", isCorrect: false },
        { id: "option-4", text: "xsin(x)", isCorrect: false },
      ],
      correctAnswer: "2xcos(x^2)",
      rubric: "Зөв хариултыг сонгосон бол бүтэн оноо.",
      formulaRaw: "\\frac{d}{dx} \\sin(x^2) = 2x\\cos(x^2)",
      imageUrl: "",
      fileUploadConfig: {
        acceptedFileTypes: [".pdf"],
        instructions: "Хэрэв бодолтоо хавсаргах бол PDF файл байхаар.",
        maxFiles: 1,
      },
      subject: current.subject,
      grade: current.grade,
      subtopic: "Тригонометр",
      difficulty: "medium",
      points: 5,
      status: "published",
    }));
  };

  const handleSubmit = () => {
    const nextFeatureErrors: Pick<
      QuestionValidationErrors,
      "formulaRaw" | "imageUrl"
    > = {};

    if (includesImage && !values.imageUrl.trim()) {
      nextFeatureErrors.imageUrl = "Зураг оруулах эсвэл хавсаргана уу.";
    }

    if (includesFormula && !values.formulaRaw.trim()) {
      nextFeatureErrors.formulaRaw = "Томьёоны оролтоо бөглөнө үү.";
    }

    if (nextFeatureErrors.imageUrl || nextFeatureErrors.formulaRaw) {
      setFeatureErrors(nextFeatureErrors);
      return;
    }

    setFeatureErrors({});

    const nextQuestionType: QuestionType =
      selectedMode === "multiple_choice"
        ? "multiple_choice"
        : includesFormula
          ? "formula_input"
          : includesImage
            ? "image_based"
            : "long_answer";

    onSubmit({
      ...values,
      topic: values.subtopic.trim() || values.subject.trim(),
      questionType: nextQuestionType,
      status: "published",
    });
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
                {initialValues
                  ? "Асуултын агуулгыг сайжруулах"
                  : "Дахин ашиглах асуулт зохиох"}
              </h2>
              <p className="mt-2 text-sm text-[#5f7394]">
                Асуулт, үнэлгээ, мета мэдээллээ тохируулаад системийн санд
                шууд нийтэлнэ.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#d7e2f1] bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f6b96] transition hover:text-[#1f6feb]"
                onClick={applyDemoValues}
                type="button"
              >
                Demo
              </button>
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d7e2f1] bg-white text-[#4f6b96] transition hover:text-[#1f6feb]"
                onClick={onClose}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8 px-6 py-6">
          <section className="rounded-3xl border border-[#d8e2f0] bg-white p-5 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#183153]">
                  Асуултын төрөл
                </h3>
                <p className="text-sm text-[#6d7f9c]">
                  Эхлээд үндсэн төрлөө сонгоод, дараа нь нэмэлт хэрэгцээгээ
                  тэмдэглэнэ үү.
                </p>
              </div>
              <QuestionTypeSelector
                value={values.questionType}
                onChange={handleQuestionTypeChange}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <FeatureToggleCard
                  checked={includesImage}
                  description="Диаграмм, дүрс, зураг хавсаргах шаардлагатай бол нээнэ."
                  label="Зураг хэрэгтэй"
                  onCheckedChange={(checked) =>
                    handleFeatureToggle("image", checked)
                  }
                />
                <FeatureToggleCard
                  checked={includesFormula}
                  description={`${
                    values.subject || "Сонгосон хичээл"
                  } дээр томьёоны shortcut panel гаргана.`}
                  label="Томьёоны оролт хэрэгтэй"
                  onCheckedChange={(checked) =>
                    handleFeatureToggle("formula", checked)
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#d8e2f0] bg-white p-5 shadow-sm">
            <div className="grid gap-4 xl:grid-cols-2">
              <SelectField
                label="Анги"
                error={validationErrors?.grade}
                onValueChange={(value) => updateValue("grade", value)}
                options={builderGradeOptions.map((grade) => ({
                  label: grade,
                  value: grade,
                }))}
                placeholder="Анги сонгоно уу."
                value={values.grade}
              />
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
                  onChange={(event) => {
                    const nextSubject = event.target.value;
                    setValues((current) => ({
                      ...current,
                      subject: nextSubject,
                      subtopic: "",
                    }));
                  }}
                  placeholder="Математик"
                  value={values.subject}
                />
                <datalist id="question-bank-subjects">
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject} />
                  ))}
                </datalist>
              </Field>
            </div>

            <div className="mt-4">
              <SelectField
                disabled={
                  !SUBTOPIC_OPTIONS[
                    values.subject as keyof typeof SUBTOPIC_OPTIONS
                  ]?.length
                }
                label="Дэд сэдэв"
                onValueChange={(value) => updateValue("subtopic", value)}
                options={
                  SUBTOPIC_OPTIONS[
                    values.subject as keyof typeof SUBTOPIC_OPTIONS
                  ]?.map((subtopic) => ({
                    label: subtopic,
                    value: subtopic,
                  })) ?? []
                }
                placeholder="Хичээлээ сонгоно уу."
                value={values.subtopic}
              />
            </div>

            <div className="mt-4">
              <Field label="Асуулгын текст" error={validationErrors?.prompt}>
                <textarea
                  className={`${inputClassName} min-h-36 py-3`}
                  onChange={(event) =>
                    updateValue("prompt", event.target.value)
                  }
                  placeholder="Сурагчид харагдах асуулгын текстээ энд бичнэ үү."
                  value={values.prompt}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Тэмдэглэл">
                <textarea
                  className={`${inputClassName} min-h-28 py-3`}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    updateValue("guidance", nextValue);
                    updateValue("explanation", nextValue);
                  }}
                  placeholder="Нэмэлт тэмдэглэл, санамж, эсвэл энэ асуултыг дахин ашиглахтай холбоотой тайлбар."
                  value={values.guidance || values.explanation}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-[#d8e2f0] bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#183153]">
                Нэмэлт оролт
              </h3>
              <p className="text-sm text-[#6d7f9c]">
                Зураг эсвэл томьёо хэрэгтэй гэж сонгосон үед доорх хэсгүүд
                автоматаар гарч ирнэ.
              </p>
            </div>

            {includesImage || includesFormula ? (
              <div className="space-y-6">
                {includesImage ? (
                  <div className="rounded-2xl border border-[#dce5f2] bg-[#f8fbff] p-4">
                    <div className="mb-3">
                      <h3 className="text-base font-semibold text-[#183153]">
                        Зургийн хэсэг
                      </h3>
                      <p className="text-sm text-[#6d7f9c]">
                        Асуултад зураг нэмэх бол эндээс upload хийнэ.
                      </p>
                    </div>
                    <ImageUploader
                      error={featureErrors.imageUrl || validationErrors?.imageUrl}
                      imageUrl={values.imageUrl}
                      onChange={(value) => updateValue("imageUrl", value)}
                    />
                  </div>
                ) : null}

                {includesFormula ? (
                  <div className="rounded-2xl border border-[#dce5f2] bg-[#f8fbff] p-4">
                    <div className="mb-3">
                      <h3 className="text-base font-semibold text-[#183153]">
                        Томьёоны хэсэг
                      </h3>
                      <p className="text-sm text-[#6d7f9c]">
                        Сонгосон хичээлд тохирох тэмдэглэгээг ашиглаад
                        томьёогоо нэмнэ үү.
                      </p>
                    </div>
                    <FormulaEditor
                      error={
                        featureErrors.formulaRaw || validationErrors?.formulaRaw
                      }
                      helperDescription="Доорх товчлолууд дээр дарж томьёоны оролт руу шууд нэмнэ."
                      helperTitle={formulaHelperTitle}
                      helperTokens={formulaHelpers}
                      onChange={(value) => updateValue("formulaRaw", value)}
                      value={values.formulaRaw}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d8e2f0] bg-[#f8fbff] px-4 py-5 text-sm text-[#6d7f9c]">
                Одоогоор нэмэлт зураг эсвэл томьёоны panel идэвхжээгүй байна.
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-[#d8e2f0] bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#183153]">
                Хариултын тохиргоо
              </h3>
              <p className="text-sm text-[#6d7f9c]">
                {selectedMode === "multiple_choice"
                  ? "Сонгох асуултын"
                  : "Задгай асуултын"}{" "}
                үндсэн талбарууд энд харагдана.
              </p>
            </div>
            <DynamicQuestionFields
              mode={selectedMode}
              validationErrors={validationErrors}
              values={values}
              onAddOption={addOption}
              onMarkCorrectOption={markCorrectOption}
              onOptionChange={updateOption}
              onRemoveOption={removeOption}
              onSimpleChange={updateValue}
            />
          </section>

          <section className="rounded-3xl border border-[#d8e2f0] bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#183153]">Үнэлгээ</h3>
              <p className="text-sm text-[#6d7f9c]">
                Түвшин, оноо зэрэг үнэлгээтэй холбоотой тохиргоо.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Түвшин"
                onValueChange={(value) =>
                  updateValue(
                    "difficulty",
                    value as QuestionBuilderValues["difficulty"],
                  )
                }
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
                  onChange={(event) =>
                    updateValue("points", Number(event.target.value))
                  }
                  type="number"
                  value={values.points}
                />
              </Field>
            </div>
          </section>
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

function DynamicQuestionFields({
  mode,
  values,
  validationErrors,
  onSimpleChange,
  onOptionChange,
  onMarkCorrectOption,
  onAddOption,
  onRemoveOption,
}: {
  mode: "multiple_choice" | "long_answer";
  values: QuestionBuilderValues;
  validationErrors?: QuestionValidationErrors;
  onSimpleChange: <Key extends keyof QuestionBuilderValues>(
    key: Key,
    value: QuestionBuilderValues[Key],
  ) => void;
  onOptionChange: (optionId: string, value: string) => void;
  onMarkCorrectOption: (optionId: string) => void;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
}) {
  if (mode === "multiple_choice") {
    return (
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
                <Field label={`Сонголт ${index + 1}`}>
                  <input
                    className={inputClassName}
                    onChange={(event) =>
                      onOptionChange(option.id, event.target.value)
                    }
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
    );
  }

  return (
    <Field
      label="Рубрик эсвэл үнэлгээний тэмдэглэл"
      error={validationErrors?.rubric}
    >
      <textarea
        className={`${inputClassName} min-h-32 py-3`}
        onChange={(event) => onSimpleChange("rubric", event.target.value)}
        placeholder="Сайн, дунд, сул хариултад ямар агуулга байхыг тайлбарлана уу."
        value={values.rubric}
      />
    </Field>
  );
}

function FeatureToggleCard({
  checked,
  label,
  description,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
        checked
          ? "border-[#6caeff] bg-[#eef6ff]"
          : "border-[#d8e2f0] bg-white hover:border-[#a9c8f6]"
      }`}
    >
      <input
        checked={checked}
        className="mt-1 h-4 w-4 rounded border-[#b8c8dc] text-[#1f6feb] focus:ring-[#1f6feb]/20"
        onChange={(event) => onCheckedChange(event.target.checked)}
        type="checkbox"
      />
      <div>
        <p className="text-sm font-semibold text-[#183153]">{label}</p>
        <p className="mt-1 text-sm leading-6 text-[#607391]">{description}</p>
      </div>
    </label>
  );
}

function getFormulaHelpers(subject: string) {
  const normalized = subject.trim().toLowerCase();

  if (normalized.includes("мат")) {
    return MATH_FORMULA_HELPERS;
  }

  if (normalized.includes("физ")) {
    return PHYSICS_FORMULA_HELPERS;
  }

  return GENERIC_FORMULA_HELPERS;
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
      {error ? (
        <p className="text-sm font-medium text-[#d34f4f]">{error}</p>
      ) : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onValueChange,
  error,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-[#183153]">{label}</span>
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="h-12 rounded-2xl border-[#d3deef] focus:border-[#4f9dff] focus:ring-[#4f9dff]/10">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p className="text-sm font-medium text-[#d34f4f]">{error}</p>
      ) : null}
    </label>
  );
}

const inputClassName =
  "h-12 w-full rounded-2xl border border-[#d3deef] bg-white px-4 text-sm text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10";
