"use client";

import type { Question, QuestionDifficulty } from "../../_lib/types";
import { resolveQuestionTitle } from "../../_lib/utils";

const difficultyLabelMap: Record<QuestionDifficulty, string> = {
  easy: "Хялбар",
  medium: "Дунд зэрэг",
  hard: "Хэцүү",
};

type QuestionBankActivePanelProps = {
  question: Question | null;
};

export function QuestionBankActivePanel({
  question,
}: QuestionBankActivePanelProps) {
  if (!question) {
    return (
      <section className="min-h-[510px] w-[381px] rounded-[10px] border border-[#9ED0FF] bg-white px-[18px] py-[18px]" />
    );
  }

  const metaItems = [
    ["Сургууль", "21"],
    ["Багш", question.teacherName ?? "Ц.Цэвээнжав"],
    ["Анги", question.grade],
    ["Хичээл", question.subject],
    ["Сэдэв", question.subtopic?.trim() || question.topic],
    ["Оноо", `${question.points}`],
    ["Ашигласан тоо", `${question.usageCount}`],
    ["Шинэчлэсэн", question.updatedAt],
  ];
  const promptLines = splitPromptLines(question.content.prompt);

  return (
    <section className="min-h-[510px] w-[381px] rounded-[10px] border border-[#9ED0FF] bg-white px-[18px] py-[18px]">
      <p className="text-[12px] font-normal uppercase leading-[15px] text-[#7B7B7B]">
        АСУУЛТЫН ДЭЛГЭРЭНГҮЙ
      </p>

      <div className="mt-[12px] flex flex-wrap gap-x-[10px] gap-y-[10px]">
        <TinyChip>
          {question.questionType === "multiple_choice"
            ? "Сонгох асуулт"
            : "Задгай"}
        </TinyChip>
        <TinyChip>
          {question.gradingType === "auto" ? "Автомат үнэлгээ" : "Гар үнэлгээ"}
        </TinyChip>
        <TinyChip>{difficultyLabelMap[question.difficulty]}</TinyChip>
      </div>

      <h3 className="mt-[22px] text-[18px] font-semibold leading-[22px] text-[#323232]">
        {resolveQuestionTitle(question.title, question.content.prompt) ||
          "Квадрат функцийн оройг олох"}
      </h3>
      <div className="mt-[16px] space-y-[2px] text-[14px] leading-[20px] text-[#0A0A0A]">
        {promptLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="mt-[14px] space-y-[8px]">
        {question.options.slice(0, 4).map((option, index) => (
          <div
            key={option.id}
            className={`flex h-[28px] items-center rounded-[3px] border px-[12px] text-[12px] leading-[15px] ${
              option.isCorrect
                ? "border-[#7DC8FF] bg-[#75B8ED] text-[#122459]"
                : "border-[#ECECEC] bg-white text-[#122459]"
            }`}
          >
            <span className="mr-[10px] shrink-0 text-[11px]">{index + 1}.</span>
            <span className="truncate text-[11px]">
              {stripLeadingNumber(option.text)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[14px] grid grid-cols-[1fr_auto] gap-x-[18px] gap-y-[10px] bg-white px-[12px] py-[12px]">
        {metaItems.map(([label, value]) => (
          <div key={label} className="contents">
            <span className="text-[12px] leading-[15px] text-[#262626]">
              {label}
            </span>
            <span className="text-[12px] leading-[15px] text-[#262626]">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TinyChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[26px] items-center rounded-[8px] border border-[#ECECEC] bg-white px-[16px] text-[12px] font-normal leading-[14px] text-[#0A0A0A]">
      {children}
    </span>
  );
}

function stripLeadingNumber(value: string) {
  return value.replace(/^\s*\d+\.\s*/, "");
}

function splitPromptLines(prompt: string) {
  const normalized = prompt.trim();
  if (!normalized) return [];

  const explicitLines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (explicitLines.length > 1) return explicitLines;

  const splitIndex = normalized.search(/\s(?=[A-ZА-ЯӨҮЁ])/);
  if (splitIndex > 0) {
    const first = normalized.slice(0, splitIndex).trim();
    const second = normalized.slice(splitIndex + 1).trim();
    if (first && second) return [first, second];
  }

  return [normalized];
}
