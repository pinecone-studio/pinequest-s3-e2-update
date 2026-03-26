"use client";

import type { QuestionType } from "../_lib/types";
import { QUESTION_TYPE_LABELS } from "../_lib/utils";

const TYPE_DESCRIPTIONS: Record<QuestionType, string> = {
  multiple_choice: "Дахин ашиглах боломжтой сонголтуудтай, автоматаар үнэлэгдэнэ.",
  short_answer: "Товч мэдлэг шалгалт болон түлхүүр үгийн хариултад тохиромжтой.",
  long_answer: "Рубриктэй, гараар үнэлэх дэлгэрэнгүй хариулт.",
  formula_input: "Математик, шинжлэх ухааны тэмдэглэгээ оруулах боломжтой.",
  image_based: "Зураг, диаграмм, дүрслэлтэй асуултад ашиглана.",
  file_upload: "Бодлого, эсээ, файл хавсаргуулж авахад ашиглана.",
};

export function QuestionTypeSelector({
  value,
  onChange,
}: {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((type) => {
        const isActive = type === value;
        return (
          <button
            className={`rounded-2xl border p-4 text-left transition ${
              isActive
                ? "border-[#6caeff] bg-[#eef6ff] shadow-sm"
                : "border-[#d8e2f0] bg-white hover:border-[#a9c8f6]"
            }`}
            key={type}
            onClick={() => onChange(type)}
            type="button"
          >
            <p className="text-sm font-semibold text-[#183153]">{QUESTION_TYPE_LABELS[type]}</p>
            <p className="mt-1 text-sm leading-6 text-[#607391]">{TYPE_DESCRIPTIONS[type]}</p>
          </button>
        );
      })}
    </div>
  );
}
