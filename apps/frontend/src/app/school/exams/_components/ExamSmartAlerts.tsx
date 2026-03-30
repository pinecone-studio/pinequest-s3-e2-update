import { AlertTriangle, BellRing } from "lucide-react";
import type { ExamAlert } from "../_types/exam";

type ExamSmartAlertsProps = {
  alerts: ExamAlert[];
};

export function ExamSmartAlerts({ alerts }: ExamSmartAlertsProps) {
  return (
    <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3 font-semibold text-[#0f172a]">
            Анхааруулах зүйлс
          </h2>
          <p className="mt-1 text-2 text-[#61708a]">
            Хуваарь, шалгалтын явц, хяналтын эрсдэлийг богино хугацаанд
            шийдвэр гаргахад туслах сануулгууд.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f0] bg-[#f8fbff] px-3 py-1.5 text-2 font-medium text-[#456080]">
          <BellRing className="h-4 w-4" />
          Нээлттэй alert: {alerts.length}
        </div>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {alerts.map((alert) => {
          const isWarning = alert.type === "warning";

          return (
            <article
              key={alert.id}
              className={`rounded-2xl border p-4 ${
                isWarning
                  ? "border-amber-200 bg-amber-50/80"
                  : "border-blue-200 bg-blue-50/80"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isWarning
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                        isWarning
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {alert.type}
                    </span>
                    <h3 className="text-2 font-semibold text-[#0f172a]">
                      {alert.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-2 leading-6 text-[#5c6d87]">
                    {alert.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
