import type { ExamDetail } from "../_types/exam";

type ExamInfoCardProps = {
  exam: ExamDetail;
};

const infoItems = (exam: ExamDetail) => [
  { label: "Хичээл", value: exam.subject },
  { label: "Анги", value: exam.className },
  { label: "Хариуцсан багш", value: exam.teacherName },
  { label: "Огноо", value: exam.date },
  { label: "Эхлэх цаг", value: exam.startTime },
  { label: "Дуусах цаг", value: exam.endTime },
  { label: "Үргэлжлэх хугацаа", value: `${exam.durationMinutes} мин` },
  { label: "Өрөө", value: exam.room },
  { label: "Шалгалтын төрөл", value: exam.examType },
  { label: "Нийт оноо", value: `${exam.totalScore}` },
];

export function ExamInfoCard({ exam }: ExamInfoCardProps) {
  return (
    <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-3 font-semibold text-[#0f172a]">
          Шалгалтын үндсэн мэдээлэл
        </h2>
        <p className="mt-1 text-2 text-[#61708a]">
          Хуваарь, өрөө, төрөл болон шалгалтын гол тохиргоонууд.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {infoItems(exam).map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e6edf5] bg-[#fbfdff] p-4"
          >
            <p className="text-2 font-medium text-[#73839b]">{item.label}</p>
            <p className="mt-2 text-3 font-semibold text-[#0f172a]">
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
