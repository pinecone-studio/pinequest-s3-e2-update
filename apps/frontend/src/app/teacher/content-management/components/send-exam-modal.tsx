"use client";

import { useMemo, useState } from "react";
import type { Exam, ExamVariant, TeacherClass } from "../types";
import { generateExamLink } from "../utils";
import { ClassPicker } from "./class-picker";
import { GeneratedLinkBox } from "./generated-link-box";

export function SendExamModal({
  open,
  exam,
  classes,
  onClose,
  onSend,
  onOpenStudentView,
}: {
  open: boolean;
  exam: Exam | null;
  classes: TeacherClass[];
  onClose: () => void;
  onSend: (classId: string, variant: ExamVariant, link: string) => void;
  onOpenStudentView: (link: string) => void;
}) {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id ?? "");
  const [selectedVariant, setSelectedVariant] = useState<ExamVariant>("A");
  const [variantCount, setVariantCount] = useState<2 | 3 | 4>(3);
  const [copyNote, setCopyNote] = useState("");
  const availableVariants = (["A", "B", "C", "D"] as const).slice(0, variantCount);

  const link = useMemo(() => {
    if (!exam || !selectedClassId) return "";
    return generateExamLink(exam.id, selectedClassId, selectedVariant);
  }, [exam, selectedClassId, selectedVariant]);

  if (!open || !exam) return null;

  const selectedClass = classes.find((item) => item.id === selectedClassId) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-3">
      <section className="w-full max-w-3xl rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-4 font-bold text-[#1f2a44]">Шалгалт илгээх</h3>
            <p className="text-2 text-[#5c6f91]">
              “{exam.title}” шалгалтыг анги руу илгээж, сурагчийн линк үүсгэнэ.
            </p>
          </div>
          <button
            className="rounded-lg border border-[#d9e6fb] px-2 py-1 text-2 text-[#5c6f91]"
            onClick={onClose}
            type="button"
          >
            Хаах
          </button>
        </div>

        <div className="mt-3 rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
          <p className="text-2 font-semibold text-[#1f2a44]">Сонгосон шалгалт</p>
          <p className="text-2 text-[#5c6f91]">
            {exam.subject} · {exam.grade} · {exam.questions.length} асуулт
          </p>
        </div>

        <div className="mt-3 space-y-2">
          <p className="text-2 font-semibold text-[#1f2a44]">1. Хувилбарын тоо сонгох</p>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4].map((count) => (
              <button
                className={
                  "rounded-lg border px-3 py-2 text-2 font-semibold " +
                  (variantCount === count
                    ? "border-[#4f9dff] bg-[#eef6ff] text-[#2f73c4]"
                    : "border-[#d9e6fb] bg-white text-[#1f2a44]")
                }
                key={count}
                onClick={() => {
                  const nextCount = count as 2 | 3 | 4;
                  setVariantCount(nextCount);
                  const nextVariants = (["A", "B", "C", "D"] as const).slice(0, nextCount);
                  if (!nextVariants.includes(selectedVariant)) {
                    setSelectedVariant("A");
                  }
                }}
                type="button"
              >
                {count} хувилбар
              </button>
            ))}
          </div>
          <p className="text-2 font-semibold text-[#1f2a44]">2. Илгээх хувилбар сонгох</p>
          <div className="flex flex-wrap gap-2">
            {availableVariants.map((variant) => (
              <button
                className={
                  "rounded-lg border px-3 py-2 text-2 font-semibold " +
                  (selectedVariant === variant
                    ? "border-[#4f9dff] bg-[#eef6ff] text-[#2f73c4]"
                    : "border-[#d9e6fb] bg-white text-[#1f2a44]")
                }
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                type="button"
              >
                Хувилбар {variant}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <p className="text-2 font-semibold text-[#1f2a44]">3. Анги сонгох</p>
          <ClassPicker classes={classes} onSelect={setSelectedClassId} selectedClassId={selectedClassId} />
        </div>

        {selectedClass ? (
          <div className="mt-3">
            <GeneratedLinkBox
              link={link}
              onCopy={async () => {
                if (!link) return;
                try {
                  await navigator.clipboard.writeText(link);
                  setCopyNote("Линк хууллаа.");
                  setTimeout(() => setCopyNote(""), 1500);
                } catch {
                  setCopyNote("Хуулах боломжгүй байна.");
                }
              }}
            />
            {copyNote ? <p className="mt-1 text-2 text-[#2d6fbe]">{copyNote}</p> : null}
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-xl border border-[#d9e6fb] bg-white px-3 py-2 text-2 font-semibold text-[#335c96]"
            onClick={() => onOpenStudentView(link)}
            type="button"
          >
            Сурагчийн харагдац нээх
          </button>
          <button
            className="rounded-xl bg-[#34c759] px-4 py-2 text-2 font-semibold text-white"
            onClick={() => onSend(selectedClassId, selectedVariant, link)}
            type="button"
          >
            Анги руу илгээх
          </button>
        </div>
      </section>
    </div>
  );
}
