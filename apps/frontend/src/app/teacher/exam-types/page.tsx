import Link from "next/link";

const steps = [
  {
    title: "1. Асуултын сан",
    desc: "Асуулт хайж, чанар харж, шалгалтад сонгоно.",
    href: "/teacher/exam-types/question-bank",
  },
  {
    title: "2. Шалгалт үүсгэгч",
    desc: "Сонгосон асуултаар Variant A/B/C үүсгэнэ.",
    href: "/teacher/exam-types/exam-builder",
  },
  {
    title: "3. Сурагчийн шалгалт",
    desc: "Линкээр нэвтэрч бөглөж илгээх mock урсгал.",
    href: "/teacher/exam-types/student-exam",
  },
  {
    title: "4. Үр дүн ба үнэлгээ",
    desc: "Автомат шалгалт, гар үнэлгээ, тайлан экспорт.",
    href: "/teacher/exam-types/results",
  },
];

export default function ExamTypesHomePage() {
  return (
    <div className="rounded-2xl border border-[#d9e6fb] bg-white p-5 shadow-sm">
      <h2 className="text-6 font-extrabold text-[#1f2a44]">
        End-to-End Exam System
      </h2>
      <p className="mt-2 text-3 text-[#5c6f91]">
        Асуултын сан → Шалгалт үүсгэгч → Сурагчийн шалгалт → Үр дүн гэсэн бүрэн
        урсгалтай MVP демо.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {steps.map((item) => (
          <Link
            className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-4 transition hover:bg-[#eef6ff]"
            href={item.href}
            key={item.href}
          >
            <p className="text-5 font-bold text-[#1f2a44]">{item.title}</p>
            <p className="mt-1 text-3 text-[#5c6f91]">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
