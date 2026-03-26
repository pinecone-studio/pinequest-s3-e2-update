"use client";
import { useRouter } from "next/navigation";
import {  useState } from "react";

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
    window.localStorage.setItem(ACTIVE_STUDENTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors in demo
  }
}

function removeActiveStudent(id: string) {
  try {
    const raw = window.localStorage.getItem(ACTIVE_STUDENTS_STORAGE_KEY);
    const parsed: ActiveStudentEntry[] = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(parsed) ? parsed.filter((x) => x?.id !== id) : [];
    window.localStorage.setItem(ACTIVE_STUDENTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors in demo
  }
}
export default function StudentPage() {
  const router = useRouter()
  // const questions = useMemo(
  //   () =>
  //     Array.from({ length: total }, (_, i) => {
  //       const q = base[i] ?? { text: `Асуулт ${i + 1}`, choices: ["A", "B", "C", "D"] };
  //       return { ...q, id: i + 1 };
  //     }),
  //   []
  // );




  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [touched, setTouched] = useState({ fullName: false, email: false, grade: false, school: false });
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = fullName.trim() && grade.trim() && school.trim() && isEmailValid;

  const markTouched = (key: keyof typeof touched) => setTouched((p) => ({ ...p, [key]: true }));
  const inputClass = (invalid: boolean) => `mt-2 w-full rounded-xl border bg-[#f8fafc] px-4 py-3 text-sm font-medium text-[#1f2a44] outline-none transition ${invalid ? "border-[#ef4444] focus:border-[#ef4444]" : "border-[#d5dbe7] focus:border-[#4ca3f0]"}`;



  return (
    <main className="min-h-screen bg-[#f3f5f9] px-4 py-8 text-[#1f2a44]">
      <div className="mx-auto w-full max-w-4xl space-y-5">

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
                  upsertActiveStudent({
                    id: email.trim().toLowerCase(),
                    fullName: fullName.trim(),
                    email: email.trim(),
                    grade: grade.trim(),
                    school: school.trim(),
                    startedAt: Date.now(),
                  });
                  router.push(`/student/8f3d42b0-2c8e-4534-b47e-990c111a13b3`);
                }}
              >
                Дараагийн алхам →
              </button>
            </div>
          </section>
      </div>
    </main>
  );
}
