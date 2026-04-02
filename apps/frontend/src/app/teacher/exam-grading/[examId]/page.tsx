import { ManualGradingPage } from "../_components/manual-grading-page";

export default async function TeacherExamGradingPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  return <ManualGradingPage examId={examId} />;
}
