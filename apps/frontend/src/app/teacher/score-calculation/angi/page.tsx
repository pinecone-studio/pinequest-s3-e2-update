"use client";

import { ArrowLeft, Users } from "lucide-react";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { store } from "@/app/lib/store";
import { useTeacher } from "../../teacher-shell";
import ReviewScreen from "../../components/review-screen";
import type { Student } from "@/app/lib/types";

export default function ScoreCalculationAngiPage() {
  const teacher = useTeacher();
  const router = useRouter();
  const searchParams = useSearchParams();

  const classId = searchParams.get("class");
  const studentNumber = searchParams.get("student");

  const classes = useMemo(
    () => store.getClassesForTeacher(teacher.id),
    [teacher.id],
  );

  const selectedStudents = useMemo(() => {
    if (!classId) return [];
    return store.listStudentsInClass(classId);
  }, [classId]);

  const backToClassList = () => {
    router.push("/teacher/score-calculation/angi");
  };

  if (classId && studentNumber) {
    return (
      <ReviewScreen
        studentCode={studentNumber}
        onBack={() =>
          router.push(
            `/teacher/score-calculation/angi?class=${encodeURIComponent(classId)}`,
          )
        }
      />
    );
  }

  return (
    <section className="px-10 py-10">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[#d9dee8] bg-white p-8 shadow-sm">
        <h1 className="text-5 font-extrabold text-[#1f2a44]">
          Ангиудын дүн (Шалгалтын тохиргоо)
        </h1>
        <p className="mt-2 text-3 text-[#66789f]">
          Анги сонгоод сурагчийн үр дүнгийн detail-г хараарай.
        </p>

        {!classId && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {classes.length ? (
              classes.map((cls) => (
                <article
                  key={cls.id}
                  onClick={() =>
                    router.push(
                      `/teacher/score-calculation/angi?class=${encodeURIComponent(cls.id)}`,
                    )
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(
                        `/teacher/score-calculation/angi?class=${encodeURIComponent(cls.id)}`,
                      );
                    }
                  }}
                  className="flex cursor-pointer flex-col gap-3 rounded-xl border border-[#e2e8f0] p-4 transition hover:border-teal-600/40 hover:bg-[#f8fafc]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-4 font-extrabold text-[#1f2a44]">
                        {cls.name}
                      </p>
                      <p className="text-4 text-[#64748b]">
                        {cls.studentIds.length} сурагч
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-[#d9dee8] bg-white p-6 text-4 text-[#66789f]">
                Одоогоор танд анги олдсонгүй.
              </div>
            )}
          </div>
        )}

        {classId && (
          <div className="mt-6 rounded-2xl border border-[#d9dee8] bg-white p-6">
            <button
              type="button"
              onClick={backToClassList}
              className="inline-flex items-center gap-2 text-4 font-semibold text-teal-600 hover:underline"
            >
              <ArrowLeft className="h-5 w-5" />
              Ангиуд руу буцах
            </button>

            <div className="mt-4">
              <h2 className="text-4 font-extrabold text-[#1f2a44]">
                {classes.find((c) => c.id === classId)?.name ?? classId}
              </h2>
              <p className="text-4 text-[#64748b]">
                {selectedStudents.length} сурагч
              </p>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="py-3 text-left text-4 font-semibold text-[#64748b]">
                      Код
                    </th>
                    <th className="py-3 text-left text-4 font-semibold text-[#64748b]">
                      Нэр
                    </th>
                    <th className="py-3 text-left text-4 font-semibold text-[#64748b]">
                      Дүн
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudents.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      classId={classId}
                      onOpenDetail={(code) =>
                        router.push(
                          `/teacher/score-calculation/angi?class=${encodeURIComponent(classId)}&student=${encodeURIComponent(code)}`,
                        )
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StudentRow({
  student,
  classId: _classId,
  onOpenDetail,
}: {
  student: Student;
  classId: string;
  onOpenDetail: (studentNumber: string) => void;
}) {
  return (
    <tr className="border-b border-[#e2e8f0]">
      <td className="py-3 text-4 text-[#334261]">{student.studentNumber}</td>
      <td className="py-3 text-4 font-semibold text-[#1f2a44]">
        {student.firstName} {student.lastName}
      </td>
      <td className="py-3">
        <button
          type="button"
          onClick={() => onOpenDetail(student.studentNumber)}
          className="text-4 font-semibold text-teal-600 hover:underline"
        >
          Үр дүн харах
        </button>
      </td>
    </tr>
  );
}

