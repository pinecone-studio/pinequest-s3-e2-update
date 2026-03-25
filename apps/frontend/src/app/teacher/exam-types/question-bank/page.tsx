"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, PlusCircle } from "lucide-react";
import {
  DIFFICULTIES,
  QUESTION_STATUSES,
  QUESTION_TYPES,
  SKILL_TAGS,
  SUBJECTS,
} from "../shared/types";
import type { QuestionFilters, SortOption } from "../shared/types";
import { useExamFlow } from "../shared/store";
import {
  defaultFilters,
  filterQuestions,
  hasDuplicatePattern,
  qualityOf,
  questionTypeLabel,
  sortQuestions,
} from "../shared/utils";

export default function QuestionBankPage() {
  const { questions, examDraft, toggleQuestion } = useExamFlow();
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<QuestionFilters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>("most_used");

  const filtered = useMemo(
    () => sortQuestions(filterQuestions(questions, keyword, filters), sortBy),
    [questions, keyword, filters, sortBy],
  );

  const selectedCount = examDraft.selectedQuestionIds.length;

  const setFilter = <K extends keyof QuestionFilters>(key: K, value: QuestionFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-6 font-extrabold text-[#1f2a44]">Асуултын сан</h2>
            <p className="text-3 text-[#5c6f91]">
              Хайлт, шүүлтүүр, чанарын дохиогоор багшийн сонголтыг ухаалаг болгоно.
            </p>
          </div>
          <div className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] px-3 py-2 text-3 font-semibold text-[#335c96]">
            Шалгалтад сонгосон: {selectedCount}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 xl:grid-cols-[1.2fr_180px]">
          <input
            className="h-10 rounded-xl border border-[#d9e6fb] bg-[#f7fbff] px-3 text-3 text-[#1f2a44] outline-none focus:border-[#4f9dff]"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Асуултын гарчиг, сэдэв, агуулгаар хайх..."
            value={keyword}
          />
          <select
            className="h-10 rounded-xl border border-[#d9e6fb] bg-white px-3 text-3 text-[#1f2a44]"
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            value={sortBy}
          >
            <option value="most_used">Их ашигласнаар</option>
            <option value="least_used">Бага ашигласнаар</option>
            <option value="highest_correct">Өндөр зөв хувиар</option>
            <option value="lowest_correct">Бага зөв хувиар</option>
            <option value="newest">Шинээр</option>
            <option value="oldest">Хуучнаар</option>
          </select>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-5">
          <select
            className="h-10 rounded-xl border border-[#d9e6fb] bg-white px-3 text-3"
            onChange={(e) => setFilter("subject", e.target.value as QuestionFilters["subject"])}
            value={filters.subject}
          >
            <option>Бүгд</option>
            {SUBJECTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            className="h-10 rounded-xl border border-[#d9e6fb] bg-white px-3 text-3"
            onChange={(e) => setFilter("type", e.target.value as QuestionFilters["type"])}
            value={filters.type}
          >
            <option>Бүгд</option>
            {QUESTION_TYPES.map((item) => (
              <option key={item} value={item}>
                {questionTypeLabel[item]}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-xl border border-[#d9e6fb] bg-white px-3 text-3"
            onChange={(e) =>
              setFilter("difficulty", e.target.value as QuestionFilters["difficulty"])
            }
            value={filters.difficulty}
          >
            <option>Бүгд</option>
            {DIFFICULTIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            className="h-10 rounded-xl border border-[#d9e6fb] bg-white px-3 text-3"
            onChange={(e) => setFilter("status", e.target.value as QuestionFilters["status"])}
            value={filters.status}
          >
            <option>Бүгд</option>
            {QUESTION_STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            className="h-10 rounded-xl border border-[#d9e6fb] bg-white px-3 text-3"
            onChange={(e) => setFilter("skillTag", e.target.value as QuestionFilters["skillTag"])}
            value={filters.skillTag}
          >
            <option>Бүгд</option>
            {SKILL_TAGS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9e6fb] bg-white p-10 text-center text-3 text-[#5c6f91]">
          Тохирох асуулт олдсонгүй.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((question) => {
            const quality = qualityOf(question);
            const selected = examDraft.selectedQuestionIds.includes(question.id);
            const hasDuplicate = hasDuplicatePattern(question, filtered);
            const qualityTone =
              quality.tone === "danger"
                ? "bg-[#ff6b6b]/12 text-[#b94949] border-[#ff6b6b]/35"
                : quality.tone === "warning"
                  ? "bg-[#ffd65a]/30 text-[#8f6b00] border-[#ffd65a]/50"
                  : "bg-[#34c759]/12 text-[#16763a] border-[#34c759]/30";

            return (
              <article
                className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm"
                key={question.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-5 font-bold text-[#1f2a44]">{question.title}</p>
                    <p className="mt-1 text-3 text-[#5c6f91]">{question.content}</p>
                  </div>
                  <button
                    className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-3 font-semibold ${
                      selected
                        ? "border-[#34c759] bg-[#34c759]/15 text-[#1d8a43]"
                        : "border-[#4f9dff] bg-[#4f9dff] text-white"
                    }`}
                    onClick={() => toggleQuestion(question.id)}
                    type="button"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {selected ? "Сонгосон" : "Шалгалтад сонгох"}
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-3">
                  <span className="rounded-full bg-[#edf5ff] px-2 py-1 text-[#2e5f9a]">
                    {question.subject}
                  </span>
                  <span className="rounded-full bg-[#f5f1ff] px-2 py-1 text-[#6542a8]">
                    {questionTypeLabel[question.type]}
                  </span>
                  <span className="rounded-full bg-[#edf8f0] px-2 py-1 text-[#26754d]">
                    {question.difficulty}
                  </span>
                  <span className="rounded-full bg-[#f4f7fb] px-2 py-1 text-[#495d7f]">
                    {question.skillTag}
                  </span>
                  <span className={`rounded-full border px-2 py-1 ${qualityTone}`}>
                    {quality.label}
                  </span>
                  {hasDuplicate && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#ffd65a]/60 bg-[#ffd65a]/30 px-2 py-1 text-[#8f6b00]">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Төстэй асуулт байж магадгүй
                    </span>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                  <div className="rounded-lg bg-[#f7fbff] p-2">
                    <p className="text-2 text-[#7083a5]">Сэдэв</p>
                    <p className="text-3 font-semibold text-[#1f2a44]">{question.topic}</p>
                  </div>
                  <div className="rounded-lg bg-[#f7fbff] p-2">
                    <p className="text-2 text-[#7083a5]">Анги</p>
                    <p className="text-3 font-semibold text-[#1f2a44]">{question.gradeLevel}</p>
                  </div>
                  <div className="rounded-lg bg-[#f7fbff] p-2">
                    <p className="text-2 text-[#7083a5]">Ашигласан</p>
                    <p className="text-3 font-semibold text-[#1f2a44]">{question.usageCount}</p>
                  </div>
                  <div className="rounded-lg bg-[#f7fbff] p-2">
                    <p className="text-2 text-[#7083a5]">Зөв хувь</p>
                    <p className="text-3 font-semibold text-[#1f2a44]">{question.correctRate}%</p>
                  </div>
                </div>

                {quality.tone === "danger" ? (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#ff6b6b]/12 px-3 py-2 text-3 text-[#b94949]">
                    <CheckCircle2 className="h-4 w-4" />
                    {quality.details}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
