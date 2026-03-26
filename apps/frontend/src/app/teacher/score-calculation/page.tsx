"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Users } from "lucide-react";
import StatsScreen from "../components/stats-screen";

type ActiveTab = "class" | "stats";

type MockClass = {
  id: string;
  name: string;
  studentCount: number;
};

type MockStudentResult = {
  id: string;
  name: string;
  score: string | null;
};

const mockClasses: MockClass[] = [
  { id: "class-10a", name: "10-А", studentCount: 25 },
];

const mockTenAStudentsRaw = [
  { name: "Батбаяр Доржсүрэн", score: 18 },
  { name: "Сарнагэрэл Энхбат", score: 16 },
  { name: "Элзий-Орших Түвшин", score: 9 },
  { name: "Мөнхзул Баттулга", score: 15 },
  { name: "Ганбат Цэцэг", score: 11 },
  { name: "Нарантуяа Буян", score: 13 },
  { name: "Эрдэнэбилэг Батболд", score: 17 },
  { name: "Тэмүүлэн Нямдорж", score: 14 },
  { name: "Ундрал Төрбат", score: 19 },
  { name: "Амарзаяа Жаргал", score: 12 },
  { name: "Билгүүн Сүхбаатар", score: 16 },
  { name: "Оюунчимэг Лхагва", score: 10 },
  { name: "Хүслэн Бадам", score: 18 },
  { name: "Баттөр Мягмар", score: null },
  { name: "Төгөлдөр Эрдэнэ", score: 14 },
  { name: "Номин-Эрдэнэ Даваа", score: 15 },
  { name: "Энэрэл Баярсайхан", score: null },
  { name: "Гэрэлмаа Намсрай", score: 13 },
  { name: "Тэнгис Очир", score: 12 },
  { name: "Маралгоо Ганзориг", score: 16 },
  { name: "Содбилэг Бямбаа", score: null },
  { name: "Ананд Болор", score: 11 },
  { name: "Энхнаран Гомбосүрэн", score: 20 },
  { name: "Бадамханд Туул", score: 14 },
  { name: "Одбаяр Ганхуяг", score: null },
] as const;

const mockResultsByClass: Record<string, MockStudentResult[]> = {
  "class-10a": mockTenAStudentsRaw.map((student, index) => ({
    id: `10a-${index + 1}`,
    name: student.name,
    score: student.score === null ? null : `${student.score}/20`,
  })),
};

export default function ScoreCalculationPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("class");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement | null>(null);

  const selectedClass = useMemo(() => {
    if (!selectedClassId) return null;
    return mockClasses.find((c) => c.id === selectedClassId) ?? null;
  }, [selectedClassId]);

  const selectedStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return mockResultsByClass[selectedClassId] ?? [];
  }, [selectedClassId]);

  const submittedCount = useMemo(
    () => selectedStudents.filter((student) => Boolean(student.score)).length,
    [selectedStudents],
  );

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!downloadMenuRef.current) return;
      if (!downloadMenuRef.current.contains(event.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const resultReportHtml = `
    <table border="1">
      <tr><th colspan="4">Анги: ${selectedClass?.name ?? "-"}</th></tr>
      <tr><th>№</th><th>Овог нэр</th><th>Үр дүн</th><th>Төлөв</th></tr>
      ${selectedStudents
        .map(
          (student, index) =>
            `<tr><td>${index + 1}</td><td>${student.name}</td><td>${
              student.score ?? "Өгөөгүй"
            }</td><td>${student.score ? "Зассан" : "Өгөөгүй"}</td></tr>`,
        )
        .join("")}
    </table>
  `;

  const downloadExcel = () => {
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          ${resultReportHtml}
        </body>
      </html>
    `;

    const blob = new Blob([`\ufeff${html}`], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedClass?.name ?? "angi"}-ur-dun.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsDownloadMenuOpen(false);
  };

  const downloadPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Үр дүн</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; color: #1f2a44; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #c8d6ea; padding: 8px; text-align: left; font-size: 14px; }
            th { background: #edf4ff; }
          </style>
        </head>
        <body>
          ${resultReportHtml}
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };

    printWindow.onafterprint = () => {
      printWindow.close();
    };

    setIsDownloadMenuOpen(false);
  };

  return (
    <section className="px-10 py-10">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[#d9dee8] bg-white p-8 shadow-sm">
        <h1 className="text-5 font-extrabold text-[#1f2a44]">
          Шалгалтын дүн тооцоолох
        </h1>
        <p className="mt-2 text-3 text-[#66789f]">
          Шалгалт авсан ангиуд болон сурагчийн дүнгийн detail-г эндээс үзнэ.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-4 md:sticky md:top-6 md:self-start">
            <TabButton
              label="Анги"
              active={activeTab === "class"}
              onClick={() => {
                setActiveTab("class");
                setSelectedClassId(null);
              }}
            />
            <TabButton
              label="Тоон үзүүлэлт"
              active={activeTab === "stats"}
              onClick={() => {
                setActiveTab("stats");
                setSelectedClassId(null);
              }}
            />
          </div>

          <div className="min-w-0 md:col-span-2">
            {activeTab === "stats" ? (
              <div className="min-w-0">
                <StatsScreen />
              </div>
            ) : (
              <>
                {!selectedClassId ? (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-4 font-extrabold text-[#1f2a44]">
                          Шалгалт авсан ангиуд
                        </p>
                        <p className="text-4 text-[#64748b]">
                          Таны заадаг ангиуд
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {mockClasses.map((cls) => (
                        <article
                          key={cls.id}
                          onClick={() => {
                            setSelectedClassId(cls.id);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSelectedClassId(cls.id);
                            }
                          }}
                          className="flex cursor-pointer flex-col gap-3 rounded-xl border border-[#e2e8f0] p-4 transition hover:border-[#4f9dff]/40 hover:bg-[#f8fafc]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#dbeafe] text-[#4f9dff]">
                              <Users className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-4 font-extrabold text-[#1f2a44]">
                                {cls.name}
                              </p>
                              <p className="text-4 text-[#64748b]">
                                {cls.studentCount} сурагч
                              </p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#d9dee8] bg-white p-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClassId(null);
                      }}
                      className="inline-flex items-center gap-2 text-4 font-semibold text-[#4f9dff] hover:underline"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Ангиуд руу буцах
                    </button>

                    {selectedClass ? (
                      <div className="mt-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="text-4 font-extrabold text-[#1f2a44]">
                              {selectedClass.name} ангийн сурагчдын жагсаалт
                            </h2>
                            <p className="text-4 text-[#64748b]">
                              Илгээсэн: {submittedCount}/{selectedClass.studentCount}
                            </p>
                          </div>
                          <div className="relative" ref={downloadMenuRef}>
                            <button
                              aria-expanded={isDownloadMenuOpen}
                              aria-haspopup="menu"
                              className="rounded-lg bg-[#4f9dff] px-4 py-2 text-3 font-semibold text-white hover:bg-[#3f8ff5]"
                              onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                              type="button"
                            >
                              Татах
                            </button>
                            {isDownloadMenuOpen ? (
                              <div
                                className="absolute right-0 z-20 mt-2 min-w-36 rounded-lg border border-[#d9dee8] bg-white p-1 shadow-md"
                                role="menu"
                              >
                                <button
                                  className="w-full rounded-md px-3 py-2 text-left text-3 font-semibold text-[#1f2a44] hover:bg-[#f1f6ff]"
                                  onClick={downloadExcel}
                                  role="menuitem"
                                  type="button"
                                >
                                  Excel татах
                                </button>
                                <button
                                  className="w-full rounded-md px-3 py-2 text-left text-3 font-semibold text-[#1f2a44] hover:bg-[#f1f6ff]"
                                  onClick={downloadPdf}
                                  role="menuitem"
                                  type="button"
                                >
                                  PDF татах
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-6">
                      <div className="mb-3 grid grid-cols-[80px_1fr_220px] gap-3 px-4 text-3 font-semibold text-[#6b7c9b]">
                        <p>№</p>
                        <p>Овог нэр</p>
                        <p className="text-right">Үр дүн</p>
                      </div>

                      <div className="space-y-3">
                        {selectedStudents.map((student, index) => (
                        <article
                          key={student.id}
                          className="flex items-center justify-between gap-4 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="w-14 shrink-0 text-4 font-bold text-[#4b5d80]">
                              {index + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-4 font-bold text-[#1f2a44]">
                                {student.name}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            {student.score ? (
                              <p className="text-4 font-extrabold text-[#16a34a]">
                                {student.score}
                              </p>
                            ) : (
                              <p className="text-4 font-semibold text-[#4f9dff]">
                                Өгөөгүй
                              </p>
                            )}
                          </div>
                        </article>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-5 text-5 font-semibold transition ${
        active
          ? "border-teal-600 bg-teal-50 text-[#2f3c59]"
          : "border-[#d9dee8] bg-teal-50 text-[#2f3c59] hover:border-teal-600/40 hover:bg-[#f8fafc]"
      }`}
    >
      {label}
    </button>
  );
}
