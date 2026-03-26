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
    const readRole = (meta: unknown): string | undefined => {
      if (!meta || typeof meta !== "object") return undefined;
      const r = (meta as Record<string, unknown>).role;
      return typeof r === "string" ? r : undefined;
    };
    const role =
      readRole(clerkUser?.publicMetadata) ?? readRole(clerkUser?.unsafeMetadata);
    if (role === "teacher") redirect("/teacher");
    if (role === "school_admin" || role === "admin") redirect("/admin");
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
