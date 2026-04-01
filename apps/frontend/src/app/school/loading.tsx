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

  return <SchoolLoaderExperience />;
}
