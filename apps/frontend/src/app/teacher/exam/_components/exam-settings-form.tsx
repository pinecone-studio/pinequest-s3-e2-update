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
    <section className="rounded-[28px] border border-[#d7e6fb] bg-[#f7fbff] p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#74839b]">
          Шалгалтын тохиргоо
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <Field label="Шалгалтын гарчиг">
          <input
            className={inputClassName}
            onChange={(event) => onUpdateExam("title", event.target.value)}
            placeholder="10-р ангийн алгебрын шалгалт"
            value={exam.title}
          />
        </Field>

        <Field label="Анги">
          <Select
            onValueChange={(value) => onUpdateExam("grade", value)}
            value={exam.grade}
          >
            <SelectTrigger className={inputClassName}>
              <SelectValue placeholder="Анги сонгох" />
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

        <Field label="Хичээл">
          <input
            className={inputClassName}
            list="exam-subject-options"
            onChange={(event) => onUpdateExam("subject", event.target.value)}
            value={exam.subject}
          />
          <datalist id="exam-subject-options">
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject} />
            ))}
          </datalist>
        </Field>

        <Field label="Сэдэв">
          <input
            className={inputClassName}
            list="exam-topic-options"
            onChange={(event) => onUpdateExam("topic", event.target.value)}
            value={exam.topic}
          />
          <datalist id="exam-topic-options">
            {topicSuggestions.map((topic) => (
              <option key={topic} value={topic} />
            ))}
          </datalist>
        </Field>

        <Field label="Үргэлжлэх хугацаа">
          <div className="relative">
            <input
              className={`${inputClassName} pr-16`}
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
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#60728f]">
              мин
            </span>
          </div>
        </Field>
      </div>

      <div className="mt-4 rounded-3xl border border-[#d7e6fb] bg-white/80 p-4">
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
            <p className="text-sm font-semibold text-[#183153]">
              Сургуулийн зөвшөөрөл авах
            </p>
            <p className="mt-1 text-sm leading-6 text-[#60728f]">
              Хэрэв энэ шалгалт сургуулийн талаас баталгаажих шаардлагатай бол
              хадгалах үед зөвшөөрлийн хүсэлт илгээгдэнэ.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
}
