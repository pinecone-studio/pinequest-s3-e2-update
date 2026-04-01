"use client";

import { BarChart3, Users } from "lucide-react";

export type ClassDetailView = "students" | "history";

type ClassDetailViewTabsProps = {
  activeView: ClassDetailView;
  onViewChange: (view: ClassDetailView) => void;
  onClearPopover: () => void;
};

export function ClassDetailViewTabs({
  activeView,
  onViewChange,
  onClearPopover,
}: ClassDetailViewTabsProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-3 rounded-2xl bg-[#EDF6FF] p-2 sm:gap-6"
      role="tablist"
    >
      <button
        aria-selected={activeView === "students"}
        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[200px] ${
          activeView === "students"
            ? "border-[#7DC8FF] bg-[#cfe4ff] text-[#122459]"
            : "border-transparent text-[#122459] hover:border-[#d9dee8] hover:bg-[#EDF6FF]"
        }`}
        onClick={() => {
          onClearPopover();
          onViewChange("students");
        }}
        role="tab"
        type="button"
      >
        <Users className="h-5 w-5 shrink-0 text-[#122459]" />
        Сурагчид
      </button>
      <button
        aria-selected={activeView === "history"}
        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[200px] ${
          activeView === "history"
            ? "border-[#7DC8FF] bg-[#cfe4ff] text-[#122459]"
            : "border-transparent text-[#122459] hover:border-[#d9dee8] hover:bg-[#EDF6FF]"
        }`}
        onClick={() => onViewChange("history")}
        role="tab"
        type="button"
      >
        <BarChart3 className="h-5 w-5 shrink-0 text-[#122459]" />
        Шалгалтын статистик
      </button>
    </div>
  );
}
