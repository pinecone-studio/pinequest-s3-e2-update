"use client";

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
    openCreateBuilder,
    openEditBuilder,
    reuseQuestions,
    reuseTarget,
    selectedQuestionIds,
    setActiveQuestionId,
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
    </div>
  );
}
