"use client";

import { ExamOutlineSection } from "./_components/exam-outline-section";
import { ExamSettingsForm } from "./_components/exam-settings-form";
import { SavedExamsSection } from "./_components/saved-exams-section";
import { TeacherExamSkeleton } from "./_components/teacher-exam-skeleton";
import { useTeacherExamPage } from "./_hooks/use-teacher-exam-page";

export default function TeacherExamPage() {
  const examPage = useTeacherExamPage();

  if (examPage.isPageLoading) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-5 px-3 pb-8 pt-1 sm:space-y-6 sm:px-4 sm:pt-0 md:px-5">
        <TeacherExamSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-5 px-3 pb-8 pt-1 sm:space-y-6 sm:px-4 sm:pt-0 md:px-5">
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

      <div className="grid gap-6">
        <ExamOutlineSection
          examQuestionDetails={examPage.examQuestionDetails}
          latestSavedExamId={examPage.latestSavedExamId}
          requiresSchoolApproval={examPage.exam.requiresSchoolApproval}
          totalPoints={examPage.totalPoints}
          onMoveQuestion={examPage.moveQuestion}
          onPersistExam={examPage.persistExam}
          onRemoveExamQuestion={examPage.removeExamQuestion}
        />

        <SavedExamsSection
          activeSavedExamId={examPage.activeSavedExamId}
          hasLoadedSavedExams={examPage.hasLoadedSavedExams}
          savedExams={examPage.savedExams}
          teacherClasses={examPage.teacherClasses}
          selectedClassByExamId={examPage.selectedClassByExamId}
          onDeleteSavedExam={examPage.deleteSavedExam}
          onOpenMonitoring={examPage.openMonitoringForSavedExam}
          onOpenSavedExam={examPage.openSavedExam}
          onSelectClass={examPage.selectClassForSavedExam}
          onSendSavedExam={examPage.sendSavedExamToClass}
        />
      </div>
    </div>
  );
}
