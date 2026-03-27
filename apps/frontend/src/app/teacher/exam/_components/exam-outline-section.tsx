"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  GripVertical,
  Save,
  Trash2,
} from "lucide-react";
import type { ExamQuestionDetail, ExamStatus } from "../_lib/types";

export function ExamOutlineSection({
  examQuestionDetails,
  totalPoints,
  onMoveQuestion,
  onPersistExam,
  onRemoveExamQuestion,
  onUpdateAssignedPoints,
}: {
  examQuestionDetails: ExamQuestionDetail[];
  totalPoints: number;
  onMoveQuestion: (examQuestionId: string, direction: "up" | "down") => void;
  onPersistExam: (status: ExamStatus) => void;
  onRemoveExamQuestion: (examQuestionId: string) => void;
  onUpdateAssignedPoints: (
    examQuestionId: string,
    assignedPoints: number,
  ) => void;
}) {
  return (
    <section className="rounded-[28px] border border-[#cfe0fb] bg-[#eef6ff] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[#ecf1f7] pb-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#74839b]">
            <GripVertical className="h-4 w-4" />
            Шалгалтын бүтэц
          </div>
          <h2 className="mt-2 text-2xl font-bold text-[#183153]">
            Сонгосон асуултууд
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-[#183153]">
            {examQuestionDetails.length} асуулт
          </p>
          <p className="text-sm text-[#5f7394]">{totalPoints} нийт оноо</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {examQuestionDetails.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#c6d9f8] bg-[#f4f9ff] px-5 py-8 text-center">
            <p className="text-lg font-semibold text-[#183153]">
              Шалгалтад асуулт хараахан нэмэгдээгүй байна
            </p>
            <p className="mt-2 text-sm text-[#60728f]">
              Асуултын сангаас сонгоод энд нэмснээр шалгалтын эцсийн дарааллыг
              бүрдүүлнэ.
            </p>
          </div>
        ) : null}

        {examQuestionDetails.map((item, index) => (
          <article
            className="rounded-3xl border border-[#d2e1f7] bg-[#f8fbff] p-4"
            key={item.examQuestionId}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f1ff] text-sm font-bold text-[#1f6feb]">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#3b5a8f]">
                    {item.question.grade}
                  </span>
                  <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#2f66b9]">
                    {item.question.topic}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-[#183153]">
                  {item.question.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#566983]">
                  {item.question.content.prompt}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 text-sm font-medium text-[#365077]">
                Оноо
                <input
                  className="h-11 w-24 rounded-2xl border border-[#d3deef] bg-white px-4 text-sm text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10"
                  min={1}
                  onChange={(event) =>
                    onUpdateAssignedPoints(
                      item.examQuestionId,
                      Number(event.target.value),
                    )
                  }
                  type="number"
                  value={item.assignedPoints}
                />
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <OutlineButton
                  icon={<ArrowUp className="mr-2 h-4 w-4" />}
                  label="Дээш"
                  onClick={() => onMoveQuestion(item.examQuestionId, "up")}
                />
                <OutlineButton
                  icon={<ArrowDown className="mr-2 h-4 w-4" />}
                  label="Доош"
                  onClick={() => onMoveQuestion(item.examQuestionId, "down")}
                />
                <OutlineButton
                  danger
                  icon={<Trash2 className="mr-2 h-4 w-4" />}
                  label="Хасах"
                  onClick={() => onRemoveExamQuestion(item.examQuestionId)}
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-3 border-t border-[#ecf1f7] pt-5 sm:grid-cols-2">
        <button
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d7e2f1] bg-white px-4 text-sm font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
          onClick={() => onPersistExam("draft")}
          type="button"
        >
          <Save className="mr-2 h-4 w-4" />
          Шалгалт хадгалах
        </button>
        <button
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#1f6feb] px-4 text-sm font-semibold text-white transition hover:bg-[#195fcc]"
          onClick={() => onPersistExam("published")}
          type="button"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Шалгалт нийтлэх
        </button>
      </div>
    </section>
  );
}

function OutlineButton({
  danger = false,
  icon,
  label,
  onClick,
}: {
  danger?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex h-10 items-center rounded-xl border px-3 text-sm font-semibold transition ${danger ? "border-[#f0d0d0] bg-[#fff5f5] text-[#c95050] hover:bg-[#ffeaea]" : "border-[#d7e2f1] text-[#365077] hover:border-[#aac8f8] hover:text-[#1f6feb]"}`}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}
