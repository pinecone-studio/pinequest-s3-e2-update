"use client";

import { QuestionBuilderForm } from "./question-builder-form";
import { QuestionBankActivePanel } from "./question-bank-active-panel";
import { QuestionBankBulkToolbar } from "./question-bank-bulk-toolbar";
import { QuestionBankEntryPanel } from "./question-bank-entry-panel";
import { useQuestionBank } from "../_hooks/use-question-bank";
import { useRouter } from "next/navigation";
import { QuestionBankMySection } from "./question-bank-my-section";
import { QuestionBankAllSection } from "./question-bank-all-section";
import { QuestionBankPublishSuccessDialog } from "./question-bank-publish-success-dialog";

export function QuestionBankPage({
  initialSubjectId = "",
  initialGrade = "",
}: {
  initialSubjectId?: string;
  initialGrade?: string;
} = {}) {
  const router = useRouter();
  const {
    clearFilters,
    closeBuilder,
    currentFilters,
    deleteQuestion,
    entrySelection,
    activeQuestion,
    editingValues,
    filteredQuestions,
    gradeOptions,
    getQuestionHeartCount,
    hasEnteredBank,
    isBuilderOpen,
    lastValidationErrors,
    likedQuestionIds,
    myQuestions,
    openBulkImport,
    openCreateBuilder,
    openEditBuilder,
    publishSuccessDialogOpen,
    resetEntrySelection,
    sendQuestionsToExam,
    selectedQuestionIds,
    setPublishSuccessDialogOpen,
    subjectOptions,
    submitQuestion,
    summary,
    setActiveQuestionId,
    toastMessage,
    toggleQuestionSelection,
    toggleQuestionLike,
    topicOptions,
    updateEntrySelection,
    updateFilters,
    clearQuestionSelection,
  } = useQuestionBank(
    initialSubjectId && initialGrade
      ? { initialSubjectId, initialGrade }
      : undefined,
  );

  return (
    <div className="bg-[#fafafa] pb-10">
      <div className="mx-auto max-w-[1184px] px-6 pt-[28px]">
        {!hasEnteredBank ? (
          <QuestionBankEntryPanel
            entryGrade={entrySelection.grade}
            entrySubjectId={entrySelection.subjectId}
            gradeOptions={gradeOptions}
            onEnter={() =>
              router.push(
                `/teacher/question-bank/${encodeURIComponent(entrySelection.subjectId)}/${encodeURIComponent(entrySelection.grade)}`,
              )
            }
            onGradeSelect={(value) => updateEntrySelection({ grade: value })}
            onSubjectSelect={(subjectId, name) =>
              updateEntrySelection({ subjectId, subject: name })
            }
          />
        ) : (
          <QuestionBankActivePanel
            currentFilters={currentFilters}
            entryGrade={entrySelection.grade}
            entrySubject={entrySelection.subject}
            gradeOptions={gradeOptions}
            onChangeFilters={updateFilters}
            onClearFilters={clearFilters}
            onCreateQuestion={openCreateBuilder}
            onOpenBulkImport={openBulkImport}
            onResetSelection={() => {
              resetEntrySelection();
              router.push("/teacher/question-bank");
            }}
            selectedScopeCount={summary.selectedScopeCount}
            subjectOptions={subjectOptions}
            topicOptions={topicOptions}
          />
        )}
      </div>

      {toastMessage ? (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#374151] shadow-sm">
          {toastMessage}
        </div>
      ) : null}

      {hasEnteredBank ? (
        <>
          <QuestionBankBulkToolbar
            count={selectedQuestionIds.length}
            onClear={clearQuestionSelection}
            onSendToExam={() => sendQuestionsToExam(selectedQuestionIds)}
          />

          <QuestionBankMySection
            activeQuestionId={activeQuestion?.id ?? null}
            getQuestionHeartCount={getQuestionHeartCount}
            likedQuestionIds={likedQuestionIds}
            myQuestionCount={summary.myQuestionCount}
            myQuestions={myQuestions}
            onAddToExam={(questionId) => sendQuestionsToExam([questionId])}
            onCreateQuestion={openCreateBuilder}
            onDeleteQuestion={deleteQuestion}
            onEditQuestion={openEditBuilder}
            onOpenQuestion={setActiveQuestionId}
            onToggleQuestionSelection={toggleQuestionSelection}
            onToggleLike={toggleQuestionLike}
            selectedQuestionIds={selectedQuestionIds}
          />

          <QuestionBankAllSection
            activeQuestion={activeQuestion}
            activeQuestionId={activeQuestion?.id ?? null}
            filteredQuestions={filteredQuestions}
            getQuestionHeartCount={getQuestionHeartCount}
            likedQuestionIds={likedQuestionIds}
            onAddToExam={(questionId) => sendQuestionsToExam([questionId])}
            onCreateQuestion={openCreateBuilder}
            onDeleteQuestion={deleteQuestion}
            onEditQuestion={openEditBuilder}
            onOpenQuestion={setActiveQuestionId}
            onToggleQuestionSelection={toggleQuestionSelection}
            onToggleLike={toggleQuestionLike}
            selectedQuestionIds={selectedQuestionIds}
          />
        </>
      ) : null}

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

      <QuestionBankPublishSuccessDialog
        onClose={() => setPublishSuccessDialogOpen(false)}
        open={publishSuccessDialogOpen}
      />
    </div>
  );
}
