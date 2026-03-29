"use client";

import { CheckCircle2, FileUp, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionBuilderForm } from "./question-builder-form";
import { QuestionFilters } from "./question-filters";
import { QuestionHeader } from "./question-header";
import { QuestionList } from "./question-list";
import { useQuestionBank } from "../_hooks/use-question-bank";

const tabs = [
  { id: "global", label: "Улсын сан" },
  { id: "school", label: "Сургуулийн сан" },
] as const;

export function QuestionBankPage() {
  const {
    activeTab,
    clearFilters,
    closeBuilder,
    copyQuestionToSchool,
    currentFilters,
    deleteSchoolQuestion,
    editingValues,
    filteredQuestions,
    gradeOptions,
    isBuilderOpen,
    isSchoolTab,
    lastValidationErrors,
    openBulkImport,
    openCreateBuilder,
    openEditBuilder,
    publishSuccessDialogOpen,
    sendQuestionsToExam,
    setPublishSuccessDialogOpen,
    subjectOptions,
    submitQuestion,
    summary,
    switchTab,
    toastMessage,
    topicOptions,
    updateFilters,
  } = useQuestionBank();

  return (
    <div className="space-y-6 pb-10">
      <QuestionHeader
        globalCount={summary.globalCount}
        isSchoolTab={isSchoolTab}
        schoolCount={summary.schoolCount}
      />

      <section className="rounded-3xl border border-[#e7e9ee] bg-white p-2 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
        <div className="relative grid grid-cols-2 rounded-[18px] bg-[#f5f6f8] p-1">
          <div
            className={cn(
              "absolute inset-y-1 w-[calc(50%-4px)] rounded-[14px] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out",
              activeTab === "global" ? "translate-x-0" : "translate-x-full",
            )}
          />
          {tabs.map((tab) => (
            <button
              className={cn(
                "relative z-10 inline-flex h-11 items-center justify-center rounded-[14px] text-sm font-semibold transition-colors",
                activeTab === tab.id ? "text-[#111827]" : "text-[#6b7280] hover:text-[#111827]",
              )}
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {toastMessage ? (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#374151] shadow-sm">
          {toastMessage}
        </div>
      ) : null}

      <section
        className={cn(
          "rounded-[28px] border bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:px-6",
          isSchoolTab ? "border-[#efe6dc]" : "border-[#e3e8ef]",
        )}
      >
        {isSchoolTab ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4e8] text-[#a16207]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
                  Сургуулийн сан
                </h2>
                <p className="text-sm leading-6 text-[#6b7280]">
                  Засах, устгах, шалгалтанд ашиглах өөрийн асуултуудаа нэг дор удирдана.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#eadfce] bg-white px-4 text-sm font-medium text-[#7c5a36] transition hover:border-[#d6c2a4] hover:bg-[#fffaf5]"
                onClick={openBulkImport}
                type="button"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Bulk import
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] active:translate-y-px"
                onClick={openCreateBuilder}
                type="button"
              >
                + Асуулт нэмэх
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#355caa]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
                  Улсын сан
                </h2>
                <p className="text-sm leading-6 text-[#6b7280]">
                  Баталгаажсан, шууд шалгалтанд ашиглахад бэлэн асуултууд.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2 text-sm font-medium text-[#355caa]">
              <CheckCircle2 className="h-4 w-4" />
              Баталгаажсан сан
            </div>
          </div>
        )}
      </section>

      <QuestionFilters
        filters={currentFilters}
        gradeOptions={gradeOptions}
        onChange={updateFilters}
        onClear={clearFilters}
        subjectOptions={subjectOptions}
        tab={activeTab}
        topicOptions={topicOptions}
      />

      <div className="qb-fade-up" key={activeTab}>
        <QuestionList
          onAddToExam={(questionId) => sendQuestionsToExam([questionId])}
          onCopyToSchool={copyQuestionToSchool}
          onCreateQuestion={openCreateBuilder}
          onDeleteQuestion={deleteSchoolQuestion}
          onEditQuestion={openEditBuilder}
          questions={filteredQuestions}
          tab={activeTab}
        />
      </div>

      {isBuilderOpen ? (
        <QuestionBuilderForm
          initialValues={editingValues}
          key={editingValues?.id ?? "new-question"}
          onClose={closeBuilder}
          onSubmit={submitQuestion}
          subjectOptions={subjectOptions}
          validationErrors={lastValidationErrors}
        />
      ) : null}

      {publishSuccessDialogOpen ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#111827]/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[28px] border border-[#ebeef3] bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#111827]">
              Амжилттай нийтэллээ
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              Асуулт асуултын санд амжилттай нийтлэгдэж, шалгалтад ашиглахад бэлэн боллоо.
            </p>
            <button
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              onClick={() => setPublishSuccessDialogOpen(false)}
              type="button"
            >
              Ойлголоо
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
