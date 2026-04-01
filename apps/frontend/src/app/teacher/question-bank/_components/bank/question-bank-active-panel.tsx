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
      <section className="min-h-[560px] w-[381px] rounded-[10px] border border-[#7DC8FF] bg-[#EDF6FF] px-[22px] py-[27px]" />
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
    <section className="min-h-[500px] w-[381px] rounded-[10px] border border-[#7DC8FF] bg-[#EDF6FF] px-[22px] py-[27px]">
      <p className="text-[14px] font-normal uppercase leading-[17px] text-[#7B7B7B]">
        АСУУЛТЫН ДЭЛГЭРЭНГҮЙ
      </p>

      <div className="mt-[16px] flex flex-wrap gap-x-[8px] gap-y-[5px]">
        <TinyChip tone="filled">Нэгтгэсэн</TinyChip>
        <TinyChip tone="outline">
          {question.questionType === "multiple_choice"
            ? "Сонгох асуулт"
            : "Автомат үнэлгээ"}
        </TinyChip>
        <TinyChip tone="outline">
          {difficultyLabelMap[question.difficulty]}
        </TinyChip>
      </div>

      <h3 className="mt-[18px] text-[16px] font-medium leading-[20px] text-[#323232]">
        {question.title || "Квадрат функцийн оройг олох"}
      </h3>
      <p className="mt-[10px] text-[12px] leading-[18px] text-[#7B7B7B]">
        {question.content.prompt}
      </p>

      <div className="mt-[18px] space-y-[10px]">
        {question.options.slice(0, 4).map((option, index) => (
          <div
            key={option.id}
            className={`flex h-[38px] items-center rounded-[6px] border px-[16px] text-[12px] leading-[15px] ${
              option.isCorrect
                ? "border-[#7DC8FF] bg-[#75B8ED] text-[#122459]"
                : "border-[#B8D9FF] bg-white text-[#122459]"
            }`}
          >
            <span className="mr-[12px] shrink-0">{index + 1}.</span>
            <span>{option.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-[18px] grid grid-cols-[1fr_auto] gap-x-[22px] gap-y-[12px] bg-[#EDF6FF] px-[20px] py-[18px]">
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
      className={`inline-flex h-[16px] items-center rounded-[5px] px-[14px] text-[8px] font-normal leading-[10px] ${
        tone === "filled"
          ? "bg-[#AED5FF] text-[#122459]"
          : "border border-[#7DC8FF] bg-white text-[#122459]"
      }`}
    >
      {children}
    </span>
  );
}
