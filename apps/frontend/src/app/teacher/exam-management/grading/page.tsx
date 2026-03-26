"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { TeacherExamWizardShell } from "../_components/wizard/TeacherExamWizardShell";
import { Button } from "../_components/ui/Button";
import { Card } from "../_components/ui/Card";
import { StatusBadge } from "../_components/ui/StatusBadge";
import type { ExamTemplate, StudentAnswer, StudentSubmission } from "../_lib/types";
import { autoGradeSubmission, buildFinalScore } from "../_lib/engine";
import { getDeliveryById, getSubmissions, getTemplateById, upsertSubmissions } from "../_lib/storage";
import { store } from "../../../lib/store";

type TabKey = "all" | "submitted" | "auto_graded" | "pending_manual" | "completed";

function tabMatches(s: StudentSubmission, tab: TabKey) {
  if (tab === "all") return true;
  if (tab === "submitted") return s.status === "submitted";
  if (tab === "auto_graded") return s.autoTotalCount > 0;
  if (tab === "pending_manual") {
    return Object.values(s.manualByQuestionId).some((x) => x.status === "pending" || x.score == null);
  }
  if (tab === "completed") return s.teacherStatus === "published" && s.finalScore != null;
  return true;
}

function countPendingManual(s: StudentSubmission) {
  return Object.values(s.manualByQuestionId).filter((x) => x.status === "pending" || x.score == null).length;
}

function studentDisplayName(s: { firstName: string; lastName: string }) {
  return `${s.firstName} ${s.lastName}`;
}

export default function TeacherGradingDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") ?? "";
  const deliveryId = searchParams.get("deliveryId") ?? "";

  const [template, setTemplate] = useState<ExamTemplate | null>(null);
  const [deliveryClassId, setDeliveryClassId] = useState<string>("");
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [tab, setTab] = useState<TabKey>("all");

  useEffect(() => {
    if (!templateId || !deliveryId) return;
    const t = getTemplateById(templateId);
    const d = getDeliveryById(deliveryId);
    setTemplate(t);
    setDeliveryClassId(d?.classId ?? "");
    setSubmissions(getSubmissions(deliveryId));
  }, [templateId, deliveryId]);

  const students = useMemo(() => {
    if (!deliveryClassId) return [];
    return store.listStudentsInClass(deliveryClassId);
  }, [deliveryClassId]);

  const byStudent = useMemo(() => {
    const map = new Map<string, StudentSubmission>();
    for (const s of submissions) map.set(s.studentId, s);
    return map;
  }, [submissions]);

  const rows = useMemo(() => {
    const list = students
      .map((st) => byStudent.get(st.id))
      .filter(Boolean) as StudentSubmission[];
    return list.filter((s) => tabMatches(s, tab));
  }, [students, byStudent, tab]);

  const pendingCount = useMemo(() => submissions.filter((s) => countPendingManual(s) > 0).length, [submissions]);

  const generateMockSubmissions = () => {
    if (!template || !deliveryId) return;
    const studentIds = students.map((s) => s.id);
    const next: StudentSubmission[] = studentIds.map((sid) => {
      const answersByQuestionId: StudentSubmission["answersByQuestionId"] = {};

      // Generate answers for auto-gradable questions.
      for (const q of template.questions) {
        if (q.type === "multiple_choice" || q.type === "true_false") {
          const correct = q.correctChoiceId;
          if (!correct) continue;
          const chooseCorrect = Math.random() > 0.35; // demo probability
          const pick =
            chooseCorrect
              ? correct
              : q.choices.find((c) => c.id !== correct)?.id ?? correct;
          answersByQuestionId[q.id] = { type: q.type, selectedChoiceId: pick };
        } else {
          const response = q.type === "short_answer" ? "Дэмо богино хариултын хариу." : "Дэмо эсээний хариу.";
          answersByQuestionId[q.id] = { type: q.type, text: response };
        }
      }

      const baseManual = Object.fromEntries(
        template.questions
          .filter((q) => q.type === "short_answer" || q.type === "essay")
          .map((q) => [
            q.id,
            { score: null, feedback: "", status: "pending" as const },
          ]),
      ) as StudentSubmission["manualByQuestionId"];

      const tempSub: StudentSubmission = {
        id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        deliveryId,
        templateId: template.id,
        studentId: sid,
        startedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        submittedAt: new Date().toISOString(),
        status: "submitted",
        answersByQuestionId,
        autoScore: 0,
        autoCorrectCount: 0,
        autoTotalCount: 0,
        manualByQuestionId: baseManual,
        finalScore: null,
        teacherStatus: "pending",
        teacherNote: "",
      };

      const auto = autoGradeSubmission({ template, submission: tempSub });
      tempSub.autoScore = auto.autoScore;
      tempSub.autoCorrectCount = auto.autoCorrectCount;
      tempSub.autoTotalCount = auto.autoTotalCount;
      tempSub.finalScore = null;
      return tempSub;
    });

    upsertSubmissions(deliveryId, next);
    setSubmissions(next);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "Бүгд" },
    { key: "submitted", label: "Илгээсэн" },
    { key: "auto_graded", label: "Автоматаар үнэлсэн" },
    { key: "pending_manual", label: "Гарын үнэлгээ хүлээгдэж буй" },
    { key: "completed", label: "Дууссан" },
  ];

  return (
    <TeacherExamWizardShell
      step="send"
      title="Багшийн үнэлгээний самбар"
      subtitle="Автоматаар үнэлсэн хэсгүүдийг гарын үнэлгээ шаардлагатай асуултуудаас тод ялгана. Үнэлгээ анхны id-д зураглагдана."
      rightSlot={<div className="text-sm font-extrabold text-[#5c6f91]">Хүлээгдэж буй: {pendingCount}</div>}
    >
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-extrabold text-[#1f2a44]">{template?.title ?? "Шалгалт"}</p>
              <p className="mt-1 text-sm text-[#5c6f91]">Илгээд: {deliveryId.slice(-6)} · Сурагчид: {rows.length}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={generateMockSubmissions}>
                <RefreshCw className="h-4 w-4" /> Дэмо илгээдүүд үүсгэх
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={[
                  "h-9 rounded-xl border px-3 text-sm font-extrabold transition",
                  tab === t.key ? "border-primary bg-[#eef6ff] text-primary" : "border-[#d9e6fb] bg-white text-[#1f2a44] hover:bg-[#f7fbff]",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="bg-[#f7fbff] px-4 py-3">
            <p className="text-sm font-extrabold text-[#1f2a44]">Илгээдүүд</p>
            <p className="mt-1 text-sm text-[#5c6f91]">Авто оноо + гарын үнэлгээ хүлээгдэж буй тоо</p>
          </div>
          <div className="divide-y divide-[#e6edf8]">
            {rows.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm font-extrabold text-[#5c6f91]">Энэ шүүлтүүртэй таарах илгээдүүд олдсонгүй.</p>
              </div>
            ) : (
              rows.map((s) => {
                const st = students.find((x) => x.id === s.studentId);
                const pendingManual = countPendingManual(s);
                const isCompleted = s.teacherStatus === "published" && s.finalScore != null;
                return (
                  <div key={s.id} className="px-4 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-[#1f2a44]">{studentDisplayName(st ?? { firstName: "—", lastName: "" })}</p>
                        <p className="mt-1 text-sm text-[#5c6f91]">{st?.id ?? s.studentId}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[#d9e6fb] bg-white px-3 py-1 text-xs font-extrabold text-[#5c6f91]">
                            {s.status === "submitted" ? "Илгээсэн" : "Эхэлсэн"}
                          </span>
                          {pendingManual > 0 ? (
                            <span className="rounded-full border border-[#ffe9ad] bg-[#fff3c8] px-3 py-1 text-xs font-extrabold text-[#8b6800]">
                              Гарын үнэлгээ хүлээгдэж байна: {pendingManual}
                            </span>
                          ) : (
                            <span className="rounded-full border border-[#c6f7d0] bg-[#ecf9f0] px-3 py-1 text-xs font-extrabold text-[#198a41]">
                              Гарын үнэлгээ хийгдсэн
                            </span>
                          )}
                          {isCompleted ? (
                            <span className="rounded-full border border-[#c6f7d0] bg-[#ecf9f0] px-3 py-1 text-xs font-extrabold text-[#198a41]">
                              Нийтлэгдсэн
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:grid-cols-6 md:w-[720px]">
                        <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
                          <p className="text-xs font-extrabold text-[#5c6f91]">Эхэлсэн</p>
                          <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{s.startedAt ? new Date(s.startedAt).toLocaleString() : "—"}</p>
                        </div>
                        <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
                          <p className="text-xs font-extrabold text-[#5c6f91]">Илгээсэн</p>
                          <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : "—"}</p>
                        </div>
                        <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
                          <p className="text-xs font-extrabold text-[#5c6f91]">Авто оноо</p>
                          <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{s.autoScore}</p>
                        </div>
                        <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
                          <p className="text-xs font-extrabold text-[#5c6f91]">Эцсийн</p>
                          <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{s.finalScore == null ? "—" : s.finalScore}</p>
                        </div>
                        <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-3 md:col-span-2">
                          <p className="text-xs font-extrabold text-[#5c6f91]">Үнэлгээний статус</p>
                          <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">
                            {s.teacherStatus === "pending"
                              ? "Гарын үнэлгээ хүлээгдэж байна"
                              : s.teacherStatus === "graded"
                                ? "Гарын үнэлгээ хийгдсэн"
                                : "Нийтлэгдсэн"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:justify-end md:w-full">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => router.push(`/teacher/exam-management/grading/student?deliveryId=${deliveryId}&templateId=${template?.id}&studentId=${s.studentId}`)}
                        >
                          <Eye className="h-4 w-4" /> Үнэлэх
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </TeacherExamWizardShell>
  );
}

