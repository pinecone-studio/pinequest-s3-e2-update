"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Sparkles, UploadCloud } from "lucide-react";
import type { ExamTemplate } from "./_lib/types";
import {
  archiveTemplate,
  EMPTY_EXAM_TEMPLATES_SNAPSHOT,
  getTemplatesListSnapshot,
  listDeliveriesForTemplate,
  upsertTemplate,
} from "./_lib/storage";
import { Button } from "./_components/ui/Button";
import { Card, CardHeader } from "./_components/ui/Card";

type FilterKey = "all" | "draft" | "ready" | "archived";

function isTemplateReady(t: ExamTemplate) {
  return t.questions.length > 0 && t.status !== "draft" && t.status !== "archived";
}

function filterMatches(t: ExamTemplate, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "draft") return t.status === "draft";
  if (filter === "archived") return t.status === "archived";
  if (filter === "ready") return isTemplateReady(t);
  return true;
}

function duplicateExam(template: ExamTemplate): ExamTemplate {
  const id = `tmpl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const questions = template.questions.map((q) => ({
    ...q,
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    choices:
      q.type === "multiple_choice" || q.type === "true_false"
        ? q.choices.map((c) => ({ ...c, id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }))
        : [],
  }));

  // Remap correctChoiceId after choice ids changed.
  const oldToNewChoiceId: Record<string, string> = {};
  for (let qi = 0; qi < template.questions.length; qi++) {
    const oldQ = template.questions[qi];
    const newQ = questions[qi];
    if (!oldQ.correctChoiceId || newQ.choices.length === 0) continue;
    const oldChoice = oldQ.choices.find((c) => c.id === oldQ.correctChoiceId);
    if (!oldChoice) continue;
    const newChoice = newQ.choices.find((c) => c.text === oldChoice.text);
    if (newChoice) oldToNewChoiceId[oldQ.correctChoiceId] = newChoice.id;
  }

  const nextQuestions = questions.map((q, i) => {
    const oldQ = template.questions[i];
    if (!oldQ.correctChoiceId) return q;
    const newCorrect = oldToNewChoiceId[oldQ.correctChoiceId];
    return { ...q, correctChoiceId: newCorrect };
  });

  return {
    ...template,
    id,
    title: `${template.title} (Хуулбар)`,
    status: "draft",
    templateLocked: false,
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
    questions: nextQuestions,
  };
}

export default function ExamTemplateListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const templates = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const handler = () => onStoreChange();
      window.addEventListener("storage", handler);
      window.addEventListener("exam-management.local.updated", handler);
      return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener("exam-management.local.updated", handler);
      };
    },
    () => getTemplatesListSnapshot(),
    () => EMPTY_EXAM_TEMPLATES_SNAPSHOT,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates
      .filter((t) => filterMatches(t, filter))
      .filter((t) => (q ? `${t.title} ${t.subject}`.toLowerCase().includes(q) : true));
  }, [templates, filter, query]);

  const onCreate = () => router.push("/teacher/exam-management/upload-review");

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <CardHeader
              title="Exam Templates"
              subtitle="Нэг удаа бэлдээд, олон ангид дахин ашиглах загварууд."
            />
          </div>
          <Button variant="primary" onClick={onCreate} className="min-w-[220px]">
            <UploadCloud className="h-4 w-4" /> Template үүсгэх
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-extrabold text-[#1f2a44]">Хайлт</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Шалгалтын нэр эсвэл хичээл"
              className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm font-extrabold text-[#1f2a44]">Шүүлтүүр</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {([
                ["all", "Бүгд"],
                ["draft", "Ноорог"],
                ["ready", "Бэлэн"],
                ["archived", "Архив"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={[
                    "h-9 rounded-xl border px-3 text-sm font-extrabold transition",
                    filter === key ? "border-primary bg-[#eef6ff] text-primary" : "border-[#d9e6fb] bg-white text-[#1f2a44] hover:bg-[#f7fbff]",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm font-extrabold text-[#1f2a44]">Template алга байна</p>
          <p className="mt-2 text-sm text-[#5c6f91]">Анхны template-ээ PDF-ээс үүсгэнэ үү.</p>
          <div className="mt-5">
            <Button variant="primary" onClick={onCreate}>
              Template үүсгэх
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((t) => {
            const usageCount = listDeliveriesForTemplate(t.id).length;
            const ready = isTemplateReady(t);
            return (
              <Card key={t.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-extrabold text-[#1f2a44]">{t.title}</p>
                    <p className="mt-1 text-sm text-[#5c6f91]">{t.subject}</p>
                  </div>
                  <span className="rounded-full border border-[#d9e6fb] bg-[#f7fbff] px-3 py-1 text-xs font-extrabold text-[#2f73c4]">
                    {usageCount} удаа ашигласан
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-[#d9e6fb] bg-white p-3">
                    <p className="text-xs font-extrabold text-[#5c6f91]">Асуулт</p>
                    <p className="mt-0.5 text-[10px] font-semibold leading-snug text-[#5c6f91]">PDF-аас</p>
                    <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{t.questions.length}</p>
                  </div>
                  <div className="rounded-xl border border-[#d9e6fb] bg-white p-3">
                    <p className="text-xs font-extrabold text-[#5c6f91]">Хугацаа</p>
                    <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{t.durationMinutes} мин</p>
                  </div>
                  <div className="rounded-xl border border-[#d9e6fb] bg-white p-3">
                    <p className="text-xs font-extrabold text-[#5c6f91]">Төлөв</p>
                    <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{ready ? "Бэлэн" : "Ноорог"}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/teacher/exam-management/setup?templateId=${t.id}`)}
                    disabled={!ready}
                  >
                    <Sparkles className="h-4 w-4" /> Use for Class
                  </Button>
                  <Button variant="secondary" onClick={() => router.push(`/teacher/exam-management/upload-review?templateId=${t.id}`)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const next = duplicateExam(t);
                      upsertTemplate(next);
                    }}
                  >
                    <Copy className="h-4 w-4" /> Duplicate
                  </Button>
                  <Button variant="secondary" onClick={() => router.push(`/teacher/exam-management/templates/${t.id}`)}>
                    Sessions
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      archiveTemplate(t.id);
                    }}
                    disabled={t.status === "archived"}
                  >
                    Архив
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

