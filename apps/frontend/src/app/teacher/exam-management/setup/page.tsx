"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, TriangleAlert, Sparkles } from "lucide-react";
import { TeacherExamWizardShell } from "../_components/wizard/TeacherExamWizardShell";
import { Button } from "../_components/ui/Button";
import { Card } from "../_components/ui/Card";
import { useTeacher } from "../../teacher-shell";
import { store } from "../../../lib/store";
import type { ExamTemplate } from "../_lib/types";
import { getTemplateById, upsertDelivery, updateTemplate } from "../_lib/storage";
import type { Delivery } from "../_lib/types";
import { getDefaultTeacherVariantRules } from "../_lib/defaultVariantRules";

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") ?? "";

  const teacher = useTeacher();
  const classes = store.getClassesForTeacher(teacher.id);

  const [template, setTemplate] = useState<ExamTemplate | null>(null);
  const [classId, setClassId] = useState<string>("");
  const [classQuery, setClassQuery] = useState("");

  useEffect(() => {
    if (!templateId) return;
    const t = getTemplateById(templateId);
    if (!t) return;
    const clsList = store.getClassesForTeacher(teacher.id);
    if (!t.variantRules) {
      const rules = getDefaultTeacherVariantRules();
      updateTemplate(templateId, { variantRules: rules, status: t.status === "draft" ? "draft" : "variants_ready" });
      setTemplate(getTemplateById(templateId));
    } else {
      setTemplate(t);
    }
    setClassId((prev) => prev || clsList[0]?.id || "");
  }, [templateId, teacher.id]);

  const currentClass = useMemo(() => classes.find((c) => c.id === classId) ?? null, [classes, classId]);
  const filteredClasses = useMemo(() => {
    const q = classQuery.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) => `${c.name} ${c.id}`.toLowerCase().includes(q));
  }, [classes, classQuery]);

  const rules = template?.variantRules ?? null;
  const warningTooLarge = currentClass ? currentClass.studentIds.length > 80 : false;

  const onContinue = () => {
    if (!template || !rules || !currentClass) return;
    const deliveryId = `del-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const delivery: Delivery = {
      id: deliveryId,
      templateId: template.id,
      classId: currentClass.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rules,
      sharedDeliveryLink: `/student/exam?deliveryId=${deliveryId}`,
      status: "draft",
      studentVersionsByStudentId: {},
    };
    upsertDelivery(delivery);
    updateTemplate(template.id, { status: "assigned" });
    router.push(`/teacher/exam-management/preview-send?templateId=${template.id}&deliveryId=${deliveryId}`);
  };

  if (!templateId) {
    return (
      <TeacherExamWizardShell step="setup" title="Тохируулах" subtitle="Эхлээд PDF ба асуултаа бэлтгэнэ үү.">
        <Card className="p-10">
          <p className="text-sm font-extrabold text-[#b64747]">Загварын ID алга.</p>
          <Button className="mt-4" variant="secondary" onClick={() => router.push("/teacher/exam-management/upload-review")}>
            Байршуулах руу
          </Button>
        </Card>
      </TeacherExamWizardShell>
    );
  }

  if (!template) {
    return (
      <TeacherExamWizardShell step="setup" title="Тохируулах">
        <Card className="p-10">
          <p className="text-sm font-extrabold text-[#5c6f91]">Ачаалж байна…</p>
        </Card>
      </TeacherExamWizardShell>
    );
  }

  return (
    <TeacherExamWizardShell
      step="setup"
      title="Тохируулах"
      subtitle="Ангиа сонгоно. Сурагч бүр өөр дараалалтай хувилбар авна — та нэмэлт тохиргоо хийх шаардлагагүй."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-5">
            <p className="text-sm font-extrabold text-[#1f2a44]">Анги сонгох</p>
            <p className="mt-1 text-sm text-[#5c6f91]">Бүх сурагч нэг линк ашиглана. Систем сурагч бүрт өөр хувилбарыг автоматаар өгнө.</p>

            <div className="mt-4">
              <label className="text-sm font-extrabold text-[#1f2a44]">Хайх</label>
              <input
                value={classQuery}
                onChange={(e) => setClassQuery(e.target.value)}
                placeholder="Ангийн нэр…"
                className="mt-2 h-10 w-full rounded-xl border border-[#d9e6fb] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-extrabold text-[#1f2a44]">Таны ангиуд</label>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {filteredClasses.length === 0 ? (
                  <div className="rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-4 text-sm font-semibold text-[#5c6f91]">Анги олдсонгүй.</div>
                ) : (
                  filteredClasses.map((c) => {
                    const isActive = c.id === classId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setClassId(c.id)}
                        className={[
                          "rounded-2xl border p-4 text-left transition",
                          isActive ? "border-primary bg-[#eef6ff]" : "border-[#d9e6fb] bg-white hover:bg-[#f7fbff]",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-extrabold text-[#1f2a44]">{c.name}</p>
                            <p className="mt-1 text-sm text-[#5c6f91]">{c.studentIds.length} сурагч</p>
                          </div>
                          <Users className="h-5 w-5 text-[#2f73c4]" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {warningTooLarge ? (
              <div className="mt-4 rounded-2xl border border-[#ffe9ad] bg-[#fff7e8] p-4">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="mt-0.5 h-5 w-5 text-[#8b6800]" />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[#1f2a44]">Том анги</p>
                    <p className="mt-1 text-sm text-[#5c6f91]">Олон сурагчтай үед бэлтгэл удааширч болзошгүй — дэмо орчинд анхаарна уу.</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-5">
              <Button
                variant="primary"
                onClick={onContinue}
                disabled={!rules || !currentClass || currentClass.studentIds.length === 0}
                className="w-full sm:w-auto"
              >
                Үргэлжлүүлэх
              </Button>
            </div>
            {currentClass && currentClass.studentIds.length === 0 ? (
              <p className="mt-2 text-xs font-semibold text-[#8b6800]">Энэ ангид сурагч алга.</p>
            ) : null}
          </Card>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-[#d9e6fb] bg-[#eef6ff] p-2 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#1f2a44]">Сурагч бүр өөр хувилбар авна</p>
                <p className="mt-2 text-sm text-[#5c6f91] leading-relaxed">
                  Нэг хуваалцсан линк хангалттай. Систем асуулт болон сонголтын дарааллыг сурагч бүрт өөрөөр тохируулна — та зүгээр л ангиа сонгоно.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-extrabold text-[#1f2a44]">Сонгогдсон анги</p>
            {currentClass ? (
              <div className="mt-3 rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-4">
                <p className="text-sm font-extrabold text-[#1f2a44]">{currentClass.name}</p>
                <p className="mt-1 text-2xl font-extrabold text-primary">{currentClass.studentIds.length}</p>
                <p className="text-sm text-[#5c6f91]">сурагч</p>
              </div>
            ) : (
              <div className="mt-3 rounded-2xl border border-[#d9e6fb] bg-[#f7fbff] p-4 text-sm text-[#5c6f91]">Анги сонгоно уу.</div>
            )}
          </Card>
        </div>
      </div>
    </TeacherExamWizardShell>
  );
}
