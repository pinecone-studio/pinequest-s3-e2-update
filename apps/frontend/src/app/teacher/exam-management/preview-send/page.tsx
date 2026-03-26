"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Copy, Send } from "lucide-react";
import { TeacherExamWizardShell } from "../_components/wizard/TeacherExamWizardShell";
import { Button } from "../_components/ui/Button";
import { Card } from "../_components/ui/Card";
import type { Delivery, DisplayQuestion, ExamTemplate, StudentSubmission, VariantLabel } from "../_lib/types";
import { buildDisplayExam, createStudentVersionFromRules } from "../_lib/engine";
import { getDeliveryById, getTemplateById, upsertDelivery, upsertSubmissions, updateTemplate } from "../_lib/storage";
import { store } from "../../../lib/store";
import { StatusBadge } from "../_components/ui/StatusBadge";

function seededVariantAssignment(params: { studentIds: string[]; variantCount: number; seedKey: string }) {
  let h = 2166136261;
  for (let i = 0; i < params.seedKey.length; i++) h = Math.imul(h ^ params.seedKey.charCodeAt(i), 16777619);
  const seed = h >>> 0;
  const shuffled = seededShuffleArray(params.studentIds, seed);
  const labels: VariantLabel[] = (["A", "B", "C", "D", "E"] as VariantLabel[]).slice(0, params.variantCount);
  const byStudent: Record<string, VariantLabel> = {};
  for (let i = 0; i < shuffled.length; i++) byStudent[shuffled[i]] = labels[i % labels.length];
  return { byStudent, labels };
}

function seededShuffleArray<T>(arr: T[], seed: number) {
  let t = seed >>> 0;
  const rng = () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function makeEmptySubmission(params: { delivery: Delivery; template: ExamTemplate; studentId: string }): StudentSubmission {
  const openQs = params.template.questions.filter((q) => q.type === "short_answer" || q.type === "essay");
  const manualByQuestionId: StudentSubmission["manualByQuestionId"] = {};
  for (const q of openQs) {
    manualByQuestionId[q.id] = { score: null, feedback: "", status: "pending" };
  }

  return {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    deliveryId: params.delivery.id,
    templateId: params.template.id,
    studentId: params.studentId,
    startedAt: new Date().toISOString(),
    submittedAt: undefined,
    status: "in_progress",
    answersByQuestionId: {},
    autoScore: 0,
    autoCorrectCount: 0,
    autoTotalCount: 0,
    manualByQuestionId,
    finalScore: null,
    teacherStatus: "pending",
    teacherNote: "",
  };
}

function questionTypeBadge(type: DisplayQuestion["type"]) {
  if (type === "multiple_choice" || type === "true_false") return "Сонголттой";
  if (type === "short_answer") return "Богино";
  return "Эсээ";
}

export default function PreviewSendPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") ?? "";
  const deliveryId = searchParams.get("deliveryId") ?? "";

  const [template, setTemplate] = useState<ExamTemplate | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [copyNote, setCopyNote] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [activeSample, setActiveSample] = useState(0);

  useEffect(() => {
    if (!templateId || !deliveryId) return;
    const t = getTemplateById(templateId);
    const d = getDeliveryById(deliveryId);
    setTemplate(t);
    setDelivery(d);
    setSent(d?.status === "sent");
  }, [templateId, deliveryId]);

  const currentClass = useMemo(() => {
    if (!delivery) return null;
    return store.getClass(delivery.classId) ?? null;
  }, [delivery]);

  const studentIds = currentClass?.studentIds ?? [];
  const sampleIds = useMemo(() => studentIds.slice(0, 3), [studentIds]);

  const deliveryRules = delivery?.rules ?? null;

  const activeStudentId = sampleIds[activeSample] ?? sampleIds[0] ?? "";

  const variantLabelForSample = useMemo(() => {
    if (!template || !delivery || !currentClass || !deliveryRules || deliveryRules.strategy !== "limited_shared_variants") return undefined;
    if (!activeStudentId) return undefined;
    const { byStudent } = seededVariantAssignment({
      studentIds: currentClass.studentIds,
      variantCount: deliveryRules.variantCount,
      seedKey: `${delivery.id}|${currentClass.id}|${template.id}`,
    });
    return byStudent[activeStudentId];
  }, [template, delivery, currentClass, deliveryRules, activeStudentId]);

  const activeVersion = useMemo(() => {
    if (!template || !deliveryRules || !activeStudentId) return null;
    if (deliveryRules.strategy === "limited_shared_variants") {
      const vl = variantLabelForSample ?? "A";
      return createStudentVersionFromRules({ template, rules: deliveryRules, studentId: activeStudentId, variantLabel: vl });
    }
    return createStudentVersionFromRules({ template, rules: deliveryRules, studentId: activeStudentId });
  }, [template, deliveryRules, activeStudentId, variantLabelForSample]);

  const display: DisplayQuestion[] = useMemo(() => {
    if (!template || !deliveryRules || !activeVersion) return [];
    return buildDisplayExam({ template, rules: deliveryRules, version: activeVersion });
  }, [template, deliveryRules, activeVersion]);

  const onSendNow = async () => {
    if (!template || !delivery || !currentClass) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));

    const studentVersionsByStudentId: Record<string, Delivery["studentVersionsByStudentId"][string]> = {};

    if (delivery.rules.strategy === "limited_shared_variants") {
      const { byStudent } = seededVariantAssignment({
        studentIds: currentClass.studentIds,
        variantCount: delivery.rules.variantCount,
        seedKey: `${delivery.id}|${currentClass.id}|${template.id}`,
      });
      for (const sid of currentClass.studentIds) {
        const variantLabel = byStudent[sid];
        const version = createStudentVersionFromRules({ template, rules: delivery.rules, studentId: sid, variantLabel });
        studentVersionsByStudentId[sid] = version;
      }
    } else {
      for (const sid of currentClass.studentIds) {
        const version = createStudentVersionFromRules({ template, rules: delivery.rules, studentId: sid });
        studentVersionsByStudentId[sid] = version;
      }
    }

    const nextDelivery: Delivery = {
      ...delivery,
      status: "sent",
      sentAt: new Date().toISOString(),
      studentVersionsByStudentId,
    };

    const submissions = currentClass.studentIds.map((sid) => makeEmptySubmission({ delivery: nextDelivery, template, studentId: sid }));

    upsertDelivery(nextDelivery);
    upsertSubmissions(nextDelivery.id, submissions);
    updateTemplate(template.id, { status: "sent" });

    setDelivery(nextDelivery);
    setSent(true);
    setSending(false);
  };

  if (!templateId || !deliveryId || !template || !delivery || !currentClass || !deliveryRules) {
    return (
      <TeacherExamWizardShell step="send" title="Урьдчилж харах ба илгээх">
        <Card className="p-10">
          <p className="text-sm font-extrabold text-[#b64747]">Илгээд эсвэл загвар олдсонгүй.</p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => router.push(`/teacher/exam-management/setup?templateId=${templateId}`)}>
              Тохируулах руу буцах
            </Button>
          </div>
        </Card>
      </TeacherExamWizardShell>
    );
  }

  const fullLink =
    typeof window !== "undefined" ? `${window.location.origin}${delivery.sharedDeliveryLink}` : delivery.sharedDeliveryLink;

  return (
    <TeacherExamWizardShell
      step="send"
      title="Урьдчилж харах ба илгээх"
      subtitle="Хэдэн жишээг үзээд итгэлтэй болсон үедээ илгээнэ үү."
      rightSlot={<StatusBadge status={sent ? "sent" : template.status} />}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <p className="text-sm font-extrabold text-[#1f2a44]">Тойм</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-4">
                <p className="text-xs font-extrabold text-[#5c6f91]">Анги</p>
                <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{currentClass.name}</p>
              </div>
              <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-4">
                <p className="text-xs font-extrabold text-[#5c6f91]">Сурагчид</p>
                <p className="mt-1 text-2xl font-extrabold text-primary">{studentIds.length}</p>
              </div>
              <div className="rounded-2xl border border-[#e6edf8] bg-white p-4">
                <p className="text-sm font-extrabold text-[#1f2a44]">Өөр хувилбар</p>
                <p className="mt-1 text-sm text-[#5c6f91] leading-relaxed">
                  Идэвхтэй. Сурагч бүр асуулт болон сонголтын дарааллыг өөрөөр харна — та нэмэлт товч дарж тохируулах шаардлагагүй.
                </p>
              </div>
            </div>

            {!sent ? (
              <div className="mt-5">
                <Button variant="primary" className="w-full" onClick={() => setShowConfirm(true)} disabled={sending || studentIds.length === 0}>
                  <Send className="h-4 w-4" /> Шалгалт илгээх
                </Button>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-[#c6f7d0] bg-[#ecf9f0] p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-[#198a41]" />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[#198a41]">Илгээгдлээ</p>
                    <p className="mt-1 text-sm text-[#1d8a47]">Доорх линкийг сурагчдаа хуваалцана уу.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-[#d9e6fb] bg-white p-4">
              <p className="text-sm font-extrabold text-[#1f2a44]">Хуваалцах линк</p>
              <p className="mt-1 text-sm text-[#5c6f91]">{sent ? "Бэлэн." : "Илгээсний дараа бүрэн идэвхжинэ."}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input readOnly value={fullLink} className="h-10 w-full flex-1 rounded-xl border border-[#d9e6fb] bg-[#f7fbff] px-3 text-sm outline-none" />
                <Button
                  variant="secondary"
                  disabled={!sent}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(fullLink);
                      setCopyNote("Хууллаа.");
                      setTimeout(() => setCopyNote(""), 1500);
                    } catch {
                      setCopyNote("Хуулах боломжгүй.");
                    }
                  }}
                >
                  <Copy className="h-4 w-4" /> Хуулах
                </Button>
              </div>
              {copyNote ? <p className="mt-2 text-xs font-semibold text-[#2f73c4]">{copyNote}</p> : null}
            </div>

            {sent ? (
              <div className="mt-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push(`/teacher/exam-management/grading?deliveryId=${delivery.id}&templateId=${template.id}`)}
                >
                  Үнэлгээнд очих
                </Button>
              </div>
            ) : null}
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5">
            <p className="text-sm font-extrabold text-[#1f2a44]">Жишээ харагдацууд</p>
            <p className="mt-1 text-sm text-[#5c6f91]">Сурагч бүрт ялгаатай байдлыг харуулахын тулд хэдэн жишээг л харуулна.</p>

            {sampleIds.length === 0 ? (
              <p className="mt-4 text-sm text-[#b64747]">Сурагчгүй анги.</p>
            ) : (
              <>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sampleIds.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSample(idx)}
                      className={[
                        "h-9 rounded-xl border px-3 text-sm font-extrabold transition",
                        activeSample === idx ? "border-primary bg-[#eef6ff] text-primary" : "border-[#d9e6fb] bg-white text-[#1f2a44] hover:bg-[#f7fbff]",
                      ].join(" ")}
                    >
                      Жишээ {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {display.map((dq, idx) => (
                    <div key={dq.originalQuestionId} className="rounded-2xl border border-[#e6edf8] bg-[#f7fbff] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-sm font-extrabold text-[#1f2a44]">
                          {idx + 1}. {dq.text}
                        </p>
                        <span className="shrink-0 rounded-full border border-[#d9e6fb] bg-white px-2 py-0.5 text-xs font-extrabold text-[#5c6f91]">
                          {questionTypeBadge(dq.type)} · {dq.score}
                        </span>
                      </div>
                      {dq.displayChoices ? (
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {dq.displayChoices.map((c, cIdx) => (
                            <div key={c.originalChoiceId} className="rounded-xl border border-[#d9e6fb] bg-white p-3">
                              <p className="text-xs font-extrabold text-[#5c6f91]">{String.fromCharCode(65 + cIdx)}</p>
                              <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{c.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-[#5c6f91]">Нээлттэй хариулт — та үнэлнэ.</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {showConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="w-full max-w-lg rounded-2xl border border-[#d9e6fb] bg-white p-5 shadow-xl">
            <p className="text-sm font-extrabold text-[#1f2a44]">Илгээх үү?</p>
            <p className="mt-2 text-sm text-[#5c6f91]">
              <span className="font-extrabold text-[#1f2a44]">{studentIds.length}</span> сурагчид шалгалт харагдана. Сурагч бүрт тохирсон хувилбар
              хадгалагдана.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                Болих
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  setShowConfirm(false);
                  await onSendNow();
                }}
                isLoading={sending}
              >
                Илгээх
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </TeacherExamWizardShell>
  );
}
