/** @format */

"use client";

import { ArrowLeft, BarChart3, BookOpen, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  getPastExamsForClass,
  type PastExamRow,
  type PastExamStudentScore,
} from "@/app/lib/class-past-exams-mock";
import { store } from "@/app/lib/store";
import ReviewScreen from "./review-screen";
import { useTeacher } from "../teacher-shell";
import { safeExamDateKey } from "./teacher-class-detail-utils";
import { TeacherClassHistoryView } from "./teacher-class-history-view";
import { TeacherClassPastExamStudentPopover } from "./teacher-class-past-exam-student-popover";
import { TeacherClassPendingExamDeliveryFlow } from "./teacher-class-pending-exam-delivery-flow";
import { TeacherClassStudentsView } from "./teacher-class-students-view";

type ClassView = "students" | "history";

export default function TeacherClassDetail({ classId }: { classId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacher = useTeacher();
  const studentNumber = searchParams.get("student");
  const classPath = `/teacher/class/${encodeURIComponent(classId)}`;
  const pendingExamDelivery = useMemo(() => {
    const examId = searchParams.get("deliveryExamId");
    const examTitle = searchParams.get("deliveryExamTitle");
    const deliveryClassId = searchParams.get("deliveryClassId");
    if (!examId || !examTitle || !deliveryClassId) return null;
    return { classId: deliveryClassId, examId, examTitle };
  }, [searchParams]);

  const cls = useMemo(() => store.getClass(classId), [classId]);
  const canAccess = useMemo(
    () => store.getClassesForTeacherWithDemo(teacher.id).some((item) => item.id === classId),
    [teacher.id, classId],
  );
  const students = useMemo(
    () => (canAccess && cls ? store.listStudentsInClass(classId) : []),
    [canAccess, classId, cls],
  );
  const pastExams = useMemo(
    () => (canAccess && cls ? getPastExamsForClass(classId, students) : []),
    [canAccess, classId, cls, students],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ClassView>("students");
  const [historyQuery, setHistoryQuery] = useState("");
  const [expandedPastExamId, setExpandedPastExamId] = useState<string | null>(null);
  const [deliveryFeedback, setDeliveryFeedback] = useState("");
  const [examStudentPopover, setExamStudentPopover] = useState<{ examId: string; studentId: string } | null>(null);

  const selectedStudentExams = useMemo(() => {
    if (!selectedId) return [];
    const items: Array<{ exam: PastExamRow; score: PastExamStudentScore }> = [];
    for (const exam of pastExams) {
      const score = exam.studentScores.find((student) => student.studentId === selectedId);
      if (score) items.push({ exam, score });
    }
    return items.sort((a, b) => safeExamDateKey(b.exam.date).localeCompare(safeExamDateKey(a.exam.date)));
  }, [pastExams, selectedId]);

  const filteredPastExams = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();
    if (!query) return pastExams;
    return pastExams.filter((exam) =>
      exam.subject.toLowerCase().includes(query)
      || exam.examTitle.toLowerCase().includes(query)
      || safeExamDateKey(exam.date).toLowerCase().includes(query)
      || `${exam.maxScore}`.includes(query)
      || exam.studentScores.some((student) =>
        student.studentNumber.toLowerCase().includes(query)
        || `${student.firstName} ${student.lastName}`.toLowerCase().includes(query)
        || `${student.lastName} ${student.firstName}`.toLowerCase().includes(query),
      ),
    );
  }, [historyQuery, pastExams]);

  const examStudentPopoverResolved = useMemo(() => {
    if (!examStudentPopover) return null;
    const exam = filteredPastExams.find((item) => item.id === examStudentPopover.examId);
    const student = exam?.studentScores.find((item) => item.studentId === examStudentPopover.studentId);
    return exam && student ? { exam, student } : null;
  }, [examStudentPopover, filteredPastExams]);

  if (!canAccess || !cls) {
    return (
      <section className="px-4 py-10 sm:px-10">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#d9dee8] bg-white p-8 text-center shadow-sm">
          <p className="text-4 font-semibold text-[#122459]">Энэ ангид хандах эрхгүй эсвэл анги олдсонгүй.</p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4f9dff] px-5 py-2.5 text-4 font-semibold text-white transition hover:bg-[#3f8ff5]" onClick={() => router.push("/teacher")} type="button">
            <ArrowLeft className="h-5 w-5" />Нүүр хуудас
          </button>
        </div>
      </section>
    );
  }

  if (studentNumber) return <ReviewScreen onBack={() => router.push(classPath)} studentCode={studentNumber} />;

  return (
    <section className="px-4 py-6 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl bg-white p-4 sm:p-6">
          <button className="inline-flex items-center gap-2 text-4 font-semibold text-[#122459] transition-colors hover:text-[#122459]" onClick={() => router.push("/teacher")} type="button">
            <ArrowLeft className="h-5 w-5" />Нүүр Хуудас Руу Буцах
          </button>
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#7DC8FF] bg-[#EDF6FF] text-[#122459]"><BookOpen className="h-6 w-6" /></div>
            <div>
              <h1 className="text-5 font-extrabold text-[#122459]">{cls.name}</h1>
              <p className="mt-2 text-3 text-[#122459]">Мөр дарахад нэрний доор өмнөх шалгалтын дүн нээгдэнэ. Дахин дархад хаагдана.</p>
            </div>
          </div>
        </div>

        {deliveryFeedback ? <div className={`rounded-2xl border px-5 py-4 text-sm font-medium ${deliveryFeedback.includes("дор хаяж") ? "border-[#ffd7d7] bg-[#fff5f5] text-[#122459]" : "border-[#cfe0fb] bg-[#eef6ff] text-[#122459]"}`}>{deliveryFeedback}</div> : null}
        {pendingExamDelivery ? <TeacherClassPendingExamDeliveryFlow classId={pendingExamDelivery.classId} className={cls.name} classPath={classPath} examId={pendingExamDelivery.examId} examTitle={pendingExamDelivery.examTitle} onComplete={setDeliveryFeedback} students={students} /> : null}

        <div className="flex flex-wrap justify-center gap-3 rounded-2xl bg-[#EDF6FF] p-2 sm:gap-6" role="tablist">
          <button aria-selected={activeView === "students"} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[200px] ${activeView === "students" ? "border-[#7DC8FF] bg-[#cfe4ff] text-[#122459]" : "border-transparent text-[#122459] hover:border-[#d9dee8] hover:bg-[#EDF6FF]"}`} onClick={() => { setExamStudentPopover(null); setActiveView("students"); }} role="tab" type="button">
            <Users className="h-5 w-5 shrink-0 text-[#122459]" />Сурагчид
          </button>
          <button aria-selected={activeView === "history"} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[200px] ${activeView === "history" ? "border-[#7DC8FF] bg-[#cfe4ff] text-[#122459]" : "border-transparent text-[#122459] hover:border-[#d9dee8] hover:bg-[#EDF6FF]"}`} onClick={() => setActiveView("history")} role="tab" type="button">
            <BarChart3 className="h-5 w-5 shrink-0 text-[#122459]" />Шалгалтын статистик
          </button>
        </div>

        {activeView === "students" ? (
          <TeacherClassStudentsView
            className={cls.name}
            selectedId={selectedId}
            selectedStudentExams={selectedStudentExams}
            setSelectedId={setSelectedId}
            students={students}
          />
        ) : (
          <TeacherClassHistoryView
            className={cls.name}
            examStudentPopoverResolved={examStudentPopoverResolved}
            expandedPastExamId={expandedPastExamId}
            filteredPastExams={filteredPastExams}
            historyQuery={historyQuery}
            onHistoryQueryChange={(value) => {
              setExamStudentPopover(null);
              setHistoryQuery(value);
            }}
            onToggleExam={(examId) =>
              setExpandedPastExamId((current) => {
                if (current === examId) {
                  setExamStudentPopover((popover) => (popover?.examId === examId ? null : popover));
                  return null;
                }
                setExamStudentPopover(null);
                return examId;
              })
            }
            onToggleExamStudentPopover={(examId, studentId) =>
              setExamStudentPopover((current) =>
                current?.examId === examId && current?.studentId === studentId ? null : { examId, studentId },
              )
            }
          />
        )}
      </div>

      {examStudentPopoverResolved ? (
        <TeacherClassPastExamStudentPopover
          classLabel={cls.name}
          exam={examStudentPopoverResolved.exam}
          onClose={() => setExamStudentPopover(null)}
          student={examStudentPopoverResolved.student}
        />
      ) : null}
    </section>
  );
}
