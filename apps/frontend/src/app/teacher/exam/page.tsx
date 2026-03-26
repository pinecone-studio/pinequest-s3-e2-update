"use client";

import { ExamOutlineSection } from "./_components/exam-outline-section";
import { ExamSettingsForm } from "./_components/exam-settings-form";
import { QuestionBankSection } from "./_components/question-bank-section";
import { SavedExamsSection } from "./_components/saved-exams-section";
import { useTeacherExamPage } from "./_hooks/use-teacher-exam-page";

export default function TeacherExamPage() {
  const examPage = useTeacherExamPage();

  return (
    <div className="space-y-6 pb-8">
      {examPage.toastMessage ? (
        <div className="rounded-2xl border border-[#cfe0fb] bg-[#eef6ff] px-4 py-3 text-sm font-medium text-[#2f66b9]">
          {examPage.toastMessage}
        </div>
      ) : null}

      <ExamSettingsForm
        exam={examPage.exam}
        gradeOptions={examPage.gradeOptions}
        subjectOptions={examPage.subjectOptions}
        topicSuggestions={examPage.topicSuggestions}
        onUpdateExam={examPage.updateExam}
      />

      <SavedExamsSection
        activeSavedExamId={examPage.activeSavedExamId}
        hasLoadedSavedExams={examPage.hasLoadedSavedExams}
        savedExams={examPage.savedExams}
        selectedClassByExamId={examPage.selectedClassByExamId}
        onDeleteSavedExam={examPage.deleteSavedExam}
        onOpenSavedExam={examPage.openSavedExam}
        onSelectClass={examPage.selectClassForSavedExam}
        onSendSavedExam={examPage.sendSavedExamToClass}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <QuestionBankSection
          exam={examPage.exam}
          examQuestions={examPage.examQuestions}
          filteredQuestions={examPage.filteredQuestions}
          search={examPage.search}
          selectedBankIds={examPage.selectedBankIds}
          onAddQuestions={examPage.addQuestionsToExam}
          onSearchChange={examPage.setSearch}
          onToggleSelectQuestion={examPage.toggleSelectQuestion}
        />

        <ExamOutlineSection
          examQuestionDetails={examPage.examQuestionDetails}
          totalPoints={examPage.totalPoints}
          onMoveQuestion={examPage.moveQuestion}
          onPersistExam={examPage.persistExam}
          onRemoveExamQuestion={examPage.removeExamQuestion}
          onUpdateAssignedPoints={examPage.updateAssignedPoints}
        />
      </div>
    </div>
  );
}
