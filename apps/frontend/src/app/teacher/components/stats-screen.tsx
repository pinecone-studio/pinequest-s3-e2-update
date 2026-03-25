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

const gradeOrder = ["A", "B", "C", "D", "F"] as const;

function toScoreNumber(score: string) {
  const raw = Number(score.split("/")[0]);
  return Number.isFinite(raw) ? raw : 0;
}

function toLetterGrade(score: number) {
  if (score >= 18) return "A";
  if (score >= 16) return "B";
  if (score >= 13) return "C";
  if (score >= 10) return "D";
  return "F";
}

function toneClasses(tone: "blue" | "green" | "red") {
  if (tone === "green") return "text-[#12b650]";
  if (tone === "red") return "text-[#f15f6a]";
  return "text-teal-600";
}

export default function StatsScreen() {
  const gradeDistribution = gradeOrder.map((grade) => {
    const count = students.filter(
      (student) => toLetterGrade(toScoreNumber(student.score)) === grade,
    ).length;
    const percent = students.length
      ? Math.round((count / students.length) * 100)
      : 0;
    return { grade, count, percent };
  });

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
        <p className="mb-5 text-4 font-bold">Дүнгийн Үсгэн Үнэлгээний Хуваарилалт</p>
        <div className="space-y-4">
          {gradeDistribution.map((item) => (
            <div key={item.grade}>
              <div className="mb-1 flex items-center justify-between gap-3 text-4">
                <p className="font-bold text-[#34425f]">{item.grade}</p>
                <p className="font-semibold text-[#4a5875]">
                  {item.count} сурагч ({item.percent}%)
                </p>
              </div>
              <div className="h-3 rounded-full bg-[#e6ebf3]">
                <div
                  className="h-3 rounded-full bg-teal-600"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#d9dee8] bg-white p-5">
        <p className="mb-5 text-4 font-bold">Хүүхдүүдийн Хамгийн Их Алдсан Асуулт</p>
        <div className="space-y-4">
          {mostMissedQuestions.map((question) => (
            <div key={question.label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-4">
                <p className="text-[#34425f]">{question.label}</p>
                <p className="font-semibold text-[#4a5875]">
                  {question.wrongStudents} сурагч ({question.percent}%)
                </p>
              </div>
              <div className="h-2 rounded-full bg-[#e6ebf3]">
                <div
                  className="h-2 rounded-full bg-teal-600"
                  style={{ width: `${question.percent}%` }}
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
