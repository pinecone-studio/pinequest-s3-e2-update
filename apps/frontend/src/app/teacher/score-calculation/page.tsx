import Link from "next/link";

export default function ScoreCalculationPage() {
  return (
    <section className="px-10 py-10">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[#d9dee8] bg-white p-8 shadow-sm">
        <h1 className="text-5 font-extrabold text-[#1f2a44]">Шалгалтын дүн тооцоолох</h1>
        <p className="mt-2 text-3 text-[#66789f]">
          Таны одоогоор хийсэн дэлгэцүүд энэ хэсэгт байна. Доорх холбоосоор нээж харна.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/teacher/score-calculation/shalgalt"
            className="rounded-2xl border border-[#d9dee8] bg-teal-50 p-5 text-5 font-semibold text-[#2f3c59] hover:border-teal-600"
          >
            Шалгалт
          </Link>
          <Link
            href="/teacher/score-calculation/angi"
            className="rounded-2xl border border-[#d9dee8] bg-teal-50 p-5 text-5 font-semibold text-[#2f3c59] hover:border-teal-600"
          >
            Анги
          </Link>
          <Link
            href="/teacher/score-calculation/statistic"
            className="rounded-2xl border border-[#d9dee8] bg-teal-50 p-5 text-5 font-semibold text-[#2f3c59] hover:border-teal-600"
          >
            Тоон үзүүлэлт
          </Link>
        </div>
      </div>
    </section>
  );
}
