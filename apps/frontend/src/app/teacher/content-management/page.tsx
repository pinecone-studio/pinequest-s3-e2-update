"use client";

import { useMemo, useState } from "react";
import { initialExams, teacherClasses } from "./mock-data";
import type { Exam, ExamVariant, Question, SentExam, TabKey } from "./types";
import {
  createExamFromForm,
  createSentExam,
  duplicateExam,
  generateVariantQuestions,
  parseExamLink,
  questionTypeLabel,
} from "./utils";
import { CreateExamForm } from "./components/create-exam-form";
import { EditExamModal } from "./components/edit-exam-modal";
import { ModuleHeader } from "./components/module-header";
import { SavedExamsList } from "./components/saved-exams-list";
import { SendExamModal } from "./components/send-exam-modal";
import { StudentExamPage } from "./components/student-exam-page";
import { TabSwitcher } from "./components/tab-switcher";

export default function ContentManagementPage() {
  const [tab, setTab] = useState<TabKey>("saved");
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [sentExams, setSentExams] = useState<SentExam[]>([]);
  const [viewExam, setViewExam] = useState<Exam | null>(null);
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [sendExam, setSendExam] = useState<Exam | null>(null);
  const [studentLinkInput, setStudentLinkInput] = useState("");
  const [studentExamId, setStudentExamId] = useState<string | null>(null);
  const [studentClassId, setStudentClassId] = useState<string | null>(null);
  const [studentVariant, setStudentVariant] = useState<ExamVariant>("A");
  const [toast, setToast] = useState("");

  const activeStudentExam = useMemo(
    () => exams.find((item) => item.id === studentExamId) ?? null,
    [exams, studentExamId],
  );

  const activeStudentClass = useMemo(
    () => teacherClasses.find((item) => item.id === studentClassId) ?? null,
    [studentClassId],
  );

  const activeStudentExamWithVariant = useMemo(() => {
    if (!activeStudentExam) return null;
    return {
      ...activeStudentExam,
      questions: generateVariantQuestions(activeStudentExam.questions, studentVariant),
      title: `${activeStudentExam.title} (Хувилбар ${studentVariant})`,
    };
  }, [activeStudentExam, studentVariant]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const saveNewExam = (payload: {
    title: string;
    subject: string;
    grade: string;
    duration: number;
    questions: Question[];
  }) => {
    const nextExam = createExamFromForm(payload);
    setExams((prev) => [nextExam, ...prev]);
    setTab("saved");
    showToast("Шинэ шалгалт амжилттай хадгалагдлаа.");
  };

  const removeExam = (exam: Exam) => {
    setExams((prev) => prev.filter((item) => item.id !== exam.id));
    showToast("Шалгалт устгагдлаа.");
  };

  const duplicateOneExam = (exam: Exam) => {
    const next = duplicateExam(exam);
    setExams((prev) => [next, ...prev]);
    showToast("Шалгалтын хуулбар үүсгэлээ.");
  };

  const saveEditedExam = (nextExam: Exam) => {
    setExams((prev) => prev.map((item) => (item.id === nextExam.id ? nextExam : item)));
    setEditExam(null);
    showToast("Шалгалтын мэдээлэл шинэчлэгдлээ.");
  };

  const sendToClass = (classId: string, variant: ExamVariant, link: string) => {
    if (!sendExam) return;
    const sent = createSentExam(sendExam.id, classId, variant, link);
    setSentExams((prev) => [sent, ...prev]);
    setExams((prev) =>
      prev.map((item) => (item.id === sendExam.id ? { ...item, status: "sent" } : item)),
    );
    setSendExam(null);
    showToast("Шалгалтыг анги руу илгээлээ.");
  };

  const openStudentViewByLink = (link: string) => {
    const parsed = parseExamLink(link || studentLinkInput);
    if (!parsed) {
      showToast("Линк буруу байна. exam болон class параметр шаардлагатай.");
      return;
    }

    const targetExam = exams.find((item) => item.id === parsed.examId);
    const targetClass = teacherClasses.find((item) => item.id === parsed.classId);

    if (!targetExam || !targetClass) {
      showToast("Линк доторх шалгалт эсвэл анги олдсонгүй.");
      return;
    }

    setStudentExamId(parsed.examId);
    setStudentClassId(parsed.classId);
    setStudentVariant(parsed.variant);
    setStudentLinkInput(link || studentLinkInput);
    showToast("Сурагчийн шалгалтын харагдац нээгдлээ.");
  };

  return (
    <main className="mx-auto h-screen w-[1512px] max-w-full space-y-4 overflow-y-auto p-3">
      <ModuleHeader />
      <TabSwitcher onChange={setTab} value={tab} />

      {toast ? (
        <div className="rounded-xl border border-[#4f9dff]/40 bg-[#eef6ff] px-3 py-2 text-2 text-[#2f73c4]">
          {toast}
        </div>
      ) : null}

      {tab === "saved" ? (
        <section className="space-y-3">
          <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
            <h2 className="text-4 font-bold text-[#1f2a44]">Өмнө үүсгэсэн шалгалтууд</h2>
            <p className="text-2 text-[#5c6f91]">
              Харах, засах, устгах, хуулбарлах, анги руу илгээх үйлдлүүд бүгд local state дээр.
            </p>
          </div>

          <SavedExamsList
            exams={exams}
            onDelete={removeExam}
            onDuplicate={duplicateOneExam}
            onEdit={setEditExam}
            onSend={setSendExam}
            onView={setViewExam}
          />

          <section className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
            <h3 className="text-4 font-bold text-[#1f2a44]">Сурагчийн шалгалт нээх (линкээр)</h3>
            <p className="text-2 text-[#5c6f91]">
              Илгээсэн шалгалтын линкийг оруулаад сурагчийн талын дэлгэцийг нээнэ.
            </p>
            <div className="mt-2 flex flex-col gap-2 md:flex-row">
              <input
                className="h-10 w-full rounded-lg border border-[#d9e6fb] px-3 text-2 text-[#1f2a44]"
                onChange={(e) => setStudentLinkInput(e.target.value)}
                placeholder="/teacher/content-management?exam=exam-101&class=c-8a"
                value={studentLinkInput}
              />
              <button
                className="rounded-lg bg-[#4f9dff] px-4 py-2 text-2 font-semibold text-white"
                onClick={() => openStudentViewByLink("")}
                type="button"
              >
                Шалгалт нээх
              </button>
            </div>
          </section>

          {sentExams.length > 0 ? (
            <section className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
              <h3 className="text-4 font-bold text-[#1f2a44]">Илгээсэн түүх</h3>
              <div className="mt-2 space-y-2">
                {sentExams.map((item) => {
                  const targetExam = exams.find((exam) => exam.id === item.examId);
                  const targetClass = teacherClasses.find((klass) => klass.id === item.classId);
                  return (
                    <div
                      className="rounded-lg border border-[#d9e6fb] bg-[#f7fbff] p-2"
                      key={item.id}
                    >
                      <p className="text-2 text-[#1f2a44]">
                        {targetExam?.title ?? "Тодорхойгүй шалгалт"} →{" "}
                        {targetClass?.name ?? "Тодорхойгүй анги"}
                      </p>
                      <p className="text-2 text-[#5c6f91]">
                        {item.sentAt} · Хувилбар {item.variant} · {item.link}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </section>
      ) : (
        <CreateExamForm onSave={saveNewExam} />
      )}

      {viewExam ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-3">
          <section className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-4 font-bold text-[#1f2a44]">{viewExam.title}</h3>
                <p className="text-2 text-[#5c6f91]">
                  {viewExam.subject} · {viewExam.grade} · {viewExam.duration} минут
                </p>
              </div>
              <button
                className="rounded-lg border border-[#d9e6fb] px-2 py-1 text-2 text-[#5c6f91]"
                onClick={() => setViewExam(null)}
                type="button"
              >
                Хаах
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {viewExam.questions.map((q, index) => (
                <div className="rounded-lg border border-[#d9e6fb] bg-[#f7fbff] p-3" key={q.id}>
                  <p className="text-4 font-bold text-[#1f2a44]">
                    {index + 1}. {q.text}
                  </p>
                  <p className="text-2 text-[#5c6f91]">
                    {questionTypeLabel(q.type)} · Оноо: {q.score}
                  </p>
                  {q.type === "multiple_choice" ? (
                    <ul className="mt-1 list-inside list-disc text-2 text-[#1f2a44]">
                      {q.options.map((opt) => (
                        <li key={opt}>{opt}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      <EditExamModal exam={editExam} onClose={() => setEditExam(null)} onSave={saveEditedExam} open={Boolean(editExam)} />

      <SendExamModal
        classes={teacherClasses}
        exam={sendExam}
        onClose={() => setSendExam(null)}
        onOpenStudentView={openStudentViewByLink}
        onSend={sendToClass}
        open={Boolean(sendExam)}
      />

      {activeStudentExamWithVariant ? (
        <StudentExamPage
          exam={activeStudentExamWithVariant}
          key={
            activeStudentExamWithVariant.id +
            "-" +
            (studentClassId ?? "none") +
            "-" +
            studentVariant
          }
          onClose={() => {
            setStudentExamId(null);
            setStudentClassId(null);
          }}
          studentClass={activeStudentClass}
        />
      ) : null}
    </main>
  );
}
