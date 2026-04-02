"use client";

import { Check } from "lucide-react";
import { QuestionTypeSelector } from "./question-type-selector";
import type { QuestionType } from "../../_lib/types";

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
    <section>
      <div className="space-y-4">
        <div>
          <h3 className="text-[13px] font-semibold text-[#183153] ml-2">
            Асуултын төрөл
          </h3>
          <p className="text-[13px] text-[#6d7f9c] ml-2">
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
            <div className="rounded-[12px] border border-dashed border-[#d8e2f0] bg-[#f8fbff] p-4 text-[13px] text-[#6d7f9c]">
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
      className={`flex cursor-pointer items-start gap-4 rounded-[12px] border p-4 transition ${
        checked
          ? "border-[#d8e2f0] bg-[#eef6ff]"
          : "border-[#d8e2f0] bg-white hover:border-[#d8e2f0]"
      }`}
    >
      <span className="relative mt-0.5 inline-flex h-[25px] w-[25px] shrink-0 items-center justify-center">
        <input
          checked={checked}
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
          onChange={(event) => onCheckedChange(event.target.checked)}
          type="checkbox"
        />
        <span className="pointer-events-none inline-flex h-[25px] w-[25px] items-center justify-center rounded-[8px] border-[1px] border-[#4A4A4A] bg-white text-[#4A4A4A] transition peer-checked:[&_svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-[#9fbef5]/40">
          <Check
            className="h-3 w-3 opacity-0 transition-opacity"
            strokeWidth={3}
          />
        </span>
      </span>
      <div>
        <p className="text-[13px] font-semibold text-[#183153]">{label}</p>
        <p className="mt-1 text-[13px] leading-6 text-[#607391]">
          {description}
        </p>
      </div>
    </label>
  );
}
