import { X } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  DIFFICULTIES,
  QUESTION_STATUSES,
  QUESTION_TYPES,
  SKILL_TAGS,
  SUBJECTS,
} from "../types";
import type { NewQuestionInput } from "../types";
import {
  difficultyLabel,
  questionTypeLabel,
  skillLabel,
  statusLabel,
  subjectLabel,
} from "../utils/labels";

type AddQuestionModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: NewQuestionInput) => void;
};

const initialForm: NewQuestionInput = {
  title: "",
  content: "",
  type: "multiple_choice",
  subject: "Math",
  topic: "",
  gradeLevel: "9-р анги",
  difficulty: "Medium",
  skillTag: "Analysis",
  status: "Draft",
};

export function AddQuestionModal({ open, onClose, onSubmit }: AddQuestionModalProps) {
  const [form, setForm] = useState<NewQuestionInput>(initialForm);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.topic.trim()) return;
    onSubmit(form);
    setForm(initialForm);
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-slate-900/35"
        onClick={onClose}
        type="button"
      />

      <div className="absolute left-1/2 top-1/2 w-[96vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">Шинэ асуулт нэмэх</p>
            <p className="text-sm text-slate-500">Асуултаа үүсгэж, ангилж хадгална.</p>
          </div>
          <button className="rounded-md border border-slate-200 p-2" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Асуултын гарчиг"
              value={form.title}
            />
            <input
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
              placeholder="Сэдэв"
              value={form.topic}
            />
          </div>

          <textarea
            className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            placeholder="Асуултын агуулга"
            value={form.content}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <select
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, type: event.target.value as NewQuestionInput["type"] }))
              }
              value={form.type}
            >
              {QUESTION_TYPES.map((item) => (
                <option key={item} value={item}>
                  {questionTypeLabel[item]}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, subject: event.target.value as NewQuestionInput["subject"] }))
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
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, gradeLevel: event.target.value }))
              }
              placeholder="Жишээ: 10-р анги"
              value={form.gradeLevel}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <select
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, difficulty: event.target.value as NewQuestionInput["difficulty"] }))
              }
              value={form.difficulty}
            >
              {DIFFICULTIES.map((item) => (
                <option key={item} value={item}>
                  {difficultyLabel[item]}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, skillTag: event.target.value as NewQuestionInput["skillTag"] }))
              }
              value={form.skillTag}
            >
              {SKILL_TAGS.map((item) => (
                <option key={item} value={item}>
                  {skillLabel[item]}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value as NewQuestionInput["status"] }))
              }
              value={form.status}
            >
              {QUESTION_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {statusLabel[item]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
              onClick={onClose}
              type="button"
            >
              Болих
            </button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" type="submit">
              Хадгалах
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
