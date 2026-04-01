import { BarChart3 } from "lucide-react";
import { useMemo } from "react";
import type { PastExamRow } from "@/app/lib/class-past-exams-types";
import {
  LETTER_GRADE_ORDER,
  LETTER_GRADE_STYLES,
  pastExamGradeBuckets,
} from "./helpers";

export function PastExamGradeChart({ row }: { row: PastExamRow }) {
  const buckets = useMemo(() => pastExamGradeBuckets(row), [row]);
  const total = row.studentScores.length;

  if (total === 0) {
    return (
      <section className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-[#fafbfd] p-6 text-center text-[0.9375rem] text-[#64748b]">
        <BarChart3 className="mb-3 h-10 w-10 text-[#cbd5e1]" />
        <p className="font-semibold text-[#475569]">Сурагчийн дата байхгүй</p>
      </section>
    );
  }

  const segments = LETTER_GRADE_ORDER.filter((g) => buckets[g] > 0).map(
    (grade) => ({
      grade,
      count: buckets[grade],
      pct: (buckets[grade] / total) * 100,
      fill: LETTER_GRADE_STYLES[grade].fill,
    }),
  );

  return (
    <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] sm:p-6">
      <h3 className="text-lg font-extrabold tracking-tight text-[#0f172a] sm:text-xl">
        Ангийн үнэлгээ (A–F)
      </h3>
      <p className="mt-3 max-w-prose rounded-xl bg-[#f8fafc] px-3.5 py-2.5 text-[0.8125rem] leading-snug text-[#64748b] ring-1 ring-[#f1f5f9] sm:text-[0.875rem]">
        Нийт онооны хувиар: <span className="font-semibold text-[#475569]">A — 90%+</span> ·{" "}
        <span className="font-semibold text-[#475569]">B — 80%+</span> ·{" "}
        <span className="font-semibold text-[#475569]">C — 70%+</span> ·{" "}
        <span className="font-semibold text-[#475569]">D — 60%+</span> ·{" "}
        <span className="font-semibold text-[#475569]">F — доош</span>
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]" role="img">
        <div className="flex min-h-[3.5rem] w-full">
          {segments.map((s) => (
            <div
              key={s.grade}
              style={{
                width: `${s.pct}%`,
                backgroundColor: s.fill,
                minWidth: s.count > 0 ? "6px" : undefined,
              }}
              className="min-h-[3.5rem]"
              title={`${s.grade}: ${s.count} сурагч (${Math.round(s.pct)}%)`}
            />
          ))}
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {LETTER_GRADE_ORDER.map((grade) => {
          const n = buckets[grade];
          const p = total > 0 ? Math.round((n / total) * 100) : 0;
          const { fill, labelMn } = LETTER_GRADE_STYLES[grade];
          return (
            <li key={grade} className="flex flex-col rounded-xl border border-[#e8ecf2] bg-[#fafbfd] px-3 py-3 text-[#334261] shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: fill }} />
                <span className="text-lg font-extrabold tabular-nums text-[#0f172a]">{grade}</span>
              </div>
              <span className="mt-2 text-[0.8125rem] font-medium tabular-nums text-[#64748b]">{n} сурагч</span>
              <span className="mt-1 line-clamp-2 text-[0.6875rem] font-medium leading-tight text-[#94a3b8]">
                {p}% — {labelMn}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
