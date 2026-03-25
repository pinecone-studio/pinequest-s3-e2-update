"use client";

import { useRouter } from "next/navigation";
import { Plus, FileText, Monitor } from "lucide-react";

type TeacherView = "overview" | "review" | "stats";

type HeaderProps = {
  variant?: "dashboard" | "tabs";
  activeView?: TeacherView;
  onChangeView?: (view: TeacherView) => void;
  /** Hide specific tabs (e.g. hide "Анги" on shalgalt page) */
  hiddenTabs?: TeacherView[];
};

const ALL_TABS: { view: TeacherView; label: string }[] = [
  { view: "overview", label: "Шалгалт" },
  { view: "review", label: "Анги" },
  { view: "stats", label: "Тоон үзүүлэлт" },
];

export default function Header({ variant = "dashboard", activeView, onChangeView, hiddenTabs = [] }: HeaderProps) {
  const router = useRouter();
  const TABS = ALL_TABS.filter((t) => !hiddenTabs.includes(t.view));

  const handleTabClick = (view: TeacherView) => {
    if (onChangeView) {
      onChangeView(view);
      return;
    }
    if (view === "overview") router.push("/teacher/shalgalt");
    else if (view === "review") router.push("/teacher/angi");
    else router.push("/teacher/statistic");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <button
          className="flex shrink-0 items-center gap-3 rounded-xl px-1 py-1.5 text-left transition-colors hover:bg-[#f1f5f9] active:scale-[0.99]"
          onClick={() => router.push("/")}
          type="button"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-sm">
            <span className="text-lg">🎓</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-4 font-extrabold leading-tight text-[#1f2a44]">Шалгалтын Тогтолцоо</p>
            <p className="truncate text-sm text-[#64748b]">Нийгмийн Ухаан</p>
          </div>
        </button>

   
          <nav className="flex shrink-0">
            <div role="tablist" className="inline-flex rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-1">
              {TABS.map(({ view, label }) => {
                const isActive = activeView === view;
                return (
                  <button
                    key={view}
                    role="tab"
                    aria-selected={isActive}
                    className={`rounded-lg px-5 py-2.5 text-4 font-semibold transition-all ${
                      isActive ? "bg-white text-[#1f2a44] shadow-sm ring-1 ring-[#e2e8f0]" : "text-[#64748b] hover:bg-white/50"
                    }`}
                    onClick={() => handleTabClick(view)}
                    type="button"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </nav>
      </div>
    </header>
  );
}
