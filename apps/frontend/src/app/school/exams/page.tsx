/** @format */

"use client";

import { ExamLifecycleSummary } from "./_components/ExamLifecycleSummary";
import { ExamScheduleCalendarSection } from "./_components/ExamScheduleCalendarSection";
import { ExamTableSection } from "./_components/ExamTableSection";
import {
  getExamLifecycleSummary,
  schoolExams,
} from "./_mock/school-exams";

export default function SchoolExamsPage() {
  const lifecycleSummaryWithoutDraft = getExamLifecycleSummary(schoolExams).filter(
    (item) => item.status !== "draft"
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <ExamLifecycleSummary summary={lifecycleSummaryWithoutDraft} />
        <ExamScheduleCalendarSection embedded />
      </section>
      <ExamTableSection exams={schoolExams} />
    </div>
  );
}
