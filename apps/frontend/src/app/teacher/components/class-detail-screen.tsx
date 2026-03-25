"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Users } from "lucide-react";
import { store } from "@/app/lib/store";

type ClassDetailScreenProps = {
  classId: string;
  onBack?: () => void;
};

export default function ClassDetailScreen({ classId, onBack }: ClassDetailScreenProps) {
  const router = useRouter();
  const cls = store.getClass(classId);
  const students = store.listStudentsInClass(classId);

  if (!cls) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-4 text-[#64748b]">Анги олдсонгүй.</p>
        <button
          onClick={() => router.push("/teacher/score-calculation/angi")}
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
        onClick={() => router.push("/teacher/score-calculation/angi")}
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
                {cls.studentIds.length} сурагч
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
              {students.map((student) => (
                <tr key={student.id} className="border-b border-[#e2e8f0]">
                  <td className="py-3 text-4 text-[#334261]">
                    {student.studentNumber}
                  </td>
                  <td className="py-3 text-4 font-semibold text-[#1f2a44]">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() =>
                        router.push(
                          `/teacher/shalgalt?student=${encodeURIComponent(
                            student.studentNumber,
                          )}`,
                        )
                      }
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
          <p className="mb-3 text-4 font-semibold text-[#1f2a44]">
            Шалгалтын хариулт оруулах
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-[#d9dee8] bg-white px-4 py-3 text-4 font-medium text-[#334261] transition hover:bg-[#f8fafc]"
            type="button"
          >
            <FileText className="h-5 w-5 text-teal-600" />
            {cls.name} — хариулт оруулах
          </button>
        </div>
      </section>
    </main>
  );
}
