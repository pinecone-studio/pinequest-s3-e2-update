import { examStatusMeta } from "../_mock/school-exams";
import type { ExamStatus } from "../_types/exam";

type ExamLifecycleSummaryProps = {
  summary: Array<{
    status: ExamStatus;
    label: string;
    count: number;
  }>;
};

export function ExamLifecycleSummary({
  summary,
}: ExamLifecycleSummaryProps) {
  return (
    <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3 font-semibold text-[#0f172a]">
            Шалгалтын lifecycle summary
          </h2>
          <p className="mt-1 text-2 text-[#61708a]">
            Нооргоос эхлээд дууссан шалгалт хүртэлх бүх төлөвийн ачааллыг
            харах нэгдсэн тойм.
          </p>
        </div>
        <p className="text-2 font-medium text-[#46608a]">
          Нийт шалгалт: {summary.reduce((acc, item) => acc + item.count, 0)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summary.map((item) => (
          <article
            key={item.status}
            className={`rounded-2xl border border-[#e3ebf5] bg-gradient-to-br ${examStatusMeta[item.status].cardTintClassName} p-4`}
          >
            <p className="text-2 font-medium text-[#6b7a92]">{item.label}</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-6 font-bold leading-none text-[#0f172a]">
                {item.count}
              </p>
              <div
                className={`h-2 w-14 rounded-full ${examStatusMeta[item.status].badgeClassName}`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
