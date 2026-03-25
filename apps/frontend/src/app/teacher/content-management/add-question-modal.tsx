import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { AlertTriangle, Eye, X } from "lucide-react";
import {
  DIFFICULTIES,
  QUESTION_STATUSES,
  QUESTION_TYPES,
  SKILL_TAGS,
  SUBJECTS,
} from "./types";
import type { NewQuestionInput, Question } from "./types";
import { difficultyLabel, subjectLabel, typeLabel } from "./utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: NewQuestionInput) => void;
  findSimilar: (text: string) => Question[];
};

const initialForm: NewQuestionInput = {
  title: "",
  content: "",
  type: "multiple_choice",
  subject: "Math",
  topic: "",
  gradeLevel: "10-р анги",
  difficulty: "Medium",
  skillTag: "Analysis",
  status: "Draft",
};

export function AddQuestionModal({ open, onClose, onSubmit, findSimilar }: Props) {
  const [form, setForm] = useState<NewQuestionInput>(initialForm);

  const duplicateCandidates = useMemo(
    () => findSimilar(`${form.title} ${form.content}`),
    [findSimilar, form.title, form.content],
  );

  if (!open) return null;

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.topic.trim()) return;
    onSubmit(form);
    setForm(initialForm);
  };

  const inputClass =
    "h-10 rounded-lg border border-[#d6e7ff] bg-white px-3 text-sm text-[#1F2A44] outline-none focus:border-[#4F9DFF] focus:ring-2 focus:ring-[#4F9DFF]/20";

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Хаах"
        className="absolute inset-0 bg-[#1F2A44]/40"
        onClick={onClose}
        type="button"
      />
      <div className="absolute left-1/2 top-1/2 max-h-[90vh] w-[96vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[#d6e7ff] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-3xl font-bold text-[#1F2A44]">Шинэ асуулт нэмэх</h3>
            <p className="mt-1 text-sm text-[#5d6e8c]">
              Асуултаа ангилж хадгалаад дараагийн шалгалтуудад дахин ашиглана.
            </p>
          </div>
          <button
            className="rounded-lg border border-[#d6e7ff] p-2 text-[#1F2A44]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={onFormSubmit}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              className={inputClass}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Асуултын гарчиг"
              value={form.title}
            />
            <input
              className={inputClass}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, topic: event.target.value }))
              }
              placeholder="Сэдэв"
              value={form.topic}
            />
          </div>

          <textarea
            className="min-h-28 w-full rounded-lg border border-[#d6e7ff] bg-white px-3 py-2 text-sm text-[#1F2A44] outline-none focus:border-[#4F9DFF] focus:ring-2 focus:ring-[#4F9DFF]/20"
            onChange={(event) =>
              setForm((prev) => ({ ...prev, content: event.target.value }))
            }
            placeholder="Асуултын бүрэн агуулга"
            value={form.content}
          />

          {duplicateCandidates.length > 0 ? (
            <div className="rounded-xl border border-[#FFD65A]/70 bg-[#FFD65A]/20 p-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#8f6b00]">
                <AlertTriangle className="h-4 w-4" />
                Төстэй асуулт илэрлээ
              </p>
              <div className="mt-2 space-y-2">
                {duplicateCandidates.map((item) => (
                  <div
                    className="rounded-lg border border-[#d6e7ff] bg-white px-3 py-2"
                    key={item.id}
                  >
                    <p className="text-sm font-semibold text-[#1F2A44]">{item.title}</p>
                    <p className="line-clamp-1 text-xs text-[#5d6e8c]">{item.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  className="rounded-lg bg-[#4F9DFF] px-3 py-1.5 text-xs font-semibold text-white"
                  type="submit"
                >
                  Ямар ч байсан нэмэх
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-lg border border-[#d6e7ff] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2A44]"
                  onClick={() => {}}
                  type="button"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Байгаа асуултыг харах
                </button>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <select
              className={inputClass}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  type: event.target.value as NewQuestionInput["type"],
                }))
              }
              value={form.type}
            >
              {QUESTION_TYPES.map((item) => (
                <option key={item} value={item}>
                  {typeLabel[item]}
                </option>
              ))}
            </select>

            <select
              className={inputClass}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  subject: event.target.value as NewQuestionInput["subject"],
                }))
              }
              value={form.subject}
            >
              {SUBJECTS.map((item) => (
                <option key={item} value={item}>
                  {subjectLabel[item]}
                </option>
              ))}
            </select>

            <input
              className={inputClass}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, gradeLevel: event.target.value }))
              }
              placeholder="Жишээ: 9-р анги"
              value={form.gradeLevel}
            />

            <select
              className={inputClass}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  difficulty: event.target.value as NewQuestionInput["difficulty"],
                }))
              }
              value={form.difficulty}
            >
              {DIFFICULTIES.map((item) => (
                <option key={item} value={item}>
                  {difficultyLabel[item]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <select
              className={inputClass}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  skillTag: event.target.value as NewQuestionInput["skillTag"],
                }))
              }
              value={form.skillTag}
            >
              {SKILL_TAGS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              className={inputClass}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as NewQuestionInput["status"],
                }))
              }
              value={form.status}
            >
              {QUESTION_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item === "Active"
                    ? "Идэвхтэй"
                    : item === "Draft"
                      ? "Ноорог"
                      : "Архивласан"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg border border-[#d6e7ff] px-4 py-2 text-sm font-semibold text-[#1F2A44]"
              onClick={onClose}
              type="button"
            >
              Болих
            </button>
            <button
              className="rounded-lg bg-[#4F9DFF] px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Асуулт хадгалах
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
