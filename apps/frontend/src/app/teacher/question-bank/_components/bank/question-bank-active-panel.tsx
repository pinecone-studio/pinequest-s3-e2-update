"use client";

import type { Question, QuestionDifficulty } from "../../_lib/types";

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
      <section className="min-h-[510px] w-[381px] rounded-[12px] border border-[#7DC8FF] bg-[#EDF6FF] px-[18px] py-[18px]" />
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

  return (
    <section className="min-h-[510px] w-[381px] rounded-[12px] border border-[#7DC8FF] bg-[#EDF6FF] px-[18px] py-[18px]">
      <p className="text-[12px] font-normal uppercase leading-[15px] text-[#7B7B7B]">
        АСУУЛТЫН ДЭЛГЭРЭНГҮЙ
      </p>

      <div className="mt-[12px] flex flex-wrap gap-x-[6px] gap-y-[6px]">
        <TinyChip tone="filled">Нэгтгэсэн</TinyChip>
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
        {question.title || "Квадрат функцийн оройг олох"}
      </h3>
      <p className="mt-[8px] text-[12px] leading-[18px] text-[#7B7B7B]">
        {question.content.prompt}
      </p>

      <div className="mt-[14px] space-y-[8px]">
        {question.options.slice(0, 4).map((option, index) => (
          <div
            key={option.id}
            className={`flex h-[28px] items-center rounded-[4px] border px-[12px] text-[12px] leading-[15px] ${
              option.isCorrect
                ? "border-[#7DC8FF] bg-[#75B8ED] text-[#122459]"
                : "border-[#B8D9FF] bg-white text-[#122459]"
            }`}
          >
            <span className="mr-[10px] shrink-0 text-[11px]">{index + 1}.</span>
            <span className="truncate text-[11px]">{option.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-[14px] grid grid-cols-[1fr_auto] gap-x-[18px] gap-y-[10px] bg-[#DCEEFF] px-[12px] py-[12px]">
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
      className={`inline-flex h-[20px] items-center rounded-[4px] px-[10px] text-[11px] font-normal leading-[13px] ${
        tone === "filled"
          ? "bg-[#AED5FF] text-[#122459]"
          : "border border-[#7DC8FF] bg-white text-[#122459]"
      }`}
    >
      {children}
    </span>
  );
}
