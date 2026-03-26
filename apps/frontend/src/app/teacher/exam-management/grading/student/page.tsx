"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, X, Save, PencilLine, Lock, Eye } from "lucide-react";
import type { Delivery, ExamTemplate, StudentSubmission, StudentVersion } from "../../_lib/types";
import { buildDisplayExam, buildFinalScore } from "../../_lib/engine";
import { getDeliveryById, getSubmissions, getTemplateById, updateSubmission } from "../../_lib/storage";
import { store } from "../../../../lib/store";
import { TeacherExamWizardShell } from "../../_components/wizard/TeacherExamWizardShell";
import { Button } from "../../_components/ui/Button";
import { Card } from "../../_components/ui/Card";

type ManualDraft = Record<
  string,
  { score: number | null; feedback: string; status: "pending" | "scored" }
>;

export default function StudentSubmissionReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") ?? "";
  const deliveryId = searchParams.get("deliveryId") ?? "";
  const studentId = searchParams.get("studentId") ?? "";

  const [template, setTemplate] = useState<ExamTemplate | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [submission, setSubmission] = useState<StudentSubmission | null>(null);

  const [version, setVersion] = useState<StudentVersion | null>(null);
  const [displayQuestions, setDisplayQuestions] = useState<ReturnType<typeof buildDisplayExam>>([]);
  const [manualDraft, setManualDraft] = useState<ManualDraft>({});
  const [teacherNote, setTeacherNote] = useState("");

  const student = useMemo(() => {
    if (!delivery) return null;
    const cls = store.getClass(delivery.classId);
    if (!cls) return null;
    return store.listStudentsInClass(cls.id).find((s) => s.id === studentId) ?? null;
  }, [delivery, studentId]);

  useEffect(() => {
    if (!templateId || !deliveryId || !studentId) return;
    const t = getTemplateById(templateId);
    const d = getDeliveryById(deliveryId);
    setTemplate(t);
    setDelivery(d);

    const list = getSubmissions(deliveryId);
    const s = list.find((x) => x.studentId === studentId) ?? null;
    setSubmission(s);
    setTeacherNote(s?.teacherNote ?? "");

    if (d?.studentVersionsByStudentId?.[studentId]) {
      setVersion(d.studentVersionsByStudentId[studentId]);
    }
  }, [templateId, deliveryId, studentId]);

  useEffect(() => {
    if (!template || !delivery || !version) return;
    const rules = delivery.rules;
    const display = buildDisplayExam({ template, rules, version });
    setDisplayQuestions(display);
    const manualDraftInit: ManualDraft = {};
    if (submission) {
      for (const [qid, v] of Object.entries(submission.manualByQuestionId)) {
        manualDraftInit[qid] = { score: v.score, feedback: v.feedback, status: v.status };
      }
    }
    setManualDraft(manualDraftInit);
  }, [template, delivery, version, submission]);

  const autoQuestions = useMemo(() => {
    if (!template) return [];
    return template.questions.filter((q) => q.type === "multiple_choice" || q.type === "true_false");
  }, [template]);

  const manualQuestions = useMemo(() => {
    if (!template) return [];
    return template.questions.filter((q) => q.type === "short_answer" || q.type === "essay");
  }, [template]);

  const canSave = !!submission;

  const teacherStatusLabel =
    submission?.teacherStatus === "pending"
      ? "Хүлээгдэж буй"
      : submission?.teacherStatus === "graded"
        ? "Үнэлэгдсэн"
        : submission?.teacherStatus === "published"
          ? "Нийтлэгдсэн"
          : "";

  const saveGrading = () => {
    if (!delivery || !submission || !template) return;

    const nextManual = { ...submission.manualByQuestionId };
    for (const q of manualQuestions) {
      const draft = manualDraft[q.id];
      if (!draft) continue;
      nextManual[q.id] = { score: draft.score, feedback: draft.feedback, status: draft.score == null ? "pending" : "scored" };
    }

    const nextSub: StudentSubmission = {
      ...submission,
      manualByQuestionId: nextManual,
      teacherNote,
    };

    const nextFinal = buildFinalScore(nextSub);
    nextSub.finalScore = nextFinal;
    nextSub.teacherStatus = nextFinal == null ? "graded" : "graded";

    updateSubmission(deliveryId, submission.id, {
      manualByQuestionId: nextManual,
      teacherNote,
      finalScore: nextFinal,
      teacherStatus: nextFinal == null ? "graded" : "graded",
    });
    setSubmission((prev) => (prev ? { ...prev, manualByQuestionId: nextManual, teacherNote, finalScore: nextFinal, teacherStatus: "graded" } : prev));
  };

  const publish = () => {
    if (!delivery || !submission) return;
    const final = buildFinalScore({ ...submission, manualByQuestionId: Object.fromEntries(Object.entries(manualDraft).map(([qid, d]) => [qid, d])) });
    if (final == null) {
      alert("Please score all manual questions before publishing.");
      return;
    }
    updateSubmission(deliveryId, submission.id, { teacherStatus: "published", finalScore: final });
    setSubmission((prev) => (prev ? { ...prev, teacherStatus: "published", finalScore: final } : prev));
  };

  const renderAutoChoiceLetter = (choiceId: string, qId: string) => {
    if (!version) return null;
    const order = version.displayChoiceOrderByQuestionId[qId];
    if (!order) return null;
    const idx = order.indexOf(choiceId);
    if (idx < 0) return null;
    return String.fromCharCode(65 + idx);
  };

  if (!template || !delivery || !submission) {
    return (
      <TeacherExamWizardShell step="send" title="Сурагчийн илгээд">
        <Card className="p-10">
          <p className="text-sm font-extrabold text-[#5c6f91]">Ачаалж байна…</p>
        </Card>
      </TeacherExamWizardShell>
    );
  }

  return (
    <TeacherExamWizardShell
      step="send"
      title="Сурагчийн илгээдийг хянан шалгах"
      subtitle="Сурагчид оноогдсон хувилбарыг (асуултын дараалал + сонголтын дараалал) харж, анхны id-үүдээр нь үнэн зөв оноо өгнө."
      rightSlot={<div className="text-sm font-extrabold text-[#5c6f91]">{teacherStatusLabel}</div>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-5">
              <p className="text-sm font-extrabold text-[#1f2a44]">Сурагч</p>
              <div className="mt-3 rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-4">
                <p className="text-sm font-extrabold text-[#1f2a44]">{student ? `${student.firstName} ${student.lastName}` : studentId}</p>
                <p className="mt-1 text-sm text-[#5c6f91]">Сурагчийн id: {studentId}</p>
              </div>
              <div className="mt-3 rounded-2xl border border-[#d9e6fb] bg-white p-4">
                <p className="text-sm font-extrabold text-[#1f2a44]">Хувилбарын лавлагаа</p>
                <p className="mt-1 text-sm text-[#5c6f91]">
                  {delivery.rules.strategy === "limited_shared_variants"
                    ? `Хувилбарын багц: ${version?.variantLabel ?? "—"}`
                    : "Сурагч бүрт өөр"}
                </p>
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-extrabold text-[#1f2a44]">Шалгалт</p>
              <div className="mt-3 rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-4">
                <p className="text-sm font-extrabold text-[#1f2a44]">{template.title}</p>
                <p className="mt-1 text-sm text-[#5c6f91]">
                  {template.subject} · {template.questions.length} асуулт · {template.durationMinutes} мин
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#1f2a44]">Автоматаар үнэлэгдэх</p>
                <p className="mt-1 text-sm text-[#5c6f91]">
                  Олон сонголт ба үнэн/худал асуултуудыг сонголтын id-ээр автоматаар үнэлнэ.
                </p>
                </div>
                <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] px-4 py-2">
                <p className="text-xs font-extrabold text-[#5c6f91]">Авто оноо</p>
                  <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{submission.autoScore}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {autoQuestions.map((q) => {
                  const ans = submission.answersByQuestionId[q.id];
                  const selectedChoiceId = ans && (ans.type === "multiple_choice" || ans.type === "true_false") ? ans.selectedChoiceId : null;
                  const correctChoiceId = q.correctChoiceId;
                  const correctChoice = q.choices.find((c) => c.id === correctChoiceId);
                  const selectedChoice = selectedChoiceId ? q.choices.find((c) => c.id === selectedChoiceId) : null;

                  const isCorrect = selectedChoiceId && correctChoiceId ? selectedChoiceId === correctChoiceId : false;
                  const badgeTone = selectedChoiceId && correctChoiceId ? (isCorrect ? "border-[#c6f7d0] bg-[#ecf9f0] text-[#198a41]" : "border-[#ff6b6b]/40 bg-[#ff6b6b]/10 text-[#b64747]") : "border-[#e2e8f0] bg-white text-[#66708a]";
                  const letter = selectedChoiceId ? renderAutoChoiceLetter(selectedChoiceId, q.id) : null;
                  return (
                    <Card key={q.id} className="p-4 shadow-none">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold text-[#1f2a44]">{q.text}</p>
                          <p className="mt-1 text-sm text-[#5c6f91]">
                            Сурагчийн сонгосон:{" "}
                            <span className="font-extrabold text-[#1f2a44]">
                              {selectedChoice ? `${letter ? `${letter}: ` : ""}${selectedChoice.text}` : "—"}
                            </span>
                          </p>
                          <p className="mt-1 text-sm text-[#5c6f91]">
                            Зөв: <span className="font-extrabold text-primary">{correctChoice?.text ?? "—"}</span>
                          </p>
                        </div>
                        <div className={`rounded-2xl border px-3 py-2 text-sm font-extrabold ${badgeTone}`}>
                          {selectedChoiceId ? (isCorrect ? "Зөв" : "Буруу") : "Хариулаагүй"}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#1f2a44]">Гарын үнэлгээ</p>
                  <p className="mt-1 text-sm text-[#5c6f91]">Багш богино хариулт болон эсээ асуултуудад оноо өгнө.</p>
                </div>
                <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] px-4 py-2">
                  <p className="text-xs font-extrabold text-[#5c6f91]">Эцсийн оноо</p>
                  <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{submission.finalScore == null ? "—" : submission.finalScore}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {manualQuestions.map((q) => {
                  const ans = submission.answersByQuestionId[q.id];
                  const text = ans && (ans.type === "short_answer" || ans.type === "essay") ? ans.text : "";
                  const draft = manualDraft[q.id] ?? { score: null, feedback: "", status: "pending" as const };
                  return (
                    <Card key={q.id} className="p-4 shadow-none bg-[#f7fbff] border-[#e6edf8]">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold text-[#1f2a44]">{q.text}</p>
                          <p className="mt-2 text-sm font-extrabold text-[#5c6f91]">Сурагчийн хариулт</p>
                          <div className="mt-2 rounded-2xl border border-[#d9e6fb] bg-white p-3 text-sm text-[#1f2a44] whitespace-pre-wrap">
                            {text?.trim() ? text : "—"}
                          </div>
                          <div className="mt-3 rounded-2xl border border-[#d9e6fb] bg-white p-3">
                            <p className="text-xs font-extrabold text-[#5c6f91]">Үнэлгээний шалгуур (дэмо)</p>
                            <p className="mt-1 text-sm text-[#5c6f91]">Шалгуураа ашиглан шударга, тогтвортойгоор оноо өгнө.</p>
                          </div>
                        </div>

                        <div className="w-full md:w-[320px] shrink-0">
                          <label className="text-sm font-extrabold text-[#1f2a44]">Оноо</label>
                          <input
                            type="number"
                            value={draft.score ?? ""}
                            onChange={(e) => {
                              const val = e.target.value === "" ? null : Number(e.target.value);
                              setManualDraft((p) => ({
                                ...p,
                                [q.id]: { ...draft, score: val, status: val == null ? "pending" : "scored" },
                              }));
                            }}
                            className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            min={0}
                            max={q.score}
                          />
                          <p className="mt-1 text-xs font-semibold text-[#5c6f91]">Дээд дүн: {q.score}</p>

                          <label className="mt-3 text-sm font-extrabold text-[#1f2a44]">Санал/тусгал</label>
                          <textarea
                            value={draft.feedback}
                            onChange={(e) => {
                              setManualDraft((p) => ({
                                ...p,
                                [q.id]: { ...draft, feedback: e.target.value },
                              }));
                            }}
                            className="mt-2 min-h-24 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Багшийн санал (заавал биш)…"
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-extrabold text-[#1f2a44]">Багшийн тэмдэглэл</p>
              <textarea
                className="mt-2 min-h-20 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={teacherNote}
                onChange={(e) => setTeacherNote(e.target.value)}
                placeholder="Энэ сурагчид зориулсан ерөнхий тэмдэглэл…"
              />
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={saveGrading} disabled={!canSave}>
                  <Save className="h-4 w-4" /> Үнэлгээг хадгалах
                </Button>
                <Button variant="primary" onClick={publish} disabled={!canSave || submission.teacherStatus === "published"}>
                  Үр дүнг нийтлэх
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </TeacherExamWizardShell>
  );
}

