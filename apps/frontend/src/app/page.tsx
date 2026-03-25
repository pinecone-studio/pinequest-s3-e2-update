import { redirect } from "next/navigation";
import { TeacherLanding } from "@/app/components/teacher-landing";
import { getSessionUser } from "@/app/lib/session";

type SearchParams = { error?: string | string[] };

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const user = await getSessionUser();
  if (user?.role === "teacher") {
    redirect("/teacher");
  }

  const sp = searchParams ? await searchParams : {};
  const raw = sp.error;
  const loginError =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;

  return (
    <main className="min-h-screen bg-teal-50 text-[#1f2a44]">
      <TeacherLanding loginError={loginError} />
    </main>
  );
}
