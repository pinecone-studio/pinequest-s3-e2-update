import { getExamDetailOrThrow } from "./_mock/exam-detail";
import { ExamAlerts } from "./_components/ExamAlerts";
import { ExamDetailHeader } from "./_components/ExamDetailHeader";
import { ExamGradingStatus } from "./_components/ExamGradingStatus";
import { ExamInfoCard } from "./_components/ExamInfoCard";
import { ExamParticipationSummary } from "./_components/ExamParticipationSummary";
import { ExamQuestionBreakdown } from "./_components/ExamQuestionBreakdown";

export default async function SchoolExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = getExamDetailOrThrow(id);

  return (
    <div className="space-y-6">
      <ExamDetailHeader exam={exam} />
      <ExamInfoCard exam={exam} />
      <ExamParticipationSummary exam={exam} />
      <ExamQuestionBreakdown exam={exam} />
      <ExamGradingStatus exam={exam} />
      <ExamAlerts notes={exam.notes} />
    </div>
  );
}
