"use client";

import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "./field";
import { inputClassName } from "../_lib/utils";
import type { ExamComposerState } from "../_lib/types";

export function ExamSettingsForm({
  exam,
  gradeOptions,
  subjectOptions,
  topicSuggestions,
  onUpdateExam,
}: {
  exam: ExamComposerState;
  gradeOptions: readonly string[];
  subjectOptions: string[];
  topicSuggestions: string[];
  onUpdateExam: <Key extends keyof ExamComposerState>(
    key: Key,
    value: ExamComposerState[Key],
  ) => void;
}) {
  return (
    <section className="p-4 sm:p-5">
      <div className="text-base font-medium uppercase tracking-[0.12em] text-[#122459] sm:text-[20px] sm:tracking-[0.18em]">
        Шалгалтын тохиргоо
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-x-4 lg:gap-y-4">
        <div className="min-w-0 sm:col-span-2 lg:col-span-4">
          <Field label="">
            <input
              className={`${inputClassName} h-10! w-full`}
              onChange={(event) => onUpdateExam("title", event.target.value)}
              placeholder="Шалгалтын гарчиг бичих"
              value={exam.title}
            />
          </Field>
        </div>

        <div className="min-w-0 lg:col-span-2">
          <Field label="">
            <Select
              onValueChange={(value) => onUpdateExam("grade", value)}
              value={exam.grade}
            >
              <SelectTrigger className={`${inputClassName} h-10! w-full`}>
                <SelectValue placeholder="Анги сонголт" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="min-w-0 sm:col-span-2 lg:col-span-2">
          <Field label="">
            <Select
              onValueChange={(value) => onUpdateExam("subject", value)}
              value={exam.subject}
            >
              <SelectTrigger className={`${inputClassName} h-10! w-full`}>
                <SelectValue placeholder="Хичээл сонголт" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="min-w-0 sm:col-span-2 lg:col-span-2">
          <div className="flex w-full flex-col justify-end">
            <Select
              onValueChange={(value) => onUpdateExam("topic", value)}
              value={exam.topic}
            >
              <SelectTrigger className={`${inputClassName} h-10! w-full`}>
                <SelectValue placeholder="Сэдэв сонголт" />
              </SelectTrigger>
              <SelectContent>
                {topicSuggestions.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="min-w-0 sm:col-span-2 lg:col-span-2">
          <Field label="">
            <div className="flex h-10 w-full items-center justify-center rounded-xl border border-[#7f7f7f] bg-white px-[11px]">
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Минут багасгах"
                  onClick={() =>
                    onUpdateExam(
                      "durationInMinutes",
                      Math.max(1, (exam.durationInMinutes || 40) - 1),
                    )
                  }
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#262626] pt-[1px] text-[12px] leading-none text-[#262626]"
                >
                  −
                </button>
                <button
                  type="button"
                  aria-label="Минут нэмэх"
                  onClick={() =>
                    onUpdateExam(
                      "durationInMinutes",
                      (exam.durationInMinutes || 40) + 1,
                    )
                  }
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#262626] pt-[1px] text-[12px] leading-none text-[#262626]"
                >
                  +
                </button>
                <input
                  className="w-10 bg-transparent text-right text-[12px] font-normal text-[#262626] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min={1}
                  onChange={(event) =>
                    onUpdateExam(
                      "durationInMinutes",
                      Number.isFinite(Number(event.target.value)) &&
                        Number(event.target.value) > 0
                        ? Number(event.target.value)
                        : 1,
                    )
                  }
                  type="number"
                  value={exam.durationInMinutes ?? 40}
                />
                <span className="text-[12px] font-medium text-[#60728f]">
                  мин
                </span>
              </div>
            </div>
          </Field>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#e5e5e5] bg-[#F5F5F5] p-3 sm:p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <span className="relative mt-1 inline-flex h-[25px] w-[25px] shrink-0 items-center justify-center">
            <input
              checked={exam.requiresSchoolApproval}
              className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
              onChange={(event) =>
                onUpdateExam("requiresSchoolApproval", event.target.checked)
              }
              type="checkbox"
            />
            <span className="pointer-events-none inline-flex h-[25px] w-[25px] items-center justify-center rounded-[8px] border border-[#4A4A4A] bg-white text-[#4A4A4A] transition peer-checked:[&_svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-[#9fbef5]/40">
              <Check
                className="h-4 w-4 opacity-0 transition-opacity"
                strokeWidth={3}
              />
            </span>
          </span>
          <div className="min-w-0">
            <p className="text-base font-medium text-[#122459] sm:text-[20px]">
              Сургуулийн зөвшөөрөл авах
            </p>
            <p className="mt-1 text-sm font-normal leading-relaxed text-[#737373] sm:text-[16px] sm:leading-6">
              Хэрэв энэ шалгалт сургуулийн талаас баталгаажих шаардлагатай бол
              хадгалах үед зөвшөөрлийн хүсэлт илгээгдэнэ.
            </p>
          </div>
        </label>
        {exam.requiresSchoolApproval ? (
          <div className="mt-3 border-t border-[#dbe5f0] pt-3">
            <p className="text-sm font-semibold text-[#122459] sm:text-[16px]">
              Батлуулах хуваарийн мэдээлэл
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="">
                <input
                  type="date"
                  className={`${inputClassName} h-10! w-full`}
                  onChange={(event) =>
                    onUpdateExam("approvalExamDate", event.target.value)
                  }
                  value={exam.approvalExamDate}
                />
              </Field>

              <Field label="">
                <input
                  className={`${inputClassName} h-10! w-full`}
                  onChange={(event) =>
                    onUpdateExam("approvalLocation", event.target.value)
                  }
                  placeholder="Өрөө / Байршил (ж: 203)"
                  value={exam.approvalLocation}
                />
              </Field>

              <Field label="">
                <input
                  type="time"
                  className={`${inputClassName} h-10! w-full !border-[#7f7f7f] !bg-white !text-[#122459] [accent-color:#29A4FF] [color-scheme:light] [&::-webkit-datetime-edit-fields-wrapper]:text-[#122459] focus:!border-[#7DC8FF] focus:!ring-4 focus:!ring-[#7DC8FF]/20`}
                  onChange={(event) =>
                    onUpdateExam("approvalStartTime", event.target.value)
                  }
                  value={exam.approvalStartTime}
                />
              </Field>

              <Field label="">
                <input
                  type="time"
                  className={`${inputClassName} h-10! w-full !border-[#7f7f7f] !bg-white !text-[#122459] [accent-color:#29A4FF] [color-scheme:light] [&::-webkit-datetime-edit-fields-wrapper]:text-[#122459] focus:!border-[#7DC8FF] focus:!ring-4 focus:!ring-[#7DC8FF]/20`}
                  onChange={(event) =>
                    onUpdateExam("approvalEndTime", event.target.value)
                  }
                  value={exam.approvalEndTime}
                />
              </Field>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
