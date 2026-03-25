import { AlertTriangle, BarChart3, CheckCircle2, Database } from "lucide-react";
import type { ReactNode } from "react";
import type { DashboardStats } from "./types";

type Props = {
  stats: DashboardStats;
};

export function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Card
        icon={<Database className="h-4 w-4 text-[#4F9DFF]" />}
        label="Нийт асуулт"
        value={stats.totalQuestions}
        tone="primary"
      />
      <Card
        icon={<CheckCircle2 className="h-4 w-4 text-[#34C759]" />}
        label="Идэвхтэй асуулт"
        value={stats.activeQuestions}
        tone="success"
      />
      <Card
        icon={<BarChart3 className="h-4 w-4 text-[#4F9DFF]" />}
        label="Дундаж зөв хариулт"
        value={`${stats.averageCorrectRate}%`}
        tone="primary"
      />
      <Card
        icon={<AlertTriangle className="h-4 w-4 text-[#FF6B6B]" />}
        label="Сайжруулах шаардлагатай"
        value={stats.questionsNeedingReview}
        tone="danger"
      />
    </div>
  );
}

function Card({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  tone: "primary" | "success" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "bg-[#34C759]/10 border-[#34C759]/20"
      : tone === "danger"
        ? "bg-[#FF6B6B]/10 border-[#FF6B6B]/20"
        : "bg-[#4F9DFF]/10 border-[#4F9DFF]/20";

  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${toneClass}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#5d6e8c]">{label}</p>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-3xl font-bold text-[#1F2A44]">{value}</p>
    </article>
  );
}
