import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { authSignInHref } from "@/app/lib/auth-redirect";
import {
  getAppUserFromClerk,
  getAppUserFromUserId,
} from "@/app/lib/clerk-app-user";
import TeacherShell from "./teacher-shell";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const signInTeacher = authSignInHref("/teacher");
  if (!userId) {
    redirect(signInTeacher);
  }
  let user = await getAppUserFromClerk("teacher");
  if (!user) {
    user = await getAppUserFromUserId(userId, "teacher");
  }
  if (!user) {
    redirect(signInTeacher);
  }

  return <TeacherShell user={user}>{children}</TeacherShell>;
}
