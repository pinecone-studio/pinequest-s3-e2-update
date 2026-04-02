/** @format */

import { TeacherDetailClient } from "./teacher-detail-client";

export default async function AdminTeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TeacherDetailClient teacherId={id} />;
}
