"use client";

import type { QuestionType } from "../_lib/types";

export function QuestionTypeSelector({
  value,
  onChange,
}: {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
}) {
  const selectedMode =
    value === "multiple_choice" ? "multiple_choice" : "long_answer";

  const options = [
    {
      value: "multiple_choice" as const,
      label: "Сонгох",
      description: "Хариултын сонголтуудтай, автоматаар шалгана.",
    },
    {
      value: "long_answer" as const,
      label: "Задгай",
      description: "Чөлөөт хариулт, тайлбар, рубрикт суурилна.",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {options.map((option) => {
        const isActive = option.value === selectedMode;
        return (
          <button
            className={`rounded-2xl border p-4 text-left transition ${
              isActive
                ? "border-[#6caeff] bg-[#eef6ff] shadow-sm"
                : "border-[#d8e2f0] bg-white hover:border-[#a9c8f6]"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <p className="text-sm font-semibold text-[#183153]">{option.label}</p>
            <p className="mt-1 text-sm leading-6 text-[#607391]">{option.description}</p>
          </button>
        );
      })}
    </div>
  );
}
