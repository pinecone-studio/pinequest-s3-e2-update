import { AlertTriangle, BarChart3, CheckCircle2, Database } from "lucide-react";

type StatsCardsProps = {
  totalQuestions: number;
  activeQuestions: number;
  averageCorrectRate: number;
  questionsNeedingReview: number;
};

export function StatsCards({
  totalQuestions,
  activeQuestions,
  averageCorrectRate,
  questionsNeedingReview,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Нийт асуулт",
      value: totalQuestions,
      icon: Database,
      valueColor: "text-slate-900",
      bg: "bg-white",
    },
    {
      label: "Идэвхтэй асуулт",
      value: activeQuestions,
      icon: CheckCircle2,
      valueColor: "text-emerald-600",
      bg: "bg-white",
    },
    {
      label: "Дундаж зөв хариулалтын хувь",
      value: `${averageCorrectRate}%`,
      icon: BarChart3,
      valueColor: "text-blue-600",
      bg: "bg-white",
    },
    {
      label: "Сайжруулах шаардлагатай",
      value: questionsNeedingReview,
      icon: AlertTriangle,
      valueColor: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className={`${card.bg} rounded-xl border border-slate-200 p-4 shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className={`mt-2 text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
          </article>
        );
      })}
    </section>
  );
}
