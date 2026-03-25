"use client";

import { useClerk } from "@clerk/nextjs";

export function LogoutButton() {
  const { signOut } = useClerk();
  return (
    <button
      type="button"
      className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
      onClick={() => signOut({ redirectUrl: "/" })}
    >
      Гарах
    </button>
  );
}