import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<{ templateId?: string }> }) {
  const p = await searchParams;
  if (p.templateId) {
    redirect(`/teacher/exam-management/setup?templateId=${encodeURIComponent(p.templateId)}`);
  }
  redirect("/teacher/exam-management");
}
