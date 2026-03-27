"use client";

import {
  BookOpen,
  CheckCircle2,
  CirclePlus,
  Filter,
  Search,
} from "lucide-react";
import {
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
} from "../../question-bank/_lib/utils";
import type { Question } from "../../question-bank/_lib/types";
import type { ExamComposerState, ExamQuestionItem } from "../_lib/types";
import { inputClassName } from "../_lib/utils";

export function QuestionBankSection({
  exam,
  examQuestions,
  filteredQuestions,
  search,
  selectedBankIds,
  onAddQuestions,
  onSearchChange,
  onToggleSelectQuestion,
}: {
  exam: ExamComposerState;
  examQuestions: ExamQuestionItem[];
  filteredQuestions: Question[];
  search: string;
  selectedBankIds: string[];
  onAddQuestions: (questionIds: string[]) => void;
  onSearchChange: (value: string) => void;
  onToggleSelectQuestion: (questionId: string) => void;
}) {
  return (
    <section className="rounded-[28px] border border-[#d7e6fb] bg-[#f6faff] p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#ecf1f7] pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#74839b]">
            <BookOpen className="h-4 w-4" />
            Асуултын сан
          </div>
          <h2 className="mt-2 text-l font-bold text-[#183153]">
            Хамгийн тохирох асуултууд эхэндээ
          </h2>
          <p className="mt-2 text-sm text-[#5f7394]">
            <span className="font-semibold">{exam.grade || "дурын анги"}</span>,{" "}
            <span className="font-semibold">
              {exam.subject || "дурын хичээл"}
            </span>
            ,{" "}
            <span className="font-semibold">{exam.topic || "дурын сэдэв"}</span>
            -тэй таарах асуултууд дээгүүр эрэмбэлэгдэнэ.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block min-w-60">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8291aa]" />
            <input
              className={`${inputClassName} pl-11`}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Гарчиг, агуулга, сэдвээр хайх..."
              value={search}
            />
          </label>
          <button
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#1f6feb] px-4 text-sm font-semibold text-white transition hover:bg-[#195fcc]"
            onClick={() => onAddQuestions(selectedBankIds)}
            type="button"
          >
            <CirclePlus className="mr-2 h-4 w-4" />
            Нэмэх
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {filteredQuestions.map((question, index) => (
          <QuestionBankCard
            alreadyAdded={examQuestions.some(
              (item) => item.questionId === question.id,
            )}
            exam={exam}
            index={index}
            key={question.id}
            question={question}
            selected={selectedBankIds.includes(question.id)}
            onAdd={() => onAddQuestions([question.id])}
            onSelect={() => onToggleSelectQuestion(question.id)}
          />
        ))}
      </div>
    </section>
  );
}

function QuestionBankCard({
  alreadyAdded,
  exam,
  index,
  question,
  selected,
  onAdd,
  onSelect,
}: {
  alreadyAdded: boolean;
  exam: ExamComposerState;
  index: number;
  question: Question;
  selected: boolean;
  onAdd: () => void;
  onSelect: () => void;
}) {
  const exactMatch =
    question.grade.toLowerCase() === exam.grade.toLowerCase() &&
    question.subject.toLowerCase() === exam.subject.toLowerCase() &&
    question.topic.toLowerCase() === exam.topic.toLowerCase();

  return (
    <article
      className={`rounded-3xl border p-5 transition ${exactMatch ? "border-[#9fc8ff] bg-[#eaf4ff] shadow-[0_14px_30px_rgba(79,157,255,0.10)]" : "border-[#d8e2f0] bg-[#fafdff] hover:border-[#aac8f8]"}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {exactMatch ? (
              <span className="rounded-full bg-[#deeeff] px-3 py-1 text-xs font-semibold text-[#2f66b9]">
                Хамгийн тохиромжтой
              </span>
            ) : null}
            <Badge>{question.grade}</Badge>
            <Badge tone="subject">{question.subject}</Badge>
            <Badge tone="topic">{question.topic}</Badge>
            <Badge tone="difficulty">
              {DIFFICULTY_LABELS[question.difficulty]}
            </Badge>
            <Badge tone="neutral">
              {QUESTION_TYPE_LABELS[question.questionType]}
            </Badge>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-[#183153]">
            {index + 1}. {question.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-[#4f6483]">
            {question.content.prompt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#667792]">
            <span>{question.points} үндсэн оноо</span>
            <span>{question.usageCount} удаа ашигласан</span>
            <span>
              {question.status === "published" ? "Нийтэлсэн" : "Ноорог"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
          <button
            className={`inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition ${selected ? "border-[#1f6feb] bg-[#eef6ff] text-[#1f6feb]" : "border-[#d7e2f1] bg-white text-[#365077] hover:border-[#aac8f8] hover:text-[#1f6feb]"}`}
            onClick={onSelect}
            type="button"
          >
            {selected ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <Filter className="mr-2 h-4 w-4" />
            )}
            {selected ? "Сонгосон" : "Сонгох"}
          </button>
          <button
            className={`inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold text-white transition ${alreadyAdded ? "bg-[#90a4c2]" : "bg-[#1f6feb] hover:bg-[#195fcc]"}`}
            disabled={alreadyAdded}
            onClick={onAdd}
            type="button"
          >
            <CirclePlus className="mr-2 h-4 w-4" />
            {alreadyAdded ? "Шалгалтад орсон" : "Шалгалтад нэмэх"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Badge({
  children,
  tone = "grade",
}: {
  children: React.ReactNode;
  tone?: "grade" | "subject" | "topic" | "difficulty" | "neutral";
}) {
  const styles =
    tone === "subject"
      ? "bg-[#f8f1ff] text-[#7047a9]"
      : tone === "topic"
        ? "bg-[#eef6ff] text-[#2f66b9]"
        : tone === "difficulty"
          ? "bg-[#fff6e7] text-[#9a6423]"
          : tone === "neutral"
            ? "bg-[#f1f5f9] text-[#48617f]"
            : "bg-[#eef4ff] text-[#3b5a8f]";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {children}
    </span>
  );
}
