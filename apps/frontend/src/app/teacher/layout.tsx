import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/lib/session";
import TeacherShell from "./teacher-shell";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "teacher") {
    redirect("/?error=auth");
  }

  return <TeacherShell user={user}>{children}</TeacherShell>;
}
