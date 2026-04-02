import { SchoolExamDetailClient } from "./_components/school-exam-detail-client";

export default async function SchoolExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <SchoolExamDetailClient examId={id} />
    </div>
  );
}
