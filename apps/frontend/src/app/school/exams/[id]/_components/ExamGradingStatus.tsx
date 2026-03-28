import { ArrowRight } from "lucide-react";
import type { ExamDetail } from "../_types/exam";

type ExamGradingStatusProps = {
  exam: ExamDetail;
};

export function ExamGradingStatus({ exam }: ExamGradingStatusProps) {
  const items = [
    { label: "Auto grading", value: exam.autoGradingStatus },
    { label: "Manual grading", value: exam.manualGradingStatus },
    { label: "Final result", value: exam.finalResultStatus },
  ];

  return (
    <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3 font-semibold text-[#0f172a]">
            Үнэлгээ / grading төлөв
          </h2>
          <p className="mt-1 text-2 text-[#61708a]">
            Автомат болон гараар шалгалтын төлөв, эцсийн үр дүн нийтлэгдсэн
            эсэхийг хянана.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[#dbe5f0] bg-[#f8fbff] px-4 py-2.5 text-2 font-semibold text-[#28446f] transition hover:bg-white"
        >
          Үнэлгээний хэсэг рүү орох
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e3ebf5] bg-gradient-to-br from-[#f8fbff] to-white p-4"
          >
            <p className="text-2 font-medium text-[#73839b]">{item.label}</p>
            <p className="mt-3 text-4 font-bold text-[#0f172a]">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
