"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Plus, Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react";
import type { ExamTemplate, Question, QuestionType } from "../../_lib/types";
import { getTemplateById, updateTemplate } from "../../_lib/storage";
import { TeacherExamWizardShell } from "../wizard/TeacherExamWizardShell";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";

function cloneQuestion(q: Question): Question {
  const newQId = `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  if (q.type === "multiple_choice" || q.type === "true_false") {
    const nextChoices = q.choices.map((c) => ({ ...c, id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }));
    const oldCorrect = q.correctChoiceId;
    const oldCorrectChoice = q.choices.find((c) => c.id === oldCorrect);
    const newCorrectChoice = nextChoices.find((c) => c.text === oldCorrectChoice?.text);
    return {
      ...q,
      id: newQId,
      choices: nextChoices,
      correctChoiceId: newCorrectChoice?.id,
    };
  }
  return {
    ...q,
    id: newQId,
    choices: [],
    correctChoiceId: undefined,
  };
}

function questionTypeLabel(type: QuestionType) {
  if (type === "multiple_choice") return "Сонголттой";
  if (type === "true_false") return "Үнэн/Худал";
  if (type === "short_answer") return "Богино хариулт";
  return "Эсээ";
}

function typeBadgeTone(type: QuestionType) {
  if (type === "multiple_choice" || type === "true_false") return "bg-[#eef6ff] text-[#2f73c4] border-[#d9e6fb]";
  if (type === "short_answer") return "bg-[#f7fbff] text-[#1f2a44] border-[#d9e6fb]";
  return "bg-[#f7fbff] text-[#1f2a44] border-[#d9e6fb]";
}

function computeAutoCounts(template: { questions: Question[]; parseIssues?: ExamTemplate["parseIssues"] }) {
  const questions = template.questions;
  const auto = questions.filter((q) => q.type === "multiple_choice" || q.type === "true_false");
  const manual = questions.filter((q) => q.type === "short_answer" || q.type === "essay");
  const issues = template.parseIssues?.length ?? 0;
  return {
    total: questions.length,
    autoCount: auto.length,
    manualCount: manual.length,
    issuesCount: issues,
  };
}

export function UploadReviewEditor({ templateId }: { templateId: string }) {
  const router = useRouter();

  const [template, setTemplate] = useState<ExamTemplate | null>(null);
  const [draftQuestions, setDraftQuestions] = useState<Question[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving">("idle");
  const [missing, setMissing] = useState<string>("");

  useEffect(() => {
    if (!templateId) return setMissing("templateId олдсонгүй.");
    const t = getTemplateById(templateId);
    if (!t) return setMissing("Загвар олдсонгүй (локал дэмо хадгалалт).");
    setTemplate(t);
    setDraftQuestions(t.questions);
  }, [templateId]);

  const counts = useMemo(() => computeAutoCounts({ questions: draftQuestions, parseIssues: template?.parseIssues ?? [] }), [draftQuestions, template]);

  const issuesByQuestionId = useMemo(() => {
    const map = new Map<string, string[]>();
    const issues = template?.parseIssues ?? [];
    for (const i of issues) {
      if (!i.questionId) continue;
      if (!map.has(i.questionId)) map.set(i.questionId, []);
      map.get(i.questionId)!.push(i.label);
    }
    return map;
  }, [template]);

  const addQuestion = (type: QuestionType) => {
    const base: Question =
      type === "multiple_choice" || type === "true_false"
        ? {
            id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            text: "",
            type,
            choices: ["", "", "", ""].map((t) => ({ id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text: t })),
            correctChoiceId: undefined,
            score: 1,
            preserveOrder: false,
            section: { id: `s-${Date.now()}`, title: "Шинэ хэсэг" },
            group: { id: `g-${Date.now()}`, title: "Шинэ бүлэг" },
          }
        : {
            id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            text: "",
            type,
            choices: [],
            correctChoiceId: undefined,
            score: 1,
            preserveOrder: false,
            section: { id: `s-${Date.now()}`, title: "Шинэ хэсэг" },
            group: { id: `g-${Date.now()}`, title: "Шинэ бүлэг" },
          };

    setDraftQuestions((prev) => [...prev, base]);
  };

  const saveChanges = () => {
    if (!template) return;
    setSaveState("saving");
    const next: ExamTemplate = { ...template, questions: draftQuestions, status: "parsed" };
    updateTemplate(template.id, next);
    setSaveState("idle");
    setTemplate(next);
  };

  const onContinue = () => {
    if (!template) return;
    const next: ExamTemplate = { ...template, questions: draftQuestions, status: "parsed", templateLocked: true };
    updateTemplate(template.id, next);
    setTemplate(next);
    router.push(`/teacher/exam-management/setup?templateId=${template.id}`);
  };

  const move = (idx: number, dir: -1 | 1) => {
    setDraftQuestions((prev) => {
      const next = [...prev];
      const to = idx + dir;
      if (to < 0 || to >= next.length) return prev;
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
  };

  if (missing) {
    return (
      <TeacherExamWizardShell step="upload" title="Байршуулах ба хянах" subtitle="Асуултуудыг засварлана">
        <Card className="p-10">
          <p className="text-sm font-extrabold text-[#b64747]">{missing}</p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => router.push("/teacher/exam-management")}>
              Жагсаалт руу буцах
            </Button>
          </div>
        </Card>
      </TeacherExamWizardShell>
    );
  }

  if (!template) {
    return (
      <TeacherExamWizardShell step="upload" title="Байршуулах ба хянах">
        <Card className="p-10">
          <p className="text-sm font-extrabold text-[#5c6f91]">Загвар ачаалж байна…</p>
        </Card>
      </TeacherExamWizardShell>
    );
  }

  const autoIssueCount = draftQuestions.filter((q) => {
    if (q.type === "multiple_choice" || q.type === "true_false") {
      return q.choices.filter((c) => c.text.trim().length > 0).length < 2 || !q.correctChoiceId;
    }
    return q.text.trim().length === 0;
  }).length;

  return (
    <TeacherExamWizardShell
      step="upload"
      title="Байршуулах ба хянах"
      subtitle="Зүүн талд PDF, баруун талд асуултууд. Засварласны дараа «Үргэлжлүүлэх» дарна уу."
      rightSlot={<StatusBadge status={template.status} />}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <p className="text-sm font-extrabold text-[#1f2a44]">PDF (лавлагаа)</p>
            <div className="mt-3 rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-4">
              <p className="text-sm font-extrabold text-[#1f2a44]">{template.sourcePdf?.fileName ?? "PDF мэдээлэл алга"}</p>
              <p className="mt-1 text-sm text-[#5c6f91]">Энэ нь зөвхөн эх сурвалж. Сурагчид доорх асуултын дагуу шалгалт өгнө.</p>
            </div>
            <div className="mt-4 rounded-2xl border border-[#d9e6fb] bg-white p-4">
              <p className="text-sm font-extrabold text-[#1f2a44]">Урьдчилж харах</p>
              <p className="mt-2 text-sm text-[#5c6f91]">Дэмо: PDF-ийн хуудсыг энд дүрслэх нь ирээдүйн холболтоос хамаарна.</p>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-[#1f2a44]">Товч тойм</p>
                <p className="mt-1 text-sm text-[#5c6f91]">Илгээхээс өмнө шалгахад хангалттай.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-extrabold text-primary border border-[#d9e6fb]">
                  {counts.total} асуулт (PDF)
                </span>
                <span className="rounded-full bg-[#fff3c8] px-3 py-1 text-xs font-extrabold text-[#8b6800] border border-[#ffe9ad]">
                  {counts.issuesCount + autoIssueCount} анхаарах
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
                <p className="text-xs font-extrabold text-[#5c6f91]">Автоматаар үнэлэгдэх</p>
                <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{counts.autoCount}</p>
              </div>
              <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
                <p className="text-xs font-extrabold text-[#5c6f91]">Багшийн үнэлгээ</p>
                <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{counts.manualCount}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#1f2a44]">Асуултууд</p>
                <p className="mt-1 text-sm text-[#5c6f91]">
                  PDF-аас задалсан асуултууд — энд текст, сонголт, зөв хариулт, оноог засварлана.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => addQuestion("multiple_choice")}>
                  <Plus className="h-4 w-4" /> Сонголттой
                </Button>
                <Button size="sm" variant="secondary" onClick={() => addQuestion("short_answer")}>
                  <Plus className="h-4 w-4" /> Богино
                </Button>
                <Button size="sm" variant="secondary" onClick={() => addQuestion("essay")}>
                  <Plus className="h-4 w-4" /> Эсээ
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            {draftQuestions.map((q, idx) => {
              const unresolved = issuesByQuestionId.get(q.id) ?? [];
              const missingCorrect =
                (q.type === "multiple_choice" || q.type === "true_false") && (!q.correctChoiceId || q.choices.filter((c) => c.text.trim()).length < 2);
              return (
                <Card key={q.id} className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#d9e6fb] bg-white px-3 py-1 text-xs font-extrabold text-[#1f2a44]">
                          <GripVertical className="h-3.5 w-3.5 text-[#5c6f91]" /> {idx + 1}
                        </span>
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold ${typeBadgeTone(q.type)}`}>
                          {questionTypeLabel(q.type)}
                        </span>
                        {q.group?.title ? (
                          <span className="inline-flex items-center rounded-full border border-[#d9e6fb] bg-[#f7fbff] px-3 py-1 text-xs font-semibold text-[#5c6f91]">
                            {q.group.title}
                          </span>
                        ) : null}
                        {q.preserveOrder ? (
                          <span className="inline-flex items-center rounded-full border border-[#ffe9ad] bg-[#fff3c8] px-3 py-1 text-xs font-extrabold text-[#8b6800]">
                            Эрэмбэ хадгална
                          </span>
                        ) : null}
                        {unresolved.length > 0 || missingCorrect ? (
                          <span className="inline-flex items-center rounded-full border border-[#ffe9ad] bg-[#fff3c8] px-3 py-1 text-xs font-extrabold text-[#8b6800]">
                            Шалгах
                          </span>
                        ) : null}
                      </div>

                      {unresolved.length > 0 ? (
                        <div className="mt-2 rounded-2xl border border-[#ffe9ad] bg-[#fff7e8] p-3">
                          <p className="text-xs font-extrabold text-[#8b6800]">PDF-ээс бүрэн татагдаагүй</p>
                          <ul className="mt-1 list-disc pl-5 text-sm text-[#8b6800]">
                            {unresolved.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div className="mt-3">
                        <label className="text-sm font-extrabold text-[#1f2a44]">Асуултын текст (PDF-аас)</label>
                        <textarea
                          value={q.text}
                          onChange={(e) =>
                            setDraftQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, text: e.target.value } : x)))
                          }
                          className="mt-2 min-h-20 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {q.type === "multiple_choice" || q.type === "true_false" ? (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="text-sm font-extrabold text-[#1f2a44]">Сонголтууд</label>
                            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {q.choices.map((c, cIdx) => (
                                <div key={c.id} className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs font-extrabold text-[#5c6f91]">{String.fromCharCode(65 + cIdx)}</span>
                                    {q.correctChoiceId === c.id ? (
                                      <span className="rounded-full bg-[#eef6ff] px-2 py-0.5 text-xs font-extrabold text-primary border border-[#d9e6fb]">Зөв</span>
                                    ) : null}
                                  </div>
                                  <input
                                    value={c.text}
                                    onChange={(e) =>
                                      setDraftQuestions((prev) =>
                                        prev.map((x) => {
                                          if (x.id !== q.id) return x;
                                          const nextChoices = x.choices.map((cc) => (cc.id === c.id ? { ...cc, text: e.target.value } : cc));
                                          return { ...x, choices: nextChoices };
                                        }),
                                      )
                                    }
                                    className="mt-2 h-9 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                  <label className="mt-2 flex items-center justify-between gap-3 text-sm">
                                    <span className="text-xs font-extrabold text-[#5c6f91]">Зөв хариулт</span>
                                    <input
                                      checked={q.correctChoiceId === c.id}
                                      onChange={() =>
                                        setDraftQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, correctChoiceId: c.id } : x)))
                                      }
                                      name={`correct-${q.id}`}
                                      type="radio"
                                    />
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {q.type === "short_answer" || q.type === "essay" ? (
                        <div className="mt-3 rounded-2xl border border-[#e6edf8] bg-[#f7fbff] p-3">
                          <p className="text-sm font-extrabold text-[#1f2a44]">Гарын үнэлгээ</p>
                          <p className="mt-1 text-sm text-[#5c6f91]">Эдгээр асуултыг дараа нь та үнэлнэ.</p>
                        </div>
                      ) : null}
                    </div>

                    <div className="w-full md:w-[280px] shrink-0">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="text-sm font-extrabold text-[#1f2a44]">Оноо</label>
                          <input
                            type="number"
                            min={0}
                            value={q.score}
                            onChange={(e) =>
                              setDraftQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, score: Number(e.target.value) || 0 } : x)))
                            }
                            className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div className="rounded-2xl border border-[#d9e6fb] bg-white p-3">
                          <label className="flex items-center justify-between gap-3">
                            <span className="text-sm font-extrabold text-[#1f2a44]">Эрэмбэ хадгалах</span>
                            <input
                              type="checkbox"
                              checked={!!q.preserveOrder}
                              onChange={(e) =>
                                setDraftQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, preserveOrder: e.target.checked } : x)))
                              }
                            />
                          </label>
                          <p className="mt-2 text-xs font-semibold text-[#5c6f91]">Санамсаргүй болгох үед энэ асуулт хөдлөхгүй.</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="secondary" onClick={() => move(idx, -1)} disabled={idx === 0}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => move(idx, 1)} disabled={idx === draftQuestions.length - 1}>
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              setDraftQuestions((prev) => {
                                const cloned = cloneQuestion(q);
                                const next = [...prev];
                                next.splice(idx + 1, 0, cloned);
                                return next;
                              })
                            }
                          >
                            <Copy className="h-4 w-4" /> Давхарлах
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setDraftQuestions((prev) => prev.filter((x) => x.id !== q.id))}
                            disabled={draftQuestions.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-extrabold text-[#1f2a44]">Дараагийн алхам</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" onClick={saveChanges} disabled={saveState !== "idle"}>
                  {saveState === "saving" ? "Хадгалж байна…" : "Хадгалах"}
                </Button>
                <Button variant="primary" onClick={onContinue}>
                  Үргэлжлүүлэх
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherExamWizardShell>
  );
}
