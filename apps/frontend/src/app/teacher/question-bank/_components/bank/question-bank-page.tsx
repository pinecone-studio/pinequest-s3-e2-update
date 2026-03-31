"use client";

import { QuestionBuilderForm } from "../builder/question-builder-form";
import { QuestionBankActivePanel } from "./question-bank-active-panel";
import { QuestionBankBulkToolbar } from "./question-bank-bulk-toolbar";
import { QuestionBankEntryPanel } from "../entry/question-bank-entry-panel";
import { useQuestionBank } from "../../_hooks/use-question-bank";
import { useRouter } from "next/navigation";
import { QuestionBankMySection } from "./question-bank-my-section";
import { QuestionBankAllSection } from "./question-bank-all-section";
import { QuestionBankPublishSuccessDialog } from "./question-bank-publish-success-dialog";
import { useQuestionBank } from "../use-question-bank";

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
    entrySelection,
    activeQuestion,
    editingValues,
    filteredQuestions,
    gradeOptions,
    getQuestionHeartCount,
    hasEnteredBank,
    isBuilderOpen,
    lastValidationErrors,
    myQuestions,
    openCreateBuilder,
    openBulkImport,
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
    subjectItems,
  } = useQuestionBank(
    initialSubjectId && initialGrade
      ? { initialSubjectId, initialGrade }
      : undefined,
  );

  const resultQuestions =
    filteredQuestions.length > 0 ? filteredQuestions : myQuestions;
  const visibleQuestions = resultQuestions.slice(0, 3);
  const previewQuestion =
    activeQuestion ?? resultQuestions[0] ?? myQuestions[0] ?? null;
  const myQuestionCount = myQuestions.length;

  return (
    <div className="bg-[#fafafa] pb-[32px]">
      <div className="mx-auto max-w-[1184px] px-[18px] pt-[14px]">
        {!hasEnteredBank ? (
          <QuestionBankEntryPanel
            entryGrade={entrySelection.grade}
            entrySubjectId={entrySelection.subjectId}
            subjects={subjectItems}
            gradeOptions={gradeOptions}
            onEnter={() =>
              router.push(
                `/teacher/question-bank/${encodeURIComponent(
                  entrySelection.subjectId,
                )}/${encodeURIComponent(entrySelection.grade)}`,
              )
            }
            onGradeSelect={(value) => updateEntrySelection({ grade: value })}
            onSubjectSelect={(subjectId, name) =>
              updateEntrySelection({ subjectId, subject: name })
            }
          />
        ) : (
          <div className="space-y-[24px]">
            <QuestionBankFigmaHero
              onCreateQuestion={openCreateBuilder}
              totalQuestions={summary.systemCount}
            />
            <QuestionBankFigmaControls
              currentFilters={currentFilters}
              entryGrade={entrySelection.grade}
              entrySubject={entrySelection.subject}
              onClearFilters={clearFilters}
              onOpenBulkImport={openBulkImport}
              onResetSelection={() => {
                resetEntrySelection();
                router.push("/teacher/question-bank");
              }}
              onUpdateFilters={updateFilters}
              topicOptions={topicOptions}
            />

            {toastMessage ? (
              <div className="rounded-[10px] border border-[#e7ebf1] bg-white px-[12px] py-[8px] text-[11px] font-medium text-[#4b5563]">
                {toastMessage}
              </div>
            ) : null}

            {selectedQuestionIds.length > 0 ? (
              <QuestionBankBulkToolbar
                count={selectedQuestionIds.length}
                onClear={clearQuestionSelection}
                onSendToExam={() => sendQuestionsToExam(selectedQuestionIds)}
              />
            ) : null}

            <QuestionBankFigmaResults
              activeQuestionId={activeQuestion?.id ?? null}
              getQuestionHeartCount={getQuestionHeartCount}
              myQuestionCount={myQuestionCount}
              onAddToExam={(questionId) => sendQuestionsToExam([questionId])}
              onEditQuestion={openEditBuilder}
              onOpenQuestion={setActiveQuestionId}
              onToggleLike={toggleQuestionLike}
              onToggleSelection={toggleQuestionSelection}
              previewQuestion={previewQuestion}
              questions={visibleQuestions}
              selectedQuestionIds={selectedQuestionIds}
            />
          </div>
        )}
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

      <QuestionBankPublishSuccessDialog
        onClose={() => setPublishSuccessDialogOpen(false)}
        open={publishSuccessDialogOpen}
      />
    </div>
  );
}
