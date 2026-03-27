"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, UploadCloud, Loader2 } from "lucide-react";
import { TeacherExamWizardShell } from "../_components/wizard/TeacherExamWizardShell";
import { UploadReviewEditor } from "../_components/flow/UploadReviewEditor";
import { Button } from "../_components/ui/Button";
import { Card } from "../_components/ui/Card";
import type { ExamTemplate } from "../_lib/types";
import { mockParsedQuestions } from "../_lib/mockParser";
import { upsertTemplate } from "../_lib/storage";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [instructions, setInstructions] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [totalMarks, setTotalMarks] = useState(20);
  const [gradeLevel, setGradeLevel] = useState("8-р анги");
  const [note, setNote] = useState("");

  const [status, setStatus] = useState<"idle" | "uploading" | "extracting">("idle");
  const [noteMsg, setNoteMsg] = useState<string>("");

  const canContinue = useMemo(() => {
    return (
      !!file &&
      title.trim().length > 0 &&
      subject.trim().length > 0 &&
      durationMinutes >= 10 &&
      totalMarks >= 1 &&
      gradeLevel.trim().length > 0 &&
      status !== "uploading" &&
      status !== "extracting"
    );
  }, [file, title, subject, durationMinutes, totalMarks, gradeLevel, status]);

  const createBaseTemplate = (): ExamTemplate => {
    const id = uid("tmpl");
    return {
      id,
      title: title.trim(),
      subject: subject.trim(),
      subtopic: subtopic.trim() || undefined,
      instructions: instructions.trim(),
      durationMinutes,
      totalMarks,
      gradeLevel: gradeLevel.trim(),
      note: note.trim() || undefined,
      sourcePdf: file ? { fileName: file.name, sizeBytes: file.size } : undefined,
      questions: [],
      status: "draft",
      templateLocked: false,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
      parseIssues: [],
    };
  };

  const onSaveDraft = () => {
    setFileError("");
    if (!file) {
      setFileError("PDF файл байршуулаарай.");
      return;
    }
    const t = createBaseTemplate();
    t.status = "draft";
    upsertTemplate(t);
    router.push("/teacher/exam-management");
  };

  const onContinue = async () => {
    setFileError("");
    if (!file) {
      setFileError("PDF файл байршуулаарай.");
      return;
    }
    if (!title.trim() || !subject.trim()) {
      setFileError("Шалгалтын нэр болон хичээлийг заавал оруулна уу.");
      return;
    }

    setStatus("uploading");
    setNoteMsg("PDF байршуулах…");
    await new Promise((r) => setTimeout(r, 650));

    setStatus("extracting");
    setNoteMsg("Асуултуудыг бэлтгэж байна…");
    await new Promise((r) => setTimeout(r, 850));

    const base = createBaseTemplate();
    const parsed = mockParsedQuestions({ subject: subject.trim(), gradeLevel: gradeLevel.trim() });
    base.questions = parsed.questions;
    base.parseIssues = parsed.parseIssues ?? [];
    base.status = "parsed";
    upsertTemplate(base);
    router.push(`/teacher/exam-management/upload-review?templateId=${base.id}`);
  };

  return (
    <TeacherExamWizardShell
      step="upload"
      title="Байршуулах ба хянах"
      subtitle="Эхлээд PDF болон үндсэн мэдээллээ оруулна. Дараа нь асуултуугаа нэг дор засварлана."
      rightSlot={
        <div className="rounded-2xl border border-[#d9e6fb] bg-white px-3 py-2 text-sm">
          <p className="font-extrabold text-[#1f2a44]">Файл</p>
          <p className="mt-1 text-[#5c6f91]">Зөвхөн PDF, ~10MB хүртэл.</p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5">
            <p className="text-sm font-extrabold text-[#1f2a44]">PDF байршуулах</p>
            <div className="mt-3 rounded-2xl border border-dashed border-[#d9e6fb] bg-[#f7fbff] p-6">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#d9e6fb]">
                  <UploadCloud className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm font-extrabold text-[#1f2a44]">PDF-ээ энд чирж буулгана уу</div>
                <div className="text-sm text-[#5c6f91]">эсвэл сонгох</div>
                <input
                  accept="application/pdf,.pdf"
                  className="hidden"
                  type="file"
                  onChange={(e) => {
                    const next = e.target.files?.[0] ?? null;
                    if (!next) {
                      setFile(null);
                      setFileError("");
                      return;
                    }
                    if (!next.name.toLowerCase().endsWith(".pdf") && next.type !== "application/pdf") {
                      setFileError("Зөвхөн PDF файл зөвшөөрнө.");
                      setFile(null);
                      return;
                    }
                    if (next.size > 10 * 1024 * 1024) {
                      setFileError("Файл хэт том байна. Дэмо: 10MB дотор.");
                      setFile(null);
                      return;
                    }
                    setFileError("");
                    setFile(next);
                  }}
                />
              </label>
              {fileError ? <p className="mt-3 text-sm font-extrabold text-[#b64747]">{fileError}</p> : null}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="text-sm font-extrabold text-[#1f2a44]">Шалгалтын нэр</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ж: Математик — Дунд шат"
                  className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-extrabold text-[#1f2a44]">Хичээл</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ж: Математик"
                  className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-extrabold text-[#1f2a44]">Дэд сэдэв</label>
                <input
                  value={subtopic}
                  onChange={(e) => setSubtopic(e.target.value)}
                  placeholder="Ж: Тригонометр"
                  className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="text-sm font-extrabold text-[#1f2a44]">Хугацаа (мин)</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 10)}
                  className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-extrabold text-[#1f2a44]">Нийт оноо</label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value) || 1)}
                  className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-extrabold text-[#1f2a44]">Анги</label>
                <input
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder="Ж: 8-р анги"
                  className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-sm font-extrabold text-[#1f2a44]">Заавар</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Сурагчдад харагдах заавар…"
                className="mt-2 min-h-24 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="mt-3">
              <label className="text-sm font-extrabold text-[#1f2a44]">Тэмдэглэл (заавал биш)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <p className="text-sm font-extrabold text-[#1f2a44]">Файл</p>
            <div className="mt-3 rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#d9e6fb]">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#1f2a44]">{file ? file.name : "Сонгоогүй"}</p>
                  <p className="mt-1 text-sm text-[#5c6f91]">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} МБ` : "PDF сонгоно уу."}
                  </p>
                </div>
              </div>
            </div>

            {status !== "idle" ? (
              <div className="mt-4 rounded-2xl border border-[#d9e6fb] bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#eef6ff] p-2 text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <p className="text-sm font-extrabold text-[#1f2a44]">{noteMsg || "Ажиллаж байна…"}</p>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#e6edf8]">
                  <div className="h-2 w-1/2 animate-pulse rounded-full bg-primary" />
                </div>
              </div>
            ) : null}
          </Card>

          <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
            <p className="text-sm font-extrabold text-[#1f2a44]">Дараагийн алхам</p>
            <p className="mt-1 text-sm text-[#5c6f91]">Дараа нь асуултуудыг засварлаад «Үргэлжлүүлэх» дарна.</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" onClick={onSaveDraft}>
                Ноорог
              </Button>
              <Button variant="primary" onClick={onContinue} disabled={!canContinue}>
                Үргэлжлүүлэх
              </Button>
            </div>
            {!canContinue && file ? (
              <p className="mt-3 text-xs font-semibold text-[#8b6800]">Нэр, хичээл, хугацаа, оноог бөглөнө үү.</p>
            ) : null}
          </div>
        </div>
      </div>
    </TeacherExamWizardShell>
  );
}

export default function UploadReviewPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") ?? "";

  if (!templateId) return <UploadForm />;
  return <UploadReviewEditor templateId={templateId} />;
}
