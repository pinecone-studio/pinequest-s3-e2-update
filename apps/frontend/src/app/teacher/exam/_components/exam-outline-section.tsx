"use client";

import {
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  STATUS_LABELS,
} from "../../question-bank/_lib/utils";
import type { ExamQuestionDetail } from "../_lib/types";
import { UpIcon } from "@/app/_icons/upIcon";
import { DownIcon } from "@/app/_icons/downIcon";
import { TrashIcon } from "@/app/_icons/trashIcon";

export function ExamOutlineSection({
  examQuestionDetails,
  requiresSchoolApproval,
  totalPoints,
  onMoveQuestion,
  onPersistExam,
  onRemoveExamQuestion,
}: {
  examQuestionDetails: ExamQuestionDetail[];
  requiresSchoolApproval: boolean;
  totalPoints: number;
  onMoveQuestion: (examQuestionId: string, direction: "up" | "down") => void;
  onPersistExam: () => void;
  onRemoveExamQuestion: (examQuestionId: string) => void;
}) {
  return (
    <section className="mx-5 rounded-[12px] border border-[#d1d5db] bg-[#f3f4f6] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 pb-4">
        <div>
          <div className="text-[20px] font-medium uppercase tracking-[0.14em] text-[#122459]">
            Шалгалтын бүтэц
          </div>
          <p className="mt-1 text-[16px] font-normal text-[#737373]">
            Сонгосон асуултууд
          </p>
        </div>
        <div className="text-right">
          <p className="text-[20px] font-medium text-[#122459]">
            {examQuestionDetails.length} асуулт
          </p>
          {examQuestionDetails.length > 0 ? (
            <p className="text-sm text-[#5f7394]">{totalPoints} нийт оноо</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {examQuestionDetails.length === 0 ? (
          <div className="h-29.75 rounded-[12px] border border-dashed border-[#404040] px-5 py-8 text-center">
            <p className="text-[20px] font-medium tracking-[0.04em] text-[#122459]">
              Шалгалтад асуулт хараахан нэмэгдээгүй байна
            </p>
            <p className="mt-3 text-[16px] font-normal text-[#262626]">
              Асуултын сангаас сонгоод энд нэмснээр шалгалтын эцсийн дарааллыг
              бүрдүүлнэ.
            </p>
          </div>
        ) : null}

        {examQuestionDetails.map((item, index) => (
          <article
            className="rounded-[12px] border border-[#a7adb8] bg-white p-5"
            key={item.examQuestionId}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex min-w-8 items-center justify-center rounded-md border border-[#475569] px-2 py-0.5 text-xs font-medium text-[#0f172a]">
                    {index + 1}
                  </span>
                  <Badge>{STATUS_LABELS[item.question.status]}</Badge>
                  <Badge>{QUESTION_TYPE_LABELS[item.question.questionType]}</Badge>
                  <Badge>{DIFFICULTY_LABELS[item.question.difficulty]}</Badge>
                </div>
                <h3 className="mt-5 text-[19px] font-semibold text-[#2d2d2d]">
                  {item.question.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[#707070]">
                  {item.question.content.prompt}
                </p>
              </div>
              <div className="flex gap-7.5">
                <div className="flex flex-wrap items-center gap-2 lg:justify-end ">
                  <OutlineButton
                    icon={<UpIcon />}
                    label="Дээш"
                    onClick={() => onMoveQuestion(item.examQuestionId, "up")}
                  />
                  <OutlineButton
                    icon={<DownIcon />}
                    label="Доош"
                    onClick={() => onMoveQuestion(item.examQuestionId, "down")}
                  />
                </div>
                <div>
                  <OutlineButton
                    danger
                    icon={<TrashIcon />}
                    label="Хасах"
                    onClick={() => onRemoveExamQuestion(item.examQuestionId)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <div className="inline-flex h-7.5 min-w-16.25 items-center justify-center gap-2 rounded-[12px] border border-[#adadad] bg-white px-4">
                <span className="text-[12px] font-medium text-[#262626]">
                  {item.assignedPoints}
                </span>
                <span className="text-[12px] font-medium text-[#a5a5a5]">
                  оноо
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {examQuestionDetails.length > 0 ? (
        <div className="mt-5 flex justify-end pt-4">
          <button
            className="inline-flex items-center justify-center rounded-[12px] bg-[#29A4FF] px-6 py-3 text-[12px] font-medium text-[#EDF6FF] transition hover:bg-[#29A4FF]"
            onClick={onPersistExam}
            type="button"
          >
            {requiresSchoolApproval
              ? "Хадгалж, зөвшөөрөл хүсэх"
              : "Шалгалтад хадгалах"}
          </button>
        </div>
      ) : null}
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
      className={`inline-flex h-8 items-center gap-2 rounded-[12px] border px-3 text-[12px] font-medium transition ${danger ? "border-[#F2ADAC] bg-white text-[#F2ADAC] hover:bg-[#fff5f5]" : "border-[#a7adb8] bg-white text-[#444] hover:bg-[#f8fbff]"}`}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-[#d7ebff] px-3 py-1 text-xs font-medium text-[#355389]">
      {children}
    </span>
  );
}
