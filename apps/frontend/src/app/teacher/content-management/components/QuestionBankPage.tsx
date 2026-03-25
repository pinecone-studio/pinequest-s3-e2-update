"use client";

import { FileUp, Plus, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AddQuestionModal } from "./AddQuestionModal";
import { FilterBar } from "./FilterBar";
import { QuestionCard } from "./QuestionCard";
import { QuestionPreviewDrawer } from "./QuestionPreviewDrawer";
import { SearchBar } from "./SearchBar";
import { SortDropdown } from "./SortDropdown";
import { StatsCards } from "./StatsCards";
import { mockQuestions } from "../data/mockQuestions";
import type { NewQuestionInput, Question, QuestionFilters, SortOption } from "../types";
import {
  calculateInsights,
  filterQuestions,
  initialFilters,
  isWeakQuestion,
  sortQuestions,
} from "../utils/questionBank";

type ToastState = {
  message: string;
  tone: "success" | "info";
};

export function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState<QuestionFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>("most_used");
  const [previewQuestionId, setPreviewQuestionId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const gradeLevels = useMemo(
    () => [...new Set(questions.map((q) => q.gradeLevel))].sort(),
    [questions],
  );

  const filteredQuestions = useMemo(
    () => filterQuestions(questions, searchKeyword, filters),
    [questions, searchKeyword, filters],
  );

  const sortedQuestions = useMemo(
    () => sortQuestions(filteredQuestions, sortBy),
    [filteredQuestions, sortBy],
  );

  const insights = useMemo(() => calculateInsights(questions), [questions]);

  const previewQuestion = useMemo(
    () => questions.find((item) => item.id === previewQuestionId) ?? null,
    [questions, previewQuestionId],
  );

  const showToast = (payload: ToastState) => {
    setToast(payload);
    setTimeout(() => setToast(null), 2200);
  };

  const handleFilterChange = <K extends keyof QuestionFilters>(
    key: K,
    value: QuestionFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleArchive = (id: string) => {
    setQuestions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Archived", lastUsedAt: "2026-03-25" } : item,
      ),
    );
    showToast({ message: "Асуултыг архивлалаа", tone: "info" });
  };

  const handleAddQuestion = (payload: NewQuestionInput) => {
    const newQuestion: Question = {
      id: `q-${String(Date.now()).slice(-6)}`,
      ...payload,
      usageCount: 0,
      correctRate: 0,
      createdBy: "Одоогийн багш",
      lastUsedAt: "2026-03-25",
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    setAddModalOpen(false);
    showToast({ message: "Шинэ асуулт амжилттай нэмэгдлээ", tone: "success" });
  };

  const allSelected =
    sortedQuestions.length > 0 && sortedQuestions.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(sortedQuestions.map((item) => item.id));
  };

  return (
    <section className="px-5 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Ухаалаг Асуултын Сан</h1>
              <p className="mt-1 text-sm text-slate-600">
                Асуултыг хадгалах, ангилах, хайх, дахин ашиглах ажлыг ухаалгаар хийнэ
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                type="button"
              >
                <FileUp className="h-4 w-4" /> Асуулт импортлох
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setAddModalOpen(true)}
                type="button"
              >
                <Plus className="h-4 w-4" /> Асуулт нэмэх
              </button>
            </div>
          </div>
        </header>

        <StatsCards
          activeQuestions={insights.activeQuestions}
          averageCorrectRate={insights.avgCorrectRate}
          questionsNeedingReview={insights.questionsNeedingReview}
          totalQuestions={insights.totalQuestions}
        />

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <SearchBar onChange={setSearchKeyword} value={searchKeyword} />
            <SortDropdown onChange={setSortBy} value={sortBy} />
          </div>

          <FilterBar
            filters={filters}
            gradeLevels={gradeLevels}
            onChange={handleFilterChange}
            onReset={() => setFilters(initialFilters)}
          />
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <input
                checked={allSelected}
                onChange={(event) => toggleSelectAll(event.target.checked)}
                type="checkbox"
              />
              <p className="text-sm text-slate-700">Олон сонголт (дараагийн хувилбар)</p>
            </div>
            <button
              className="rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
              onClick={() => showToast({ message: "Олон асуулт нэмэх боломж удахгүй нэмэгдэнэ", tone: "info" })}
              type="button"
            >
              Сонгосныг шалгалтад нэмэх ({selectedIds.length})
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-base font-semibold text-slate-700">Асуултын сан хоосон байна.</p>
              <p className="mt-1 text-sm text-slate-500">Эхний асуултаа нэмээд эхлээрэй.</p>
            </div>
          ) : sortedQuestions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-base font-semibold text-slate-700">Илэрц олдсонгүй.</p>
              <p className="mt-1 text-sm text-slate-500">
                Шүүлтүүр эсвэл хайлтын түлхүүр үгээ өөрчилж үзнэ үү.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sortedQuestions.map((item) => (
                <QuestionCard
                  isSelected={selectedIds.includes(item.id)}
                  isWeak={isWeakQuestion(item)}
                  key={item.id}
                  onAddToExam={() =>
                    showToast({ message: `“${item.title}” асуултыг шалгалтын ноорогт нэмлээ`, tone: "success" })
                  }
                  onArchive={() => handleArchive(item.id)}
                  onEdit={() =>
                    showToast({ message: `“${item.title}” засварлах урсгал туршилтын горимд байна`, tone: "info" })
                  }
                  onPreview={() => setPreviewQuestionId(item.id)}
                  onSelect={(checked) => {
                    setSelectedIds((prev) =>
                      checked ? [...prev, item.id] : prev.filter((id) => id !== item.id),
                    );
                  }}
                  question={item}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <QuestionPreviewDrawer
        isWeak={previewQuestion ? isWeakQuestion(previewQuestion) : false}
        onClose={() => setPreviewQuestionId(null)}
        open={Boolean(previewQuestion)}
        question={previewQuestion}
      />

      <AddQuestionModal
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddQuestion}
        open={addModalOpen}
      />

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
            toast.tone === "success" ? "bg-emerald-600" : "bg-slate-800"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
