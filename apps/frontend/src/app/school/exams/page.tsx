import { ExamLifecycleSummary } from "./_components/ExamLifecycleSummary";
import { ExamPageHeader } from "./_components/ExamPageHeader";
import { ExamSmartAlerts } from "./_components/ExamSmartAlerts";
import { ExamTableSection } from "./_components/ExamTableSection";
import {
  examAlerts,
  getExamLifecycleSummary,
  schoolExams,
} from "./_mock/school-exams";

export default function SchoolExamsPage() {
  const lifecycleSummary = getExamLifecycleSummary(schoolExams);

  return (
    <div className="space-y-6">
      <ExamPageHeader />
      <ExamLifecycleSummary summary={lifecycleSummary} />
      <ExamSmartAlerts alerts={examAlerts} />
      <ExamTableSection exams={schoolExams} />
    </div>
  );
}
