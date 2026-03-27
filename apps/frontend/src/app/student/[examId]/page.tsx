"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ACTIVE_STUDENTS_STORAGE_KEY = "pinequest.activeStudents.v1";

type ActiveStudentEntry = {
  id: string;
  fullName: string;
  email: string;
  grade: string;
  school: string;
  startedAt: number;
};

function upsertActiveStudent(entry: ActiveStudentEntry) {
  try {
    const raw = window.localStorage.getItem(ACTIVE_STUDENTS_STORAGE_KEY);
    const parsed: ActiveStudentEntry[] = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(parsed) ? parsed : [];
    const idx = next.findIndex((x) => x.id === entry.id);
    if (idx >= 0) next[idx] = entry;
    else next.push(entry);
    window.localStorage.setItem(
      ACTIVE_STUDENTS_STORAGE_KEY,
      JSON.stringify(next),
    );
  } catch {
    // ignore storage errors in demo
  }
}

function removeActiveStudent(id: string) {
  try {
    const raw = window.localStorage.getItem(ACTIVE_STUDENTS_STORAGE_KEY);
    const parsed: ActiveStudentEntry[] = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(parsed)
      ? parsed.filter((x) => x?.id !== id)
      : [];
    window.localStorage.setItem(
      ACTIVE_STUDENTS_STORAGE_KEY,
      JSON.stringify(next),
    );
  } catch {
    // ignore storage errors in demo
  }
}
export default function StudentPage() {
  const params = useParams();
  const examId = params.examId as string;
  console.log("examId", examId);
  const base = [
    {
      text: "3x + 7 = 22. X-ийн утга аль нь вэ?",
      choices: ["x = 3", "x = 5", "x = 7", "x = 9"],
    },
    {
      text: "0.25-ийн тэнцүү бутархай аль нь вэ?",
      choices: ["1/2", "1/4", "1/5", "2/5"],
    },
    { text: "2^5 = ?", choices: ["10", "16", "32", "64"] },
    {
      text: "Тойргийн талбайн томьёо аль нь вэ?",
      choices: ["πr", "2πr", "πr²", "2πr²"],
    },
    { text: "√144 = ?", choices: ["11", "12", "13", "14"] },
  ];
  const total = 20;
  const questions = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => {
        const q = base[i] ?? {
          text: `Асуулт ${i + 1}`,
          choices: ["A", "B", "C", "D"],
        };
        return { ...q, id: i + 1 };
      }),
    [],
  );
  const [step, setStep] = useState<"info" | "exam" | "done">("info");
  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
  if (step !== "exam") return;

  const blockShortcuts = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ["c", "x", "v"].includes(key)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };

  const preventContextMenu = (e: MouseEvent) => e.preventDefault();

  const preventClipboard = (e: ClipboardEvent) => e.preventDefault();

  document.addEventListener("keydown", blockShortcuts, true);
  document.addEventListener("contextmenu", preventContextMenu, true);
  document.addEventListener("copy", preventClipboard, true);
  document.addEventListener("cut", preventClipboard, true);
  document.addEventListener("paste", preventClipboard, true);

  return () => {
    document.removeEventListener("keydown", blockShortcuts, true);
    document.removeEventListener("contextmenu", preventContextMenu, true);
    document.removeEventListener("copy", preventClipboard, true);
    document.removeEventListener("cut", preventClipboard, true);
    document.removeEventListener("paste", preventClipboard, true);
  };
}, [step]);


  const q = questions[current - 1];
  const answeredCount = Object.keys(answers).length;
  return (
    <main className="min-h-screen bg-[#f3f5f9] px-4 py-8 text-[#1f2a44]">
      <div className="mx-auto w-full max-w-4xl space-y-5">
        <section className="rounded-2xl border border-[#e0e4ec] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(20,30,60,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xl font-semibold">Математик — 8-р анги</p>
              <p className="mt-1 text-sm text-[#6a7390]">
                2025-2026 оны хичээлийн жил · II улирал
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#e2e6ef] bg-[#f7f9fc] px-4 py-2 text-sm font-semibold text-[#39415c]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f2e9e5] text-[#a35f45]">
                ⏱
              </span>
              {/* {minutes}:{seconds} */}
              <span className="text-xs font-medium text-[#7981a0]">
                үлдсэн хугацаа
              </span>
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-[#e0e4ec] bg-white p-6 shadow-[0_10px_30px_rgba(20,30,60,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#2f3a57]">
              Явц: {current}/{total} асуулт
            </p>
            <p className="text-xs text-[#5c6786]">
              Progress:{" "}
              <span className="font-semibold text-[#2f3a57]">
                {answeredCount}
              </span>
              /{total} answered
            </p>
          </div>
        </section>
        <section className="rounded-2xl border border-[#e0e4ec] bg-white p-6 shadow-[0_10px_30px_rgba(20,30,60,0.06)]">
          <p className="text-sm font-semibold text-[#6a7390]">
            Асуулт {current}
          </p>
          <h2 className="mt-2 text-lg font-semibold">{q.text}</h2>
          <div className="mt-4 space-y-3">
            {q.choices.map((label, idx) => {
              const id = ["A", "B", "C", "D"][idx],
                isSelected = answers[current] === id;
              return (
                <button
                  key={id}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${isSelected ? "border-[#7aa7ff] bg-[#f1f5ff] text-[#2f4c9a]" : "border-[#e4e7ef] bg-white text-[#3a4564] hover:border-[#c9d4ea]"}`}
                  type="button"
                  onClick={() => setAnswers((p) => ({ ...p, [current]: id }))}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isSelected ? "bg-[#2f5bd1] text-white" : "bg-[#f2f4f8] text-[#4a5574]"}`}
                    >
                      {id}
                    </span>
                    {label}
                  </span>
                  {isSelected && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2f5bd1] text-xs font-bold text-white">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              className="rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]"
              type="button"
              onClick={() => setCurrent((c) => Math.max(1, c - 1))}
            >
              ← Өмнөх
            </button>
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]"
                type="button"
                onClick={() =>
                  setFlagged((p) => ({ ...p, [current]: !p[current] }))
                }
              >
                Flag хийх
              </button>
              <button
                className="rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
                type="button"
                onClick={() => setCurrent((c) => Math.min(total, c + 1))}
              >
                Дараах →
              </button>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-end">
            <button
              className="rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
              type="button"
              onClick={() => setShowConfirm(true)}
            >
              Дуусгах
            </button>
          </div>
        </section>
        <section className="rounded-2xl border border-[#e0e4ec] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(20,30,60,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-[#2f3a57]">Асуултууд</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5c6786]">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#1f4ed8]" />
                Одоогийн
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                Хариулсан
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                Flagged
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#cbd5e1]" />
                Хариулаагүй
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-4 sm:grid-cols-10">
            {questions.map((item) => {
              const isCurrent = item.id === current,
                isAnswered = answers[item.id] != null,
                isFlagged = flagged[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrent(item.id)}
                  className={`flex h-15 w-15 items-center justify-center rounded-lg border text-sm font-semibold ${isCurrent ? "border-[#1f4ed8] bg-[#1f4ed8] text-white" : isFlagged ? "border-[#f59e0b] bg-[#fff7ed] text-[#b45309]" : isAnswered ? "border-[#22c55e] bg-[#ecfdf3] text-[#15803d]" : "border-[#e2e6ef] bg-white text-[#55607d]"}`}
                >
                  {item.id}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#5c6786]">
              Progress:{" "}
              <span className="font-semibold text-[#2f3a57]">
                {answeredCount}
              </span>
              /{total} answered
            </p>
            <button
              className="rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
              type="button"
              onClick={() => setShowConfirm(true)}
            >
              Finish exam
            </button>
          </div>
        </section>
        {step === "done" && (
          <section className="rounded-2xl border border-[#e0e4ec] bg-white px-6 py-10 text-center shadow-[0_10px_30px_rgba(20,30,60,0.08)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfdf3] text-xl font-bold text-[#16a34a]">
              ✓
            </div>
            <h2 className="mt-3 text-2xl font-semibold">
              Шалгалт амжилттай дууслаа
            </h2>
            <p className="mt-2 text-sm text-[#5c6786]">
              Таны хариултууд амжилттай илгээгдлээ.
            </p>
            <button
              className="mt-6 rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
              type="button"
              onClick={() => setStep("info")}
            >
              Буцах
            </button>
          </section>
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff] text-[#1f4ed8]">
                !
              </span>
              <div>
                <h4 className="text-lg font-semibold">Дуусгахад итгэлтэй?</h4>
                <p className="mt-1 text-sm text-[#5c6786]">
                  Дуусгасны дараа хариултаа дахин засах боломжгүй.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                className="rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]"
                type="button"
                onClick={() => setShowConfirm(false)}
              >
                Болих
              </button>
              <button
                className="rounded-lg bg-[#1f4ed8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setStep("done");
                }}
              >
                Тийм, дуусгах
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
