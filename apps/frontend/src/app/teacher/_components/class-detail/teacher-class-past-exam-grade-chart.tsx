"use client";

import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import type { PastExamRow } from "@/app/lib/class-past-exams-types";

type LetterGrade = "A" | "B" | "C" | "D" | "F";

const LETTER_GRADE_ORDER: LetterGrade[] = ["A", "B", "C", "D", "F"];
const LETTER_GRADE_STYLES: Record<
  LetterGrade,
  { fill: string; labelMn: string }
> = {
  A: { fill: "rgba(22, 163, 74, 0.5)", labelMn: "Маш сайн (A)" },
  B: { fill: "rgba(79, 157, 255, 0.5)", labelMn: "Сайн (B)" },
  C: { fill: "rgba(202, 138, 4, 0.5)", labelMn: "Дунд (C)" },
  D: { fill: "rgba(234, 88, 12, 0.5)", labelMn: "Муу (D)" },
  F: { fill: "rgba(236, 72, 153, 0.5)", labelMn: "Тэнцээгүй (F)" },
};

function letterGradeFromPercent(percent: number): LetterGrade {
  if (percent >= 90) return "A";
  if (percent >= 80) return "B";
  if (percent >= 70) return "C";
  if (percent >= 60) return "D";
  return "F";
}

function pastExamGradeBuckets(row: PastExamRow): Record<LetterGrade, number> {
  const empty: Record<LetterGrade, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  if (row.maxScore <= 0 || row.studentScores.length === 0) return empty;
  for (const student of row.studentScores) {
    empty[letterGradeFromPercent((student.score / row.maxScore) * 100)] += 1;
  }
  return empty;
}

export function TeacherClassPastExamGradeChart({ row }: { row: PastExamRow }) {
  const buckets = useMemo(() => pastExamGradeBuckets(row), [row]);
  const total = row.studentScores.length;

  if (total === 0) {
    return (
      <section className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-[#fafbfd] p-6 text-center text-[0.9375rem] text-[#122459]">
        <BarChart3 className="mb-3 h-10 w-10 text-[#122459]" />
        <p className="font-semibold text-[#122459]">Сурагчийн дата байхгүй</p>
        <p className="mt-1 max-w-xs leading-relaxed">
          Үнэлгээний хуваарилалт харагдахын тулд дор хаяд нэг сурагч шалгалт өгсөн байх ёстой.
        </p>
      </section>
    );
  }

  const segments = LETTER_GRADE_ORDER.filter((grade) => buckets[grade] > 0).map((grade) => ({
    grade,
    count: buckets[grade],
    pct: (buckets[grade] / total) * 100,
    fill: LETTER_GRADE_STYLES[grade].fill,
  }));

  return (
    <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] sm:p-6">
      <h3 className="text-lg font-extrabold tracking-tight text-[#122459] sm:text-xl">Ангийн үнэлгээ (A–F)</h3>
      <p className="mt-3 max-w-prose rounded-xl bg-[#f8fafc] px-3.5 py-2.5 text-[0.8125rem] leading-snug text-[#122459] ring-1 ring-[#f1f5f9] sm:text-[0.875rem]">
        Нийт онооны хувиар: <span className="font-semibold text-[#122459]">A — 90%+</span> · <span className="font-semibold text-[#122459]">B — 80%+</span> · <span className="font-semibold text-[#122459]">C — 70%+</span> · <span className="font-semibold text-[#122459]">D — 60%+</span> · <span className="font-semibold text-[#122459]">F — доош</span>
      </p>
      <div className="mt-5 flex h-14 w-full overflow-hidden rounded-2xl shadow-inner ring-1 ring-[#e2e8f0]">
        {segments.map((segment) => (
          <div
            key={segment.grade}
            className="min-h-[3.5rem] transition-[width] duration-300"
            style={{ width: `${segment.pct}%`, backgroundColor: segment.fill, minWidth: segment.count > 0 ? "6px" : undefined }}
            title={`${segment.grade}: ${segment.count} сурагч (${Math.round(segment.pct)}%)`}
          />
        ))}
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {LETTER_GRADE_ORDER.map((grade) => {
          const count = buckets[grade];
          const percent = Math.round((count / total) * 100);
          const style = LETTER_GRADE_STYLES[grade];
          return (
            <li key={grade} className="flex flex-col rounded-xl border border-[#e8ecf2] bg-[#fafbfd] px-3 py-3 text-[#122459] shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: style.fill }} />
                <span className="text-lg font-extrabold tabular-nums text-[#122459]">{grade}</span>
              </div>
              <span className="mt-2 text-[0.8125rem] font-medium tabular-nums text-[#122459]">{count} сурагч</span>
              <span className="mt-1 line-clamp-2 text-[0.6875rem] font-medium leading-tight text-[#122459]">
                {percent}% — {style.labelMn}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
