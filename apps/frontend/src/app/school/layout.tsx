import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SchoolShell } from "@/app/school/_components/school_shell";
import { authSignInHref } from "@/app/lib/auth-redirect";
import {
  fallbackAppUser,
  getAppUserFromClerk,
  getAppUserFromUserId,
} from "@/app/lib/clerk-app-user";

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const signInSchool = authSignInHref("/school");
  if (!userId) {
    redirect(signInSchool);
  }
  let user = await getAppUserFromClerk("school_admin");
  if (!user) {
    user = await getAppUserFromUserId(userId, "school_admin");
  }
  if (!user) {
    user = fallbackAppUser(userId, "school_admin");
  }

  return <SchoolShell user={user}>{children}</SchoolShell>;
}
