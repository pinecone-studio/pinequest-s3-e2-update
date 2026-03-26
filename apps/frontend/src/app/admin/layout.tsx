import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminShell } from "@/app/admin/_components/admin_shell";
import { authSignInHref } from "@/app/lib/auth-redirect";
import {
  fallbackAppUser,
  getAppUserFromClerk,
  getAppUserFromUserId,
} from "@/app/lib/clerk-app-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const signInAdmin = authSignInHref("/admin");
  if (!userId) {
    redirect(signInAdmin);
  }
  let user = await getAppUserFromClerk("school_admin");
  if (!user) {
    user = await getAppUserFromUserId(userId, "school_admin");
  }
  if (!user) {
    user = fallbackAppUser(userId, "school_admin");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}