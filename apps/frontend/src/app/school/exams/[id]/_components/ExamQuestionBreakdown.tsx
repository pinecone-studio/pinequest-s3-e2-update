import type { ExamDetail } from "../_types/exam";

type ExamQuestionBreakdownProps = {
  exam: ExamDetail;
};

export function ExamQuestionBreakdown({
  exam,
}: ExamQuestionBreakdownProps) {
  const breakdownItems = [
    { label: "Нийт асуулт", value: exam.questionCount },
    { label: "Тест асуулт", value: exam.multipleChoiceCount },
    { label: "Эссе асуулт", value: exam.essayCount },
    { label: "Автоматаар шалгагдах", value: exam.autoGradedCount },
    { label: "Багшаар шалгагдах", value: exam.manualReviewCount },
  ];

  return (
    <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-3 font-semibold text-[#0f172a]">Асуултын бүтэц</h2>
        <p className="mt-1 text-2 text-[#61708a]">
          Шалгалтын асуултын төрөл болон grading workflow-ийн бүтэц.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {breakdownItems.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e6edf5] bg-[#fbfdff] p-4"
          >
            <p className="text-2 font-medium text-[#73839b]">{item.label}</p>
            <p className="mt-3 text-5 font-bold text-[#0f172a]">
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
