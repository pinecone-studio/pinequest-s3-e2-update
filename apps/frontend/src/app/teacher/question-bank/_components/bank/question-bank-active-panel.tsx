"use client";

import { NATIONAL_SCRIPT_SUBJECT } from "../../_lib/constants";
import type { Question, QuestionDifficulty } from "../../_lib/types";
import {
  hasTraditionalMongolianText,
  resolveQuestionTitle,
} from "../../_lib/utils";

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
  const isNationalScript = question.subject === NATIONAL_SCRIPT_SUBJECT;
  const shouldRenderPromptVertical =
    isNationalScript && hasTraditionalMongolianText(question.content.prompt);

  return (
    <section className="min-h-[510px] w-[381px] rounded-[10px] border border-[#9ED0FF] bg-white px-[18px] py-[18px]">
      <p className="text-[12px] font-normal uppercase leading-[15px] text-[#7B7B7B]">
        АСУУЛТЫН ДЭЛГЭРЭНГҮЙ
      </p>

      <div className="mt-[12px] flex flex-wrap gap-x-[10px] gap-y-[10px]">
        <TinyChip tone="outline">
          {question.questionType === "multiple_choice"
            ? "Сонгох асуулт"
            : "Задгай"}
        </TinyChip>
        <TinyChip tone="outline">
          {question.gradingType === "auto" ? "Автомат үнэлгээ" : "Гар үнэлгээ"}
        </TinyChip>
        <TinyChip tone="outline">{difficultyLabelMap[question.difficulty]}</TinyChip>
      </div>

      <h3 className="mt-[14px] text-[15px] font-medium leading-[19px] text-[#323232]">
        {resolveQuestionTitle(question.title, question.content.prompt) ||
          "Квадрат функцийн оройг олох"}
      </h3>
      <p
        className={`mt-[8px] text-[12px] text-[#7B7B7B] ${
          shouldRenderPromptVertical
            ? "min-h-32 overflow-x-auto leading-8"
            : "leading-[18px]"
        }`}
        style={
          shouldRenderPromptVertical
            ? {
                writingMode: "vertical-lr",
                textOrientation: "mixed",
                whiteSpace: "pre-wrap",
              }
            : undefined
        }
      >
        {question.content.prompt}
      </p>

      <div className="mt-[14px] space-y-[8px]">
        {question.options.slice(0, 4).map((option, index) => (
          <div
            key={option.id}
            className={`rounded-[4px] border px-[12px] text-[12px] ${
              option.isCorrect
                ? "border-[#7DC8FF] bg-[#75B8ED] text-[#122459]"
                : "border-[#ECECEC] bg-white text-[#122459]"
            }`}
          >
            <div
              className={`flex ${
                isNationalScript
                  ? "min-h-24 items-start gap-[10px] py-[10px]"
                  : "h-[28px] items-center"
              }`}
            >
              <span className="shrink-0 text-[11px]">{index + 1}.</span>
              <span
              className={`text-[11px] ${
                  isNationalScript && hasTraditionalMongolianText(option.text)
                    ? "overflow-x-auto leading-7"
                    : "truncate"
                }`}
                style={
                  isNationalScript && hasTraditionalMongolianText(option.text)
                    ? {
                        writingMode: "vertical-lr",
                        textOrientation: "mixed",
                        whiteSpace: "pre-wrap",
                      }
                    : undefined
                }
              >
                {option.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[14px] grid grid-cols-[1fr_auto] gap-x-[18px] gap-y-[10px] bg-white px-[12px] py-[12px]">
        {metaItems.map(([label, value]) => (
          <div key={label} className="contents">
            <span className="text-[12px] leading-[15px] text-[#23407D]">
              {label}
            </span>
            <span className="text-[12px] leading-[15px] text-[#23407D]">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TinyChip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "filled" | "outline";
}) {
  return (
    <span
      className={`inline-flex h-[26px] items-center rounded-[8px] px-[16px] text-[12px] font-normal leading-[14px] ${
        tone === "filled"
          ? "border border-[#ECECEC] bg-white text-[#0A0A0A]"
          : "border border-[#ECECEC] bg-white text-[#0A0A0A]"
      }`}
    >
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
