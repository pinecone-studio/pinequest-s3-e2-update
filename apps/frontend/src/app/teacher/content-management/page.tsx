"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Sparkles, X } from "lucide-react";
import { StatsCards } from "./stats-cards";
import { FilterBar } from "./filter-bar";
import { QuestionList } from "./question-list";
import { QuestionPreviewDrawer } from "./preview-drawer";
import { AddQuestionModal } from "./add-question-modal";
import { SortDropdown } from "./sort-dropdown";
import { SearchBar } from "./search-bar";
import { mockQuestions } from "./mock-questions";
import type {
  NewQuestionInput,
  Question,
  QuestionFilters,
  SortOption,
  ToastState,
} from "./types";
import {
  calculateStats,
  detectQuestionQuality,
  filterQuestions,
  findDuplicateCandidates,
  getInitialFilters,
  sortQuestions,
} from "./utils";

export default function ExamOptimizationPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<QuestionFilters>(getInitialFilters());
  const [sortBy, setSortBy] = useState<SortOption>("most_used");
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  const gradeLevels = useMemo(
    () => [...new Set(questions.map((q) => q.gradeLevel))].sort(),
    [questions],
  );

  const filteredQuestions = useMemo(
    () => filterQuestions(questions, keyword, filters),
    [questions, keyword, filters],
  );

  const sortedQuestions = useMemo(
    () => sortQuestions(filteredQuestions, sortBy),
    [filteredQuestions, sortBy],
  );

  const stats = useMemo(() => calculateStats(questions), [questions]);
  const allSelected =
    sortedQuestions.length > 0 &&
    sortedQuestions.every((item) => selectedIds.includes(item.id));

  const showToast = (payload: ToastState) => {
    setToast(payload);
    setTimeout(() => setToast(null), 2200);
  };

  const onFilterChange = <K extends keyof QuestionFilters>(
    key: K,
    value: QuestionFilters[K],
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const onResetFilters = () => {
    setFilters(getInitialFilters());
    setKeyword("");
  };

  const onArchive = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: "Archived", lastUsedAt: "2026-03-25" }
          : q,
      ),
    );
    showToast({ tone: "info", message: "Асуултыг архивт шилжүүллээ." });
  };

  const onAddQuestion = (payload: NewQuestionInput) => {
    const created: Question = {
      id: `q-${Date.now()}`,
      ...payload,
      gradeLevel: payload.gradeLevel.trim() || "10-р анги",
      usageCount: 0,
      correctRate: 0,
      createdBy: "Одоогийн багш",
      lastUsedAt: "2026-03-25",
    };

    setQuestions((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    showToast({ tone: "success", message: "Шинэ асуулт амжилттай нэмэгдлээ." });
  };

  const exportFilteredQuestionsToWord = () => {
    if (sortedQuestions.length === 0) {
      showToast({
        tone: "info",
        message: "Татах асуулт алга. Эхлээд шүүлтүүрээ өөрчилнө үү.",
      });
      return;
    }

    const rows = sortedQuestions
      .map(
        (q, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(q.title)}</td>
            <td>${escapeHtml(q.content)}</td>
            <td>${escapeHtml(q.topic)}</td>
            <td>${escapeHtml(q.gradeLevel)}</td>
            <td>${q.usageCount}</td>
            <td>${q.correctRate}%</td>
          </tr>
        `,
      )
      .join("");

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8" />
          <title>Шүүгдсэн асуултын тайлан</title>
          <style>
            body { font-family: Arial, sans-serif; color: #1F2A44; }
            h1 { font-size: 20px; margin-bottom: 8px; }
            p { font-size: 12px; color: #52607a; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #d6e7ff; padding: 8px; font-size: 12px; vertical-align: top; }
            th { background: #f6faff; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Шүүгдсэн асуултын жагсаалт</h1>
          <p>Нийт: ${sortedQuestions.length} асуулт</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Гарчиг</th>
                <th>Агуулга</th>
                <th>Сэдэв</th>
                <th>Анги</th>
                <th>Ашигласан</th>
                <th>Зөв хувь</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", html], {
      type: "application/msword;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `asuult-shuultuur-${new Date()
      .toISOString()
      .slice(0, 10)}.doc`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    showToast({
      tone: "success",
      message: `Шүүгдсэн ${sortedQuestions.length} асуултыг Word файл болгож татлаа.`,
    });
  };

  return (
    <section className="min-h-screen bg-[#F6FAFF] px-4 py-6 text-3 md:px-7 lg:px-10 [&_*]:!text-3">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="rounded-3xl border border-[#d6e7ff] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#1F2A44] md:text-3xl">
                Ухаалаг Асуултын Сан
              </h1>
              <p className=" max-w-3xl text-base text-[#5d6e8c] md:text-sm">
                Асуултыг хадгалах, зохион байгуулах, хайх, дахин ашиглах ажлыг
                илүү ухаалгаар удирдана.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-[#d6e7ff] bg-white px-4 py-2 text-sm font-semibold text-[#1F2A44] transition hover:bg-[#F6FAFF]"
                onClick={exportFilteredQuestionsToWord}
                type="button"
              >
                <Download className="h-4 w-4" />
                Шүүгдсэн асуулт Word татах
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-[#4F9DFF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#328af8]"
                onClick={() => setIsAddModalOpen(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Асуулт нэмэх
              </button>
            </div>
          </div>
        </header>

        <StatsCards stats={stats} />

        <div className="rounded-3xl border border-[#d6e7ff] bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full xl:max-w-[560px]">
              <SearchBar onChange={setKeyword} value={keyword} />
            </div>
            <SortDropdown onChange={setSortBy} value={sortBy} />
          </div>
          <div className="mt-3">
            <FilterBar
              filters={filters}
              gradeLevels={gradeLevels}
              onChange={onFilterChange}
              onReset={onResetFilters}
            />
          </div>
        </div>

        <QuestionList
          onArchive={onArchive}
          onSelectAll={(checked) =>
            setSelectedIds(checked ? sortedQuestions.map((q) => q.id) : [])
          }
          onToggleSelect={(id, checked) =>
            setSelectedIds((prev) =>
              checked ? [...prev, id] : prev.filter((item) => item !== id),
            )
          }
          onTryBulkAdd={() =>
            showToast({
              tone: "info",
              message:
                "Олон асуултыг шалгалтад нэмэх боломж удахгүй нэмэгдэнэ.",
            })
          }
          questions={sortedQuestions}
          totalCount={questions.length}
          selectedIds={selectedIds}
          showActionToast={showToast}
          qualityFn={detectQuestionQuality}
          allSelected={allSelected}
          onPreview={setPreviewQuestion}
        />
      </div>

      <QuestionPreviewDrawer
        onClose={() => setPreviewQuestion(null)}
        open={Boolean(previewQuestion)}
        question={previewQuestion}
      />

      <AddQuestionModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={onAddQuestion}
        findSimilar={(text) => findDuplicateCandidates(questions, text)}
      />

      {toast ? (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-white shadow-xl ${
            toast.tone === "success" ? "bg-[#34C759]" : "bg-[#1F2A44]"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
