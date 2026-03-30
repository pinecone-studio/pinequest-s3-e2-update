"use client";

import { QuestionTypeSelector } from "./question-type-selector";
import type { QuestionType } from "../types";

type QuestionBuilderTypeSectionProps = {
  includesFormula: boolean;
  includesImage: boolean;
  onFeatureToggle: (feature: "image" | "formula", checked: boolean) => void;
  onQuestionTypeChange: (questionType: QuestionType) => void;
  questionType: QuestionType;
  subject: string;
  supportsFormulaInput: boolean;
};

export function QuestionBuilderTypeSection({
  includesFormula,
  includesImage,
  onFeatureToggle,
  onQuestionTypeChange,
  questionType,
  subject,
  supportsFormulaInput,
}: QuestionBuilderTypeSectionProps) {
  return (
    <section className="rounded-3xl border border-[#d8e2f0] bg-white p-5 shadow-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-[#183153]">
            Асуултын төрөл
          </h3>
          <p className="text-sm text-[#6d7f9c]">
            Эхлээд үндсэн төрлөө сонгоод, дараа нь нэмэлт хэрэгцээгээ тэмдэглэнэ
            үү.
          </p>
        </div>

        <QuestionTypeSelector
          onChange={onQuestionTypeChange}
          value={questionType}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <FeatureToggleCard
            checked={includesImage}
            description="Диаграмм, дүрс, зураг хавсаргах шаардлагатай бол нээнэ."
            label="Зураг хэрэгтэй"
            onCheckedChange={(checked) => onFeatureToggle("image", checked)}
          />
          {supportsFormulaInput ? (
            <FeatureToggleCard
              checked={includesFormula}
              description={`${subject || "Сонгосон хичээл"} дээр томьёоны shortcut panel гаргана.`}
              label="Томьёоны оролт хэрэгтэй"
              onCheckedChange={(checked) => onFeatureToggle("formula", checked)}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d8e2f0] bg-[#f8fbff] p-4 text-sm text-[#6d7f9c]">
              Томьёоны нэмэлт оролт нь зөвхөн `Математик`, `Физик`, `Хими`
              хичээл дээр идэвхжинэ.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeatureToggleCard({
  checked,
  description,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  description: string;
  label: string;
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
