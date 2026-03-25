"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, Camera, Users } from "lucide-react";

export default function ExamOptimizationPage() {
  const ACTIVE_STUDENTS_STORAGE_KEY = "pinequest.activeStudents.v1";
  type ActiveStudentEntry = {
    id: string;
    fullName: string;
    email: string;
    grade: string;
    school: string;
    startedAt: number;
  };

  const MONITOR_TOTAL_STUDENTS = 245;
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [activeStudents, setActiveStudents] = useState<ActiveStudentEntry[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const currentClassName = useMemo(() => {
    const grades = activeStudents
      .map((s) => s.grade?.trim())
      .filter((g): g is string => Boolean(g));

    if (!grades.length) return "—";

    const freq = new Map<string, number>();
    for (const g of grades) freq.set(g, (freq.get(g) ?? 0) + 1);

    let bestGrade = grades[0];
    let bestCount = 0;
    for (const [g, c] of freq.entries()) {
      if (c > bestCount) {
        bestCount = c;
        bestGrade = g;
      }
    }

    // If multiple grades are tied, show "олон анги" but keep best as hint.
    const uniqueCount = freq.size;
    if (uniqueCount > 1) {
      return `Олон анги (${bestGrade})`;
    }

    return bestGrade;
  }, [activeStudents]);

  const readActiveStudents = useCallback((): ActiveStudentEntry[] => {
    try {
      const raw = window.localStorage.getItem(ACTIVE_STUDENTS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((x) => x && typeof x === "object")
        .map((x) => x as ActiveStudentEntry)
        .filter(
          (x) =>
            typeof x.id === "string" &&
            typeof x.fullName === "string" &&
            typeof x.email === "string" &&
            typeof x.startedAt === "number",
        );
    } catch {
      return [];
    }
  }, []);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    setLastUpdatedAt(Date.now());
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    setLastUpdatedAt(Date.now());
  }, []);

  useEffect(() => {
    const sync = () => {
      const next = readActiveStudents();
      setActiveStudents(next);
      setLastUpdatedAt(Date.now());
    };

    sync();

    const onStorage = (e: StorageEvent) => {
      if (e.key !== ACTIVE_STUDENTS_STORAGE_KEY) return;
      sync();
    };
    window.addEventListener("storage", onStorage);

    // Same-tab updates won't fire "storage", so poll lightly.
    const interval = window.setInterval(sync, 1000);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(interval);
    };
  }, [readActiveStudents]);

  return (
    <section className="px-6 py-8 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-2xl border border-[#d9dee8] bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-5 font-extrabold text-[#1f2a44]">Бодит цагийн жагсаалт</h2>
              <p className="mt-2 text-3 text-[#66789f]">
                {isMonitoring
                  ? "Шалгалт/хариултын статусыг бодит цагаар шинэчилж байна."
                  : "Хяналтыг эхлүүлэхийн тулд дээрх товчийг дарна уу."}
              </p>
              <p className="mt-2 text-3 text-[#66789f]">
                Одоо явагдаж буй анги:{" "}
                <span className="font-bold text-[#1f2a44]">{currentClassName}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!isMonitoring ? (
                <button
                  type="button"
                  onClick={startMonitoring}
                  className="rounded-xl bg-teal-600 px-4 py-2.5 text-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Хяналт эхлүүлэх
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopMonitoring}
                  className="rounded-xl border border-[#d9dee8] bg-white px-4 py-2.5 text-4 font-semibold text-[#2f3c59] transition hover:bg-[#f8fafc]"
                >
                  Зогсоох
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              tone="blue"
              title="Нийт сурагч"
              value={String(MONITOR_TOTAL_STUDENTS)}
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              tone="green"
              title="Идэвхтэй"
              value={String(activeStudents.length)}
              icon={<span className="text-teal-700">●</span>}
            />
            <StatCard
              tone="amber"
              title="Анхааруулах"
              value={"0"}
              icon={<AlertTriangle className="h-5 w-5" />}
            />
            <StatCard
              tone="red"
              title="Салсан"
              value={"0"}
              icon={<Camera className="h-5 w-5" />}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-4 font-extrabold text-[#1f2a44]">Сурагчдын жагсаалт</h3>

            <div className="mt-4 space-y-4">
              {activeStudents.length ? (
                [...activeStudents]
                  .sort((a, b) => b.startedAt - a.startedAt)
                  .slice(0, 10)
                  .map((s) => <ActiveStudentRow key={s.id} student={s} />)
              ) : (
                <div className="rounded-2xl border border-[#d9dee8] bg-[#f8fafc] px-5 py-4 text-4 text-[#66789f]">
                  Одоогоор линкээр орсон сурагч алга байна.
                </div>
              )}
            </div>

            <p className="mt-4 text-3 text-[#66789f]">
              {lastUpdatedAt
                ? `Сүүлд шинэчлэгдсэн: ${new Date(lastUpdatedAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : " "}
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
function StatCard({
  tone,
  title,
  value,
  icon,
}: {
  tone: "blue" | "green" | "amber" | "red";
  title: string;
  value: string;
  icon: ReactNode;
}) {
  const cfg = {
    blue: {
      bg: "bg-[#e6f2ff]",
      value: "text-[#0b78d1]",
      border: "border-[#cfe6ff]",
      iconWrap: "text-[#0b78d1]",
    },
    green: {
      bg: "bg-[#e8f5ee]",
      value: "text-[#12b650]",
      border: "border-[#cdecd7]",
      iconWrap: "text-[#11a44c]",
    },
    amber: {
      bg: "bg-[#fff4e5]",
      value: "text-[#f59e0b]",
      border: "border-[#ffe5b8]",
      iconWrap: "text-[#a16207]",
    },
    red: {
      bg: "bg-[#ffe9ec]",
      value: "text-[#f15f6a]",
      border: "border-[#ffd3d9]",
      iconWrap: "text-[#d61f3f]",
    },
  }[tone];

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-3 font-semibold text-[#66789f]">{title}</p>
          <p className={`mt-2 text-6 font-extrabold ${cfg.value}`}>{value}</p>
        </div>
        <div className={`mt-1 ${cfg.iconWrap}`}>{icon}</div>
      </div>
    </div>
  );
}

function ActiveStudentRow({ student }: { student: { fullName: string; email: string; grade: string; school: string; startedAt: number } }) {
  const initial = (student.fullName?.trim()?.charAt(0) || "?").toUpperCase();
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#35c354] bg-[#e8f5ee] px-5 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#11a44c] text-white">
          <span className="text-4 font-extrabold">{initial}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-4 font-extrabold text-[#1f2a44]">{student.fullName}</p>
          <p className="truncate text-3 text-[#66789f]">
            {student.grade} · {student.school}
          </p>
          <p className="truncate text-3 text-[#66789f]">{student.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[#12b650] px-4 py-1.5 text-3 font-semibold text-white">
          Идэвхтэй
        </span>
      </div>
    </div>
  );
}

