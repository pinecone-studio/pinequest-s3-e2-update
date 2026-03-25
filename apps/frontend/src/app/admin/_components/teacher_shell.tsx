import Link from "next/link";
import { LogoutButton } from "./logout";
import type { User } from "@/app/lib/types";
import { store } from "@/app/lib/store";

export function TeacherShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const school = store.getSchool();
  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
              Багш
            </p>
            <h1 className="text-lg font-semibold text-zinc-900">{school.name}</h1>
            <p className="text-sm text-zinc-500">
              {user.name} · {user.email}
            </p>
            {user.specialty?.trim() ? (
              <p className="mt-1 text-sm font-medium text-teal-700">
                Мэргэжил: {user.specialty}
              </p>
            ) : null}
          </div>
          <LogoutButton />
        </div>
        <nav className="border-t border-zinc-100 bg-zinc-50/80">
          <ul className="mx-auto flex max-w-6xl gap-1 px-4 py-2 sm:px-6">
            <li>
              <Link
                href="/teacher"
                className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-white hover:text-zinc-900"
              >
                Миний ангиуд
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl bg-white px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
