import type { ExamDetail } from "../_types/exam";

type ExamParticipationSummaryProps = {
  exam: ExamDetail;
};

export function ExamParticipationSummary({
  exam,
}: ExamParticipationSummaryProps) {
  const completionRate = exam.studentCount
    ? Math.round((exam.submittedCount / exam.studentCount) * 100)
    : 0;

  const summaryCards = [
    { label: "Нийт сурагч", value: exam.studentCount },
    { label: "Шалгалт өгсөн", value: exam.submittedCount },
    { label: "Эхлээгүй", value: exam.notStartedCount },
    { label: "Completion rate", value: `${completionRate}%` },
  ];

  return (
    <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-3 font-semibold text-[#0f172a]">
          Оролцоо / явцын summary
        </h2>
        <p className="mt-1 text-2 text-[#61708a]">
          Сурагчдын оролцоо болон completion түвшний шуурхай тойм.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e3ebf5] bg-gradient-to-br from-[#f8fbff] to-white p-4"
          >
            <p className="text-2 font-medium text-[#73839b]">{item.label}</p>
            <p className="mt-3 text-6 font-bold leading-none text-[#0f172a]">
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
