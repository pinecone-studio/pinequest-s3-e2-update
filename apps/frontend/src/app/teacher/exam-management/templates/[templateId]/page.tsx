"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Pencil, Sparkles } from "lucide-react";
import { TeacherExamWizardShell } from "../../_components/wizard/TeacherExamWizardShell";
import { Button } from "../../_components/ui/Button";
import { Card } from "../../_components/ui/Card";
import type { Delivery, ExamTemplate } from "../../_lib/types";
import { getSubmissions, getTemplateById, listDeliveriesForTemplate, upsertTemplate } from "../../_lib/storage";
import { store } from "../../../../lib/store";

function duplicateExam(template: ExamTemplate): ExamTemplate {
  const id = `tmpl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    ...template,
    id,
    title: `${template.title} (Хуулбар)`,
    status: "draft",
    templateLocked: false,
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
  };
}

function avgScore(deliveryId: string) {
  const subs = getSubmissions(deliveryId);
  const scored = subs.filter((s) => typeof s.finalScore === "number") as Array<{ finalScore: number }>;
  if (scored.length === 0) return null;
  const sum = scored.reduce((acc, s) => acc + s.finalScore, 0);
  return Math.round((sum / scored.length) * 10) / 10;
}

function sessionStatusLabel(d: Delivery) {
  return d.status === "sent" ? "Sent" : "Draft";
}

export default function TemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ templateId: string }>();
  const templateId = params.templateId;

  const [template, setTemplate] = useState<ExamTemplate | null>(null);
  const [sessions, setSessions] = useState<Delivery[]>([]);

  useEffect(() => {
    if (!templateId) return;
    setTemplate(getTemplateById(templateId));
    setSessions(listDeliveriesForTemplate(templateId));
  }, [templateId]);

  const usageCount = sessions.length;
  const ready = useMemo(
    () => (template ? template.questions.length > 0 && template.status !== "draft" && template.status !== "archived" : false),
    [template],
  );

  if (!template) {
    return (
      <TeacherExamWizardShell step="setup" title="Template Detail">
        <Card className="p-8">
          <p className="text-sm font-extrabold text-[#b64747]">Template олдсонгүй.</p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => router.push("/teacher/exam-management")}>
              Жагсаалт руу
            </Button>
          </div>
        </Card>
      </TeacherExamWizardShell>
    );
  }

  return (
    <TeacherExamWizardShell
      step="setup"
      title="Template Detail"
      subtitle="Нэг template-ээс үүссэн бүх session-ийг эндээс хянаж, дахин ашиглана."
    >
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xl font-extrabold text-[#1f2a44]">{template.title}</p>
              <p className="mt-1 text-sm text-[#5c6f91]">{template.subject}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => router.push(`/teacher/exam-management/setup?templateId=${template.id}`)} disabled={!ready}>
                <Sparkles className="h-4 w-4" /> Use for Class
              </Button>
              <Button variant="secondary" onClick={() => router.push(`/teacher/exam-management/upload-review?templateId=${template.id}`)}>
                <Pencil className="h-4 w-4" /> Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const next = duplicateExam(template);
                  upsertTemplate(next);
                  router.push(`/teacher/exam-management/templates/${next.id}`);
                }}
              >
                <Copy className="h-4 w-4" /> Duplicate
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
            <div className="rounded-xl border border-[#d9e6fb] bg-white p-3">
              <p className="text-xs font-extrabold text-[#5c6f91]">Асуулт (PDF)</p>
              <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{template.questions.length}</p>
            </div>
            <div className="rounded-xl border border-[#d9e6fb] bg-white p-3">
              <p className="text-xs font-extrabold text-[#5c6f91]">Duration</p>
              <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{template.durationMinutes} мин</p>
            </div>
            <div className="rounded-xl border border-[#d9e6fb] bg-white p-3">
              <p className="text-xs font-extrabold text-[#5c6f91]">Usage</p>
              <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{usageCount}</p>
            </div>
            <div className="rounded-xl border border-[#d9e6fb] bg-white p-3">
              <p className="text-xs font-extrabold text-[#5c6f91]">Marks</p>
              <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{template.totalMarks}</p>
            </div>
            <div className="rounded-xl border border-[#d9e6fb] bg-white p-3">
              <p className="text-xs font-extrabold text-[#5c6f91]">Updated</p>
              <p className="mt-1 text-sm font-extrabold text-[#1f2a44]">{new Date(template.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-extrabold text-[#1f2a44]">Sessions by Class</p>
            <Button variant="ghost" onClick={() => router.push("/teacher/exam-management")}>
              <ArrowLeft className="h-4 w-4" /> Back to Templates
            </Button>
          </div>

          {sessions.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-6 text-center">
              <p className="text-sm font-extrabold text-[#1f2a44]">Session алга</p>
              <p className="mt-1 text-sm text-[#5c6f91]">Энэ template-г class дээр ашиглаад эхний session-ээ үүсгэнэ үү.</p>
              <div className="mt-4">
                <Button variant="primary" onClick={() => router.push(`/teacher/exam-management/setup?templateId=${template.id}`)} disabled={!ready}>
                  Use for Class
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#d9e6fb]">
              <table className="min-w-full divide-y divide-[#e6edf8] text-sm">
                <thead className="bg-[#f7fbff]">
                  <tr>
                    <th className="px-4 py-3 text-left font-extrabold text-[#5c6f91]">Class</th>
                    <th className="px-4 py-3 text-left font-extrabold text-[#5c6f91]">Students</th>
                    <th className="px-4 py-3 text-left font-extrabold text-[#5c6f91]">Status</th>
                    <th className="px-4 py-3 text-left font-extrabold text-[#5c6f91]">Link</th>
                    <th className="px-4 py-3 text-left font-extrabold text-[#5c6f91]">Avg Score</th>
                    <th className="px-4 py-3 text-left font-extrabold text-[#5c6f91]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6edf8] bg-white">
                  {sessions.map((s) => {
                    const cls = store.getClass(s.classId);
                    const avg = avgScore(s.id);
                    return (
                      <tr key={s.id}>
                        <td className="px-4 py-3 font-semibold text-[#1f2a44]">{cls?.name ?? s.classId}</td>
                        <td className="px-4 py-3 text-[#1f2a44]">{cls?.studentIds.length ?? 0}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full border border-[#d9e6fb] bg-[#f7fbff] px-2 py-0.5 text-xs font-extrabold text-[#2f73c4]">
                            {sessionStatusLabel(s)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#5c6f91]">{s.sharedDeliveryLink}</td>
                        <td className="px-4 py-3 text-[#1f2a44]">{avg ?? "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => router.push(`/teacher/exam-management/preview-send?templateId=${template.id}&deliveryId=${s.id}`)}
                            >
                              Open
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => router.push(`/teacher/exam-management/setup?templateId=${template.id}`)}>
                              Reuse
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </TeacherExamWizardShell>
  );
}
