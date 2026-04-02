/** @format */

"use client";

import { useEffect } from "react";
import { SchoolLoaderExperience } from "@/app/school/_components/school-loader-experience";
import {
  SCHOOL_LOADER_HOLD_EVENT,
  SCHOOL_LOADER_MIN_MS,
} from "@/app/school/_lib/school-loader-min-ms";

export default function SchoolLoading() {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, SCHOOL_LOADER_MIN_MS - elapsed);
      if (remaining > 0) {
        window.dispatchEvent(
          new CustomEvent(SCHOOL_LOADER_HOLD_EVENT, {
            detail: { remaining },
          }),
        );
      }
    };
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-6">
      <section className="shrink-0 rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-3 font-bold text-[#0f172a]">Сургуулийн самбар</h2>
      </section>
      <div className="flex min-h-0 flex-1 flex-col">
        <SchoolLoaderExperience />
      </div>
    </div>
  );
}
