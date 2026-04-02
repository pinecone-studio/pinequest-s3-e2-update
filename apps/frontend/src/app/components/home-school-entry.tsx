"use client";

import Link from "next/link";

export function HomeSchoolEntry() {
  return (
    <Link
      href="/school"
      className="inline-flex h-14 w-full min-w-0 items-center justify-center rounded-xl border border-[#7DC8FF] bg-white px-5 text-2xl font-medium text-[#122459] transition hover:bg-[#f7fbff] sm:h-17.5 sm:w-auto sm:min-w-40 sm:px-6 sm:text-[30px]"
    >
      Сургууль
    </Link>
  );
}
