import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<{ templateId?: string; deliveryId?: string }> }) {
  const p = await searchParams;
  if (p.templateId && p.deliveryId) {
    redirect(
      `/teacher/exam-management/preview-send?templateId=${encodeURIComponent(p.templateId)}&deliveryId=${encodeURIComponent(p.deliveryId)}`,
    );
  }
  redirect("/teacher/exam-management");
}
