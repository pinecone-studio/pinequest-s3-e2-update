"use client";

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
    <section className="p-5">
      <div className="text-[20px] font-medium uppercase tracking-[0.18em] text-[#122459]">
        Шалгалтын тохиргоо
      </div>

      <div className="mt-4 flex items-end gap-4">
        <div className="flex-2">
          <Field label="">
            <input
              className={`${inputClassName} h-10! w-full`}
              onChange={(event) => onUpdateExam("title", event.target.value)}
              placeholder="Шалгалтын гарчиг бичих"
              value={exam.title}
            />
          </Field>
        </div>

        <div className="flex-1">
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

        <div className="flex-[1.5]">
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

        <div className="flex-[1.5]">
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

        <div className="flex-[0.8]">
          <Field label="">
            <div className="flex h-10 w-full items-center justify-center rounded-xl border border-[#7f7f7f] bg-white px-3">
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
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#262626] text-[12px] leading-none text-[#262626]"
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
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#262626] text-[12px] leading-none text-[#262626]"
                >
                  +
                </button>
                <input
                  className="w-7 bg-transparent text-right text-[12px] font-normal text-[#262626] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

      <div className="mt-4 rounded-xl border border-[#e5e5e5] bg-[#F5F5F5] p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            checked={exam.requiresSchoolApproval}
            className="mt-1 h-4 w-4 rounded border-[#bfd3f4] text-[#1f6feb] focus:ring-[#1f6feb]/20"
            onChange={(event) =>
              onUpdateExam("requiresSchoolApproval", event.target.checked)
            }
            type="checkbox"
          />
          <div>
            <p className="text-[20px] font-medium text-[#122459]">
              Сургуулийн зөвшөөрөл авах
            </p>
            <p className="mt-1 text-[16px] font-normal leading-6 text-[#737373]">
              Хэрэв энэ шалгалт сургуулийн талаас баталгаажих шаардлагатай бол
              хадгалах үед зөвшөөрлийн хүсэлт илгээгдэнэ.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
}
