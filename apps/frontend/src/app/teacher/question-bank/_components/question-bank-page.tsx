"use client";

import { CheckCircle2 } from "lucide-react";
import { QuestionBuilderForm } from "./question-builder-form";
import { QuestionFilters } from "./question-filters";
import { QuestionHeader } from "./question-header";
import { QuestionList } from "./question-list";
import { QuestionPreviewPanel } from "./question-preview-panel";
import { ReuseToolbar } from "./reuse-toolbar";
import { useQuestionBank } from "../_hooks/use-question-bank";

export function QuestionBankPage() {
  const {
    activeQuestion,
    clearFilters,
    closeBuilder,
    editingValues,
    filters,
    filteredQuestions,
    gradeOptions,
    isBuilderOpen,
    lastValidationErrors,
    publishSuccessDialogOpen,
    openCreateBuilder,
    openEditBuilder,
    reuseQuestions,
    reuseTarget,
    selectedQuestionIds,
    setActiveQuestionId,
    setPublishSuccessDialogOpen,
    setReuseTarget,
    subtopicOptions,
    subjectOptions,
    submitQuestion,
    summary,
    toastMessage,
    toggleQuestionSelection,
    toggleVisibleSelection,
    updateFilters,
  } = useQuestionBank();

  return (
    <div className="space-y-6 pb-8">
      <QuestionHeader
        draft={summary.draft}
        manual={summary.manual}
        onCreateQuestion={openCreateBuilder}
        published={summary.published}
        total={summary.total}
      />

      {toastMessage ? (
        <div className="rounded-2xl border border-[#cfe0fb] bg-[#eef6ff] px-4 py-3 text-sm font-medium text-[#2f66b9]">
          {toastMessage}
        </div>
      ) : null}

      <QuestionFilters
        filters={filters}
        gradeOptions={gradeOptions}
        onChange={updateFilters}
        onClear={clearFilters}
        subjectOptions={subjectOptions}
        subtopicOptions={subtopicOptions}
      />

      <ReuseToolbar
        onReuseSelected={() => reuseQuestions(selectedQuestionIds)}
        onReuseTargetChange={setReuseTarget}
        onSelectAllVisible={toggleVisibleSelection}
        reuseTarget={reuseTarget}
        selectedCount={selectedQuestionIds.length}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_420px]">
        <QuestionList
          activeQuestionId={activeQuestion?.id ?? null}
          onCreateQuestion={openCreateBuilder}
          onEditQuestion={openEditBuilder}
          onOpenQuestion={setActiveQuestionId}
          onReuseQuestion={(questionId) => reuseQuestions([questionId])}
          onSelectQuestion={toggleQuestionSelection}
          questions={filteredQuestions}
          selectedQuestionIds={selectedQuestionIds}
        />
        <div className="xl:sticky xl:top-24 xl:self-start">
          <QuestionPreviewPanel question={activeQuestion} />
        </div>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#10233e]/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[28px] border border-[#d9e4f1] bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4ff] text-[#1f6feb]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-[#183153]">
              Амжилттай нийтэллээ
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#5f7394]">
              Асуулт асуултын санд амжилттай нийтлэгдэж, шалгалтад ашиглахад бэлэн боллоо.
            </p>
            <button
              className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#1f6feb] px-5 text-sm font-semibold text-white transition hover:bg-[#195fcc]"
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
