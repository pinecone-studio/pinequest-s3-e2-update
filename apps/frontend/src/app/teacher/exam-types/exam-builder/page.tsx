"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Save, Send, Shuffle, X } from "lucide-react";
import { useExamFlow, parseSubject } from "../shared/store";
import { SUBJECTS } from "../shared/types";
import { examWarnings, questionTypeLabel } from "../shared/utils";

export default function ExamBuilderPage() {
  const {
    examDraft,
    selectedQuestions,
    setExamMeta,
    removeQuestion,
    reorderQuestion,
    generateExamVariants,
    markSent,
  } = useExamFlow();
  const [note, setNote] = useState("");

  const warnings = useMemo(() => examWarnings(selectedQuestions), [selectedQuestions]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <h2 className="text-6 font-extrabold text-[#1f2a44]">Шалгалт үүсгэгч</h2>
        <p className="text-3 text-[#5c6f91]">
          Сонгосон асуултаар шалгалт үүсгээд Variant A/B/C гаргана.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
          <input
            className="h-10 rounded-xl border border-[#d9e6fb] px-3 text-3"
            onChange={(e) => setExamMeta({ title: e.target.value })}
            placeholder="Шалгалтын нэр"
            value={examDraft.title}
          />
          <select
            className="h-10 rounded-xl border border-[#d9e6fb] px-3 text-3"
            onChange={(e) => setExamMeta({ subject: parseSubject(e.target.value) })}
            value={examDraft.subject}
          >
            {SUBJECTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <input
            className="h-10 rounded-xl border border-[#d9e6fb] px-3 text-3"
            min={10}
            onChange={(e) => setExamMeta({ durationMinutes: Number(e.target.value) || 40 })}
            type="number"
            value={examDraft.durationMinutes}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <h3 className="text-5 font-bold text-[#1f2a44]">Сонгосон асуултууд</h3>
        {selectedQuestions.length === 0 ? (
          <div className="mt-2 rounded-xl border border-dashed border-[#d9e6fb] bg-[#f7fbff] p-6 text-3 text-[#5c6f91]">
            Одоогоор асуулт сонгогдоогүй байна. Эхлээд “Асуултын сан” дээрээс сонгоно уу.
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {selectedQuestions.map((q, index) => (
              <div
                className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-3"
                key={q.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-4 font-bold text-[#1f2a44]">
                      {index + 1}. {q.title}
                    </p>
                    <p className="text-3 text-[#5c6f91]">
                      {q.subject} · {questionTypeLabel[q.type]} · {q.difficulty}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="rounded-lg border border-[#d9e6fb] bg-white px-2 py-1 text-3"
                      onClick={() => reorderQuestion(q.id, "up")}
                      type="button"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-lg border border-[#d9e6fb] bg-white px-2 py-1 text-3"
                      onClick={() => reorderQuestion(q.id, "down")}
                      type="button"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-lg border border-[#ff6b6b]/40 bg-[#ff6b6b]/10 px-2 py-1 text-3 text-[#b94949]"
                      onClick={() => removeQuestion(q.id)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <h3 className="text-5 font-bold text-[#1f2a44]">Ухаалаг анхааруулга</h3>
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
          <Warn text={`Overused асуулт: ${warnings.overused}`} />
          <Warn text={`Needs review асуулт: ${warnings.weak}`} />
          <Warn text={`Too easy асуулт: ${warnings.easy}`} />
          <Warn text={`Төстэй хэв шинжтэй асуулт: ${warnings.duplicateLike}`} />
        </div>
      </div>

      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <h3 className="text-5 font-bold text-[#1f2a44]">Variant A / B / C</h3>
        <p className="text-3 text-[#5c6f91]">
          B, C хувилбар нь сонгосон асуултуудын shuffle хийгдсэн хувилбар.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-[#4f9dff] px-3 py-2 text-3 font-semibold text-white"
            onClick={generateExamVariants}
            type="button"
          >
            <Shuffle className="h-4 w-4" />
            Variant үүсгэх
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-[#d9e6fb] bg-white px-3 py-2 text-3 font-semibold text-[#1f2a44]"
            onClick={() => setNote("Ноорог амжилттай хадгалагдлаа (mock).")}
            type="button"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-[#34c759] px-3 py-2 text-3 font-semibold text-white"
            onClick={() => {
              markSent();
              setNote("Шалгалтын линк сурагчдад илгээгдлээ (mock).");
            }}
            type="button"
          >
            <Send className="h-4 w-4" />
            Send Exam
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
          {(["A", "B", "C"] as const).map((variant) => (
            <div className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-3" key={variant}>
              <p className="text-4 font-bold text-[#1f2a44]">Variant {variant}</p>
              <p className="text-3 text-[#5c6f91]">
                {(examDraft.variants[variant] ?? []).length} асуулт
              </p>
            </div>
          ))}
        </div>
        {note && (
          <div className="mt-2 rounded-lg bg-[#eef6ff] px-3 py-2 text-3 text-[#335c96]">
            {note}
          </div>
        )}
      </div>
    </div>
  );
}

function Warn({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-[#ffd65a]/50 bg-[#fff8dd] px-3 py-2 text-3 text-[#8f6b00]">
      {text}
    </div>
  );
}
