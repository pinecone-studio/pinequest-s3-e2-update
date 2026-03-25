"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { useMemo, useState } from "react";
import { useExamFlow } from "../shared/store";
import { mockStudentResults } from "../shared/mock-data";
import { questionTypeLabel } from "../shared/utils";

export default function ResultsPage() {
  const { selectedQuestions, lastQuestionResults } = useExamFlow();
  const [note, setNote] = useState("");

  const studentRows = useMemo(() => {
    if (lastQuestionResults.length === 0) return mockStudentResults;
    const score = lastQuestionResults.reduce((sum, item) => sum + item.score, 0);
    const maxScore = lastQuestionResults.reduce((sum, item) => sum + item.maxScore, 0);
    return [
      ...mockStudentResults,
      {
        studentName: "Demo Сурагч",
        score,
        maxScore,
        status: "Илгээсэн" as const,
        submittedAt: "2026-03-25 10:10",
      },
    ];
  }, [lastQuestionResults]);

  const avg = Math.round(
    studentRows.reduce((sum, item) => sum + (item.score / item.maxScore) * 100, 0) /
      studentRows.length,
  );
  const high = Math.max(...studentRows.map((item) => item.score));
  const lowTopics = selectedQuestions
    .filter((q) => q.correctRate < 45)
    .map((q) => q.topic)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-6 font-extrabold text-[#1f2a44]">Үр дүн ба үнэлгээ</h2>
            <p className="text-3 text-[#5c6f91]">
              Автомат шалгалт + багшийн гар үнэлгээний нийлмэл тайлан
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-1 rounded-xl border border-[#d9e6fb] bg-white px-3 py-2 text-3 font-semibold text-[#335c96]"
              onClick={() => setNote("PDF тайлан татах функц MVP-ийн mock төлөвт байна.")}
              type="button"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-xl bg-[#4f9dff] px-3 py-2 text-3 font-semibold text-white"
              onClick={() =>
                setNote("Excel экспорт mock төлөвт байна. CSV/Excel файл дараагийн спринтэд.")
              }
              type="button"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
        {note && (
          <div className="mt-2 rounded-lg bg-[#eef6ff] px-3 py-2 text-3 text-[#335c96]">
            {note}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Metric title="Нийт сурагч" value={String(studentRows.length)} />
        <Metric title="Дундаж оноо" value={`${avg}%`} />
        <Metric title="Хамгийн өндөр оноо" value={String(high)} />
        <Metric
          title="Сул сэдвүүд"
          value={lowTopics.length > 0 ? lowTopics.join(", ") : "Тогтвортой"}
        />
      </div>

      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <h3 className="text-5 font-bold text-[#1f2a44]">Сурагчдын дүн</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e6eefb] text-3 text-[#5c6f91]">
                <th className="py-2">Нэр</th>
                <th className="py-2">Оноо</th>
                <th className="py-2">Төлөв</th>
                <th className="py-2">Илгээсэн цаг</th>
              </tr>
            </thead>
            <tbody>
              {studentRows.map((row) => (
                <tr className="border-b border-[#f0f4fb] text-3 text-[#1f2a44]" key={row.studentName}>
                  <td className="py-2">{row.studentName}</td>
                  <td className="py-2">
                    {row.score}/{row.maxScore}
                  </td>
                  <td className="py-2">{row.status}</td>
                  <td className="py-2">{row.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <h3 className="text-5 font-bold text-[#1f2a44]">Асуулт тус бүрийн төлөв</h3>
        {selectedQuestions.length === 0 ? (
          <p className="mt-2 text-3 text-[#5c6f91]">
            Сонгосон асуулт алга. Асуултын сангаас асуулт нэмнэ үү.
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {selectedQuestions.map((q) => {
              const result = lastQuestionResults.find((item) => item.questionId === q.id);
              return (
                <div
                  className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-3"
                  key={q.id}
                >
                  <p className="text-4 font-bold text-[#1f2a44]">{q.title}</p>
                  <p className="text-3 text-[#5c6f91]">
                    {q.subject} · {questionTypeLabel[q.type]} ·
                    {" "}
                    {result ? result.state : q.type === "essay" ? "Pending Review" : "Auto-Graded"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#d9e6fb] bg-white p-3 shadow-sm">
      <p className="text-3 text-[#5c6f91]">{title}</p>
      <p className="mt-1 text-6 font-bold text-[#1f2a44]">{value}</p>
    </div>
  );
}
