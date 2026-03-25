"use client";

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

const scoreDistribution = [
  { range: "0-5", count: 1 },
  { range: "6-10", count: 2 },
  { range: "11-15", count: 4 },
  { range: "16-20", count: 5 },
] as const;

const commonErrors = [
  { label: "Жишээ дутмаг, тодорхой бус байх", count: 8, percent: 67 },
  { label: "Үндсэн ойлголтуудыг зөв тайлбарлаагүй", count: 5, percent: 42 },
  { label: "Бүтэц, зохион байгуулалт муу", count: 4, percent: 33 },
  { label: "Критик сэтгэлгээ дутмаг", count: 3, percent: 25 },
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

function toneClasses(tone: "blue" | "green" | "red") {
  if (tone === "green") return "text-[#12b650]";
  if (tone === "red") return "text-[#f15f6a]";
  return "text-teal-600";
}

export default function StatsScreen() {
  const downloadExcel = () => {
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
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

            <tr><th colspan="2">Оноо Хуваарилалт</th></tr>
            ${scoreDistribution
              .map((item) => `<tr><td>${item.range}</td><td>${item.count}</td></tr>`)
              .join("")}

            <tr><th colspan="2">Түгээмэл Алдаа</th></tr>
            ${commonErrors
              .map(
                (item) =>
                  `<tr><td>${item.label}</td><td>${item.count} сурагч (${item.percent}%)</td></tr>`,
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
          <button
            className="rounded-lg bg-teal-600 px-4 py-2 text-4 font-semibold text-white hover:bg-teal-700"
            onClick={downloadExcel}
            type="button"
          >
            Excel татах
          </button>
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

      <section className="rounded-xl border border-[#d9dee8] bg-white p-5">
        <p className="mb-5 text-4 font-bold">Оноо Хуваарилалт</p>
        <div className="grid h-64 grid-cols-4 items-end gap-4 border-b border-l border-[#bcc7da] px-3 pb-0 pt-2">
          {scoreDistribution.map((bar) => (
            <div
              key={bar.range}
              className="flex flex-col items-center justify-end gap-2"
            >
              <div
                className="w-full rounded-t-2xl bg-teal-600"
                style={{ height: `${bar.count * 22}px` }}
              />
              <p className="pb-2 text-4 font-semibold text-[#334261]">
                {bar.range}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#d9dee8] bg-white p-5">
        <p className="mb-5 text-4 font-bold">Түгээмэл Алдаа</p>
        <div className="space-y-4">
          {commonErrors.map((error) => (
            <div key={error.label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-4">
                <p className="text-[#34425f]">{error.label}</p>
                <p className="font-semibold text-[#4a5875]">
                  {error.count} сурагч ({error.percent}%)
                </p>
              </div>
              <div className="h-2 rounded-full bg-[#e6ebf3]">
                <div
                  className="h-2 rounded-full bg-teal-600"
                  style={{ width: `${error.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#d9dee8] bg-white p-5">
        <p className="mb-4 text-4 font-bold">Сурагчийн Жагсаалт</p>
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.email}
              className="flex items-center justify-between gap-4 rounded-lg px-3 py-2 hover:bg-[#f6f9fc]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#64b3f5] text-4 font-bold text-white">
                  {student.initial}
                </div>
                <div>
                  <p className="text-4 font-semibold">{student.name}</p>
                  <p className="text-4 text-[#6d7fa3]">{student.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4 font-bold text-[#15b24f]">
                  {student.score}
                </p>
                <p className="text-4 text-[#556788]">{student.status}</p>
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
