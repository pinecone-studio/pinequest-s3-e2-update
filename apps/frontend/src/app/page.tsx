import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TeacherLanding } from "@/app/components/teacher-landing";

type SearchParams = { error?: string | string[] };

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { userId } = await auth();
  if (userId) {
    const clerkUser = await currentUser();
    const role = clerkUser?.publicMetadata?.role;
    if (role === "teacher") redirect("/teacher");
    if (role === "school_admin" || role === "admin") redirect("/admin");
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
