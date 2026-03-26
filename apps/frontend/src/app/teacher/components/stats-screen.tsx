"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    title: "Нийт сурагч",
    value: "5",
    note: "1 шилжин ирсэн",
    trend: "+ 1 шилжилт",
    tone: "blue",
  },
  {
    title: "Дундаж оноо",
    value: "14.3",
    note: "20-оос",
    trend: "+ 2.1",
    tone: "green",
  },
  {
    title: "Тэнцсэн",
    value: "4",
    note: "66.7%",
    trend: "66.7%",
    tone: "green",
  },
  {
    title: "Тэнцээгүй",
    value: "1",
    note: "1 шалгагдаагүй",
    trend: "Анхаарах",
    tone: "red",
  },
] as const;

const mostMissedQuestions = [
  {
    label: "Асуулт 4: Үндсэн хуулийн эрх мэдлийн хуваарилалт",
    wrongStudents: 5,
    percent: 83,
  },
  {
    label: "Асуулт 7: Иргэний эрх, үүргийн ялгаа",
    wrongStudents: 4,
    percent: 67,
  },
  {
    label: "Асуулт 2: Ардчиллын зарчим бодит жишээтэй тайлбарлах",
    wrongStudents: 4,
    percent: 67,
  },
  {
    label: "Асуулт 9: Төрийн байгууллагын чиг үүрэг",
    wrongStudents: 3,
    percent: 50,
  },
] as const;

const students = [
  {
    initial: "Б",
    name: "Батбаяр Доржсүрэн",
    email: "batbayar@school.mn",
    score: "18/20",
    status: "Батлагдсан",
  },
  {
    initial: "С",
    name: "Сарнагэрэл Энхбат",
    email: "sarnagrel@school.mn",
    score: "16/20",
    status: "Батлагдсан",
  },
  {
    initial: "Э",
    name: "Элзий-Орших Түвшин",
    email: "olzii@school.mn",
    score: "9/20",
    status: "Батлагдсан",
  },
  {
    initial: "М",
    name: "Мөнхзул Баттулга",
    email: "munkhzul@school.mn",
    score: "0/20",
    status: "Шалгагдаагүй",
  },
  {
    initial: "Г",
    name: "Ганбат Цэцэг",
    email: "ganbat@school.mn",
    score: "0/20",
    status: "Шалгагдаагүй",
  },
  {
    initial: "Н",
    name: "Нарантуяа Буян",
    email: "narantuya@school.mn",
    score: "0/20",
    status: "Шалгагдаагүй",
  },
] as const;

const recommendations = [
  "Сурагчийн 67% нь жишээ дутмаг байна - дараагийн хичээлд жишээ бичих арга зүй зааварлах хэрэгтэй",
  "Үндсэн ойлголтуудыг илүү дэлгэрэнгүй тайлбарлах шаардлагатай",
  "Критик сэтгэлгээ хөгжүүлэх дасгал хийх",
  "Шилжин ирсэн сурагчид онцгой анхаарал хандуулж, түвшинг тэгшлэх хэрэгтэй",
] as const;

const gradeDistributionMock = [
  { grade: "A", count: 6, color: "#26a69a" },
  { grade: "B", count: 7, color: "#4f7fd8" },
  { grade: "C", count: 5, color: "#f2c94c" },
  { grade: "D", count: 4, color: "#8dd3c7" },
  { grade: "F", count: 3, color: "#c3c9d6" },
] as const;

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function pieSlicePath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function toneClasses(tone: "blue" | "green" | "red") {
  if (tone === "green") return "text-[#12b650]";
  if (tone === "red") return "text-[#f15f6a]";
  return "text-teal-600";
}

export default function StatsScreen() {
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement | null>(null);

  const totalForGradeDistribution = gradeDistributionMock.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const gradeDistribution = gradeDistributionMock.map((item) => ({
    ...item,
    percent: totalForGradeDistribution
      ? Math.round((item.count / totalForGradeDistribution) * 100)
      : 0,
  }));

  const chartRadius = 110;
  const chartSize = 280;
  const chartCenter = chartSize / 2;
  const pieSlices = gradeDistribution.reduce<{
    slices: Array<
      (typeof gradeDistribution)[number] & {
        path: string;
        labelPosition: { x: number; y: number };
      }
    >;
    currentAngle: number;
  }>(
    (acc, item) => {
      const sweep = (item.count / totalForGradeDistribution) * 360;
      const startAngle = acc.currentAngle;
      const endAngle = acc.currentAngle + sweep;
      const labelAngle = startAngle + sweep / 2;

      const nextSlice = {
        ...item,
        path: pieSlicePath(
          chartCenter,
          chartCenter,
          chartRadius,
          startAngle,
          endAngle,
        ),
        labelPosition: polarToCartesian(
          chartCenter,
          chartCenter,
          chartRadius * 0.62,
          labelAngle,
        ),
      };

      return {
        slices: [...acc.slices, nextSlice],
        currentAngle: endAngle,
      };
    },
    { slices: [], currentAngle: 0 },
  ).slices;

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

  const reportHtml = `
    <table border="1">
      <tr><th colspan="2">Ангийн Тоон Үзүүлэлт</th></tr>
      <tr><td>Анги</td><td>10-А анги</td></tr>
      <tr><td>Хичээл</td><td>Нийгмийн Ухаан</td></tr>
      <tr><td>Шалгалт</td><td>#1</td></tr>
      <tr><td>Огноо</td><td>2026/03/20</td></tr>

      <tr><th colspan="2">Үндсэн Статистик</th></tr>
      ${stats
        .map(
          (item) =>
            `<tr><td>${item.title}</td><td>${item.value} (${item.note})</td></tr>`,
        )
        .join("")}

      <tr><th colspan="2">Үнэлгээ Хуваарилалт (A/B/C/D/F)</th></tr>
      ${gradeDistribution
        .map(
          (item) =>
            `<tr><td>${item.grade}</td><td>${item.count} сурагч (${item.percent}%)</td></tr>`,
        )
        .join("")}

      <tr><th colspan="2">Хамгийн Их Алдсан Асуулт</th></tr>
      ${mostMissedQuestions
        .map(
          (item) =>
            `<tr><td>${item.label}</td><td>${item.wrongStudents} сурагч (${item.percent}%)</td></tr>`,
        )
        .join("")}

      <tr><th colspan="4">Сурагчийн Жагсаалт</th></tr>
      <tr><th>Нэр</th><th>И-мэйл</th><th>Оноо</th><th>Төлөв</th></tr>
      ${students
        .map(
          (student) =>
            `<tr><td>${student.name}</td><td>${student.email}</td><td>${student.score}</td><td>${student.status}</td></tr>`,
        )
        .join("")}

      <tr><th colspan="2">Зөвлөмж</th></tr>
      ${recommendations.map((item) => `<tr><td colspan="2">${item}</td></tr>`).join("")}
    </table>
  `;

  const downloadExcel = () => {
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          ${reportHtml}
        </body>
      </html>
    `;

    const blob = new Blob([`\ufeff${html}`], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "angi-toon-uzuuulelt-2026-03-20.xls";
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
          <title>Ангийн Тоон Үзүүлэлт</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; color: #1f2a44; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #c8d6ea; padding: 8px; text-align: left; font-size: 14px; }
            th { background: #edf4ff; }
          </style>
        </head>
        <body>
          ${reportHtml}
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
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <section className="rounded-xl border border-[#d9dee8] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4 font-extrabold">Ангийн Тоон Үзүүлэлт</h1>
            <p className="mt-2 text-4 text-[#66789f]">
              10-А анги · Нийгмийн Ухаан · Шалгалт #1 · 2026/03/20
            </p>
          </div>
          <div className="relative" ref={downloadMenuRef}>
            <button
              aria-expanded={isDownloadMenuOpen}
              aria-haspopup="menu"
              className="rounded-lg bg-teal-600 px-4 py-2 text-4 font-semibold text-white hover:bg-teal-700"
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
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-[#d9dee8] bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <span className="text-4 text-teal-500">◉</span>
              <span
                className={`text-4 font-semibold ${toneClasses(item.tone)}`}
              >
                {item.trend}
              </span>
            </div>
            <p className="mt-3 text-4 font-bold">{item.value}</p>
            <p className="mt-1 text-4 font-semibold">{item.title}</p>
            <p className="mt-1 text-4 text-[#66789f]">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-[#d9dee8] bg-white p-5 md:p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-4 font-bold">Дүнгийн тооцоолол</p>
          <p className="text-3 font-semibold text-[#60708f]">
            Нийт {totalForGradeDistribution} сурагч
          </p>
        </div>
        <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[420px_200px]">
          <div className="mx-auto w-full max-w-[320px]">
            <svg
              aria-label="Дүнгийн хуваарилалтын график"
              className="h-auto w-full"
              viewBox={`0 0 ${chartSize} ${chartSize}`}
            >
              {pieSlices.map((slice) => (
                <g key={slice.grade}>
                  <path
                    d={slice.path}
                    fill={slice.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    fill="#1f2a44"
                    fontSize="16"
                    fontWeight="700"
                    textAnchor="middle"
                    x={slice.labelPosition.x}
                    y={slice.labelPosition.y}
                  >
                    {slice.percent}%
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="mx-auto w-full max-w-[460px] space-y-2.5 lg:mx-0 lg:mt-8 lg:self-end">
            {gradeDistribution.map((item) => (
              <div
                key={item.grade}
                className="flex items-end justify-between rounded-lg border border-[#e4eaf5] bg-[#f9fbff] px-2 py-1"
              >
                <div className="flex items-center gap-1">
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-3 font-bold text-[#34425f]">
                    {item.grade}
                  </p>
                </div>
                <p className="text-3 font-semibold text-[#4a5875]">
                  {item.count} сурагч
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#d9dee8] bg-white p-5">
        <p className="mb-5 text-4 font-bold">
          Хүүхдүүдийн хамгийн их алдсан асуулт
        </p>
        <div className="space-y-4">
          {mostMissedQuestions.map((question) => (
            <div key={question.label}>
              <div className="mb-1 text-4">
                <p className="text-[#34425f]">{question.label}</p>
              </div>
              <div className="h-2 rounded-full bg-[#e6ebf3]">
                <div
                  className="h-2 rounded-full bg-[#4f9dff]"
                  style={{ width: `${question.percent}%` }}
                  title={`${question.wrongStudents} сурагч`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#ddd7c6] bg-[#eeebdd] p-5">
        <p className="mb-3 text-4 font-bold">Зөвлөмж</p>
        <ul className="space-y-2 text-4 text-[#3f4d67]">
          {recommendations.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
