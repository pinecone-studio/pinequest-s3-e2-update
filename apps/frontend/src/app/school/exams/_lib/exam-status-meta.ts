/** @format */

import type { ExamStatus } from "../_types/exam";

export const examStatusMeta: Record<
  ExamStatus,
  {
    label: string;
    badgeClassName: string;
    cardTintClassName: string;
  }
> = {
  draft: {
    label: "Ноорог",
    badgeClassName: "border border-zinc-200 bg-zinc-100 text-zinc-700",
    cardTintClassName: "from-zinc-50 to-white",
  },
  scheduled: {
    label: "Товлогдсон",
    badgeClassName: "border border-blue-200 bg-blue-100 text-blue-700",
    cardTintClassName: "from-blue-50 to-white",
  },
  ongoing: {
    label: "Явагдаж буй",
    badgeClassName: "border border-emerald-200 bg-emerald-100 text-emerald-700",
    cardTintClassName: "from-emerald-50 to-white",
  },
  grading: {
    label: "Шалгаж буй",
    badgeClassName: "border border-amber-200 bg-amber-100 text-amber-700",
    cardTintClassName: "from-amber-50 to-white",
  },
  completed: {
    label: "Дууссан",
    badgeClassName: "border border-violet-200 bg-violet-100 text-violet-700",
    cardTintClassName: "from-violet-50 to-white",
  },
};
