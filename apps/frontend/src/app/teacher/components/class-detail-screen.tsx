"use client";

import { useRouter } from "next/navigation";
import { Users, Plus, FileText, ArrowLeft } from "lucide-react";

const CLASSES_DATA: Record<
  string,
  { name: string; subject: string; studentCount: number; students: { code: string; name: string }[] }
> = {
  "10A": {
    name: "10А",
    subject: "Нийгэм",
    studentCount: 5,
    students: [
      { code: "10A-001", name: "Бат-Эрдэнэ" },
      { code: "10A-002", name: "Сарнай" },
      { code: "10A-003", name: "Ганболд" },
      { code: "10A-004", name: "Нандин-Эрдэнэ" },
      { code: "10A-005", name: "Эрдэнэбат" },
    ],
  },
  "9B": {
    name: "9Б",
    subject: "Нийгэм",
    studentCount: 4,
    students: [
      { code: "9B-001", name: "Болд" },
      { code: "9B-002", name: "Сарнай" },
      { code: "9B-003", name: "Даваа" },
      { code: "9B-004", name: "Оюун" },
    ],
  },
};

type ClassDetailScreenProps = {
  classId: string;
  onBack?: () => void;
};

export default function ClassDetailScreen({ classId, onBack }: ClassDetailScreenProps) {
  const router = useRouter();
  const cls = CLASSES_DATA[classId];

  if (!cls) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-4 text-[#64748b]">Анги олдсонгүй.</p>
        <button
          onClick={() => router.push("/teacher/angi")}
          className="mt-4 text-4 font-semibold text-teal-600 hover:underline"
        >
          Буцах
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <button
        onClick={() => router.push("/teacher/angi")}
        className="inline-flex items-center gap-2 text-4 font-semibold text-teal-600 hover:underline"
        type="button"
      >
        <ArrowLeft className="h-5 w-5" />
        Буцах
      </button>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4 font-extrabold text-[#1f2a44]">Миний ангиуд</h1>
          <p className="text-4 text-[#64748b]">Үүсгэсэн ангиуд, сурагчдын жагсаалт</p>
        </div>
        {/* <button
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-4 font-semibold text-white transition hover:bg-teal-700"
          type="button"
        >
          <Plus className="h-5 w-5" />
          Анги нэмэх
        </button> */}
      </div>

      <section className="rounded-xl border border-[#d9dee8] bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#1f2a44]">{cls.name}</h2>
              <p className="text-4 text-[#64748b]">
                {cls.subject} · {cls.studentCount} сурагч
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-xl border border-[#d9dee8] bg-white px-4 py-2.5 text-4 font-semibold text-teal-600 transition hover:bg-[#f8fafc]"
              type="button"
            >
              Шалгалт үүсгэх
            </button>
            <button
              className="rounded-xl border border-[#d9dee8] bg-white px-4 py-2.5 text-4 font-semibold text-teal-600 transition hover:bg-[#f8fafc]"
              type="button"
            >
              Сурагч нэмэх
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="py-3 text-left text-4 font-semibold text-[#64748b]">Код</th>
                <th className="py-3 text-left text-4 font-semibold text-[#64748b]">Нэр</th>
                <th className="py-3 text-left text-4 font-semibold text-[#64748b]">Шалгалт</th>
              </tr>
            </thead>
            <tbody>
              {cls.students.map((student) => (
                <tr key={student.code} className="border-b border-[#e2e8f0]">
                  <td className="py-3 text-4 text-[#334261]">{student.code}</td>
                  <td className="py-3 text-4 font-semibold text-[#1f2a44]">{student.name}</td>
                  <td className="py-3">
                    <button
                      onClick={() => router.push(`/teacher/shalgalt?student=${student.code}`)}
                      className="text-4 font-semibold text-teal-600 hover:underline"
                      type="button"
                    >
                      Үр дүн харах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-4 font-semibold text-[#1f2a44]">Шалгалтын хариулт оруулах</p>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-[#d9dee8] bg-white px-4 py-3 text-4 font-medium text-[#334261] transition hover:bg-[#f8fafc]"
            type="button"
          >
            <FileText className="h-5 w-5 text-teal-600" />
            Нийгэм — 3-р сар
          </button>
        </div>
      </section>
    </main>
  );
}
