
"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { store } from "@/app/lib/store";
import { useTeacher } from "../teacher-shell";
import ReviewScreen from "../components/review-screen";
import StatsScreen from "../components/stats-screen";
import type { Student } from "@/app/lib/types";

type ActiveTab = "exam" | "class" | "stats";

export default function ScoreCalculationPage() {
  const teacher = useTeacher();

  const [activeTab, setActiveTab] = useState<ActiveTab>("class");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState<string | null>(null);

  const classes = useMemo(
    () => store.getClassesForTeacher(teacher.id),
    [teacher.id],
  );

  const selectedClass = useMemo(() => {
    if (!selectedClassId) return null;
    return classes.find((c) => c.id === selectedClassId) ?? null;
  }, [classes, selectedClassId]);

  const selectedStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return store.listStudentsInClass(selectedClassId);
  }, [selectedClassId]);

  if (activeTab === "class" && selectedStudentNumber) {
    return (
      <ReviewScreen
        studentCode={selectedStudentNumber}
        onBack={() => setSelectedStudentNumber(null)}
      />
    );
  }

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
                setSelectedStudentNumber(null);
              }}
            />
            <TabButton
              label="Тоон үзүүлэлт"
              active={activeTab === "stats"}
              onClick={() => {
                setActiveTab("stats");
                setSelectedClassId(null);
                setSelectedStudentNumber(null);
              }}
            />
          </div>

          <div className="min-w-0 md:col-span-2">
            {activeTab === "stats" && (
              <div className="min-w-0">
                <StatsScreen />
              </div>
            )}

            {activeTab === "class" && (
              <>
                {!selectedClassId && (
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
                      {classes.length ? (
                        classes.map((cls) => (
                          <article
                            key={cls.id}
                            onClick={() => setSelectedClassId(cls.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                setSelectedClassId(cls.id);
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
                  </div>
                )}

                {selectedClassId && selectedClass && (
                  <div className="rounded-2xl border border-[#d9dee8] bg-white p-6">
                    <button
                      type="button"
                      onClick={() => setSelectedClassId(null)}
                      className="inline-flex items-center gap-2 text-4 font-semibold text-teal-600 hover:underline"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Ангиуд руу буцах
                    </button>

                    <div className="mt-4">
                      <h2 className="text-4 font-extrabold text-[#1f2a44]">
                        {selectedClass.name}
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
                              onOpenDetail={() =>
                                setSelectedStudentNumber(student.studentNumber)
                              }
                            />
                          ))}
                        </tbody>
                      </table>
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

function StudentRow({
  student,
  onOpenDetail,
}: {
  student: Student;
  onOpenDetail: () => void;
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
          onClick={onOpenDetail}
          className="text-4 font-semibold text-teal-600 hover:underline"
        >
          Үр дүн харах
        </button>
      </td>
    </tr>
  );
}
