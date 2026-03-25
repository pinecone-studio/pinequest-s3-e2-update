"use client";
import { useEffect, useState } from "react";
export default function StudentPage() {
  const choices = [
    { id: "A", label: "x = 3" },
    { id: "B", label: "x = 5" },
    { id: "C", label: "x = 7" },
    { id: "D", label: "x = 9" },
  ];
  const questions = Array.from({ length: 20 }, (_, i) => i + 1);
  const [step, setStep] = useState<"info" | "exam">("info");
  const [selectedChoice, setSelectedChoice] = useState("B");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(38 * 60);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const [touched, setTouched] = useState({ fullName: false, email: false, grade: false, school: false });
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = fullName.trim() && grade.trim() && school.trim() && isEmailValid;
  useEffect(() => {
    if (step !== "exam") return;
    const timer = setInterval(() => setRemainingSeconds((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [step]);
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0"), seconds = String(remainingSeconds % 60).padStart(2, "0");
  const markTouched = (key: keyof typeof touched) => setTouched((p) => ({ ...p, [key]: true }));
  const inputClass = (invalid: boolean) => `mt-2 w-full rounded-xl border bg-[#f8fafc] px-4 py-3 text-sm font-medium text-[#1f2a44] outline-none transition ${invalid ? "border-[#ef4444] focus:border-[#ef4444]" : "border-[#d5dbe7] focus:border-[#4ca3f0]"}`;
  return (
    <main className="min-h-screen bg-[#f3f5f9] px-4 py-8 text-[#1f2a44]">
      <div className="mx-auto w-full max-w-4xl space-y-5">
        {step === "info" && (
          <section className="rounded-2xl border border-[#e0e4ec] bg-white px-6 py-6 shadow-[0_10px_30px_rgba(20,30,60,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xl font-semibold">Сурагчийн мэдээлэл</p>
                <p className="mt-1 text-sm text-[#6a7390]">Шалгалт эхлэхийн өмнө мэдээллээ бөглөнө үү.</p>
              </div>
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#3b4a86]">Алхам 1/2</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-[#3a4763]">Овог нэр</label>
                <input className={inputClass(touched.fullName && !fullName.trim())} placeholder="Элзий-Орших Түвшин" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} onBlur={() => markTouched("fullName")} />
                {touched.fullName && !fullName.trim() && <p className="mt-2 text-xs font-medium text-[#ef4444]">Нэрээ заавал бөглөнө үү.</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#3a4763]">И-мэйл</label>
                <input className={inputClass(touched.email && !isEmailValid)} placeholder="student@school.mn" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => markTouched("email")} />
                {touched.email && !isEmailValid && <p className="mt-2 text-xs font-medium text-[#ef4444]">Зөв и-мэйл хаяг оруулна уу.</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#3a4763]">Анги</label>
                <input className={inputClass(touched.grade && !grade.trim())} placeholder="8A" type="text" value={grade} onChange={(e) => setGrade(e.target.value)} onBlur={() => markTouched("grade")} />
                {touched.grade && !grade.trim() && <p className="mt-2 text-xs font-medium text-[#ef4444]">Ангиа заавал бөглөнө үү.</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#3a4763]">Сургууль</label>
                <input className={inputClass(touched.school && !school.trim())} placeholder="Сүхбаатар сургууль" type="text" value={school} onChange={(e) => setSchool(e.target.value)} onBlur={() => markTouched("school")} />
                {touched.school && !school.trim() && <p className="mt-2 text-xs font-medium text-[#ef4444]">Сургуулиа заавал бөглөнө үү.</p>}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#6a7390]">Мэдээллээ зөв бөглөсний дараа шалгалтаа эхлүүлнэ.</p>
              <button
                className={`rounded-lg px-5 py-2 text-sm font-semibold text-white transition ${isFormValid ? "bg-[#1f4ed8] hover:bg-[#1a42b6]" : "cursor-not-allowed bg-[#9fb4e8]"}`}
                type="button"
                disabled={!isFormValid}
                onClick={() => {
                  if (!isFormValid) return setTouched({ fullName: true, email: true, grade: true, school: true });
                  setRemainingSeconds(38 * 60);
                  setStep("exam");
                }}
              >
                Дараагийн алхам →
              </button>
            </div>
          </section>
        )}
        {step === "exam" && (
          <>
            <section className="rounded-2xl border border-[#e0e4ec] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(20,30,60,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold">Математик — 8-р анги</p>
                  <p className="mt-1 text-sm text-[#6a7390]">2025-2026 оны хичээлийн жил · II улирал</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#e2e6ef] bg-[#f7f9fc] px-4 py-2 text-sm font-semibold text-[#39415c]">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f2e9e5] text-[#a35f45]">⏱</span>
                  {minutes}:{seconds}
                  <span className="text-xs font-medium text-[#7981a0]">үлдсэн хугацаа</span>
                </div>
              </div>
            </section>
            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-6 shadow-[0_10px_30px_rgba(20,30,60,0.06)]">
              <p className="text-sm font-semibold text-[#6a7390]">Асуулт 1</p>
              <h2 className="mt-2 text-lg font-semibold">3x + 7 = 22. X-ийн утга аль нь вэ?</h2>
              <div className="mt-4 space-y-3">
                {choices.map((choice) => {
                  const isSelected = selectedChoice === choice.id;
                  return (
                    <button
                      key={choice.id}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${isSelected ? "border-[#7aa7ff] bg-[#f1f5ff] text-[#2f4c9a]" : "border-[#e4e7ef] bg-white text-[#3a4564] hover:border-[#c9d4ea]"}`}
                      type="button"
                      onClick={() => setSelectedChoice(choice.id)}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isSelected ? "bg-[#2f5bd1] text-white" : "bg-[#f2f4f8] text-[#4a5574]"}`}>{choice.id}</span>
                        {choice.label}
                      </span>
                      {isSelected && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2f5bd1] text-xs font-bold text-white">✓</span>}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <button className="rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]" type="button" onClick={() => setStep("info")}>
                  ← Өмнөх
                </button>
                <div className="flex items-center gap-3">
                  <button className="rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]" type="button">Flag хийх</button>
                  <button className="rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]" type="button">Дараах →</button>
                </div>
              </div>
            </section>
            <section className="rounded-2xl border border-[#e0e4ec] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(20,30,60,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-[#2f3a57]">Асуултууд</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5c6786]">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#1f4ed8]" />Одоогийн</span>
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#17a34a]" />Хариулсан</span>
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f59e0b]" />Flagged</span>
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#cbd5e1]" />Хариулаагүй</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-6 gap-4 sm:grid-cols-10">
                {questions.map((num) => {
                  const isCurrent = num === currentQuestion;
                  const isAnswered = [2, 3, 6, 8, 9].includes(num);
                  const isFlagged = num === 5;
                  return (
                    <button
                      key={num}
                      className={`flex h-15 w-15 items-center justify-center rounded-lg border text-sm font-semibold ${isCurrent ? "border-[#1f4ed8] bg-[#1f4ed8] text-white" : isFlagged ? "border-[#f59e0b] bg-[#fff7ed] text-[#b45309]" : isAnswered ? "border-[#22c55e] bg-[#ecfdf3] text-[#15803d]" : "border-[#e2e6ef] bg-white text-[#55607d]"}`}
                      type="button"
                      onClick={() => setCurrentQuestion(num)}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#5c6786]">Progress: <span className="font-semibold text-[#2f3a57]">5</span>/20 answered</p>
                <button className="rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]" type="button" onClick={() => setShowConfirm(true)}>Дуусгах</button>
              </div>
            </section>
          </>
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff] text-[#1f4ed8]">!</span>
              <div>
                <h4 className="text-lg font-semibold">Дуусгахад итгэлтэй?</h4>
                <p className="mt-1 text-sm text-[#5c6786]">Дуусгасны дараа хариултаа дахин засах боломжгүй.</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button className="rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]" type="button" onClick={() => setShowConfirm(false)}>Болих</button>
              <button className="rounded-lg bg-[#1f4ed8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]" type="button" onClick={() => { setShowConfirm(false); setShowSent(true); }}>
                Тийм, дуусгах
              </button>
            </div>
          </div>
        </div>
      )}
      {showSent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf3] text-[#16a34a]">✓</div>
            <h4 className="mt-3 text-lg font-semibold">Илгээлээ!</h4>
            <p className="mt-1 text-sm text-[#5c6786]">Таны шалгалт амжилттай илгээгдлээ.</p>
            <button className="mt-5 w-full rounded-lg bg-[#1f4ed8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]" type="button" onClick={() => setShowSent(false)}>
              Ойлголоо
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
