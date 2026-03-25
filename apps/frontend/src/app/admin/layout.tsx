import { AdminShell } from "@/app/admin/_components/admin_shell";
import { getSessionUser } from "@/app/lib/session";
import { store } from "@/app/lib/store";

const DEFAULT_ADMIN_ID = "user-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await getSessionUser();
  const user =
    sessionUser?.role === "school_admin"
      ? sessionUser
      : store.getUser(DEFAULT_ADMIN_ID)!;

  return <AdminShell user={user}>{children}</AdminShell>;
}