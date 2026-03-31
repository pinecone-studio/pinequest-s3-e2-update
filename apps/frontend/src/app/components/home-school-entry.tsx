"use client";

import Link from "next/link";

export function HomeSchoolEntry() {
  return (
    <Link
      href="/school"
      className="inline-flex h-17.5 min-w-40 items-center justify-center rounded-xl border border-[#7DC8FF] bg-white px-6 text-[30px] font-medium text-[#122459] transition hover:bg-[#f7fbff]"
    >
      Сургууль
    </Link>
  );
}
