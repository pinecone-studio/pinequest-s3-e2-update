import Link from "next/link";
import { ChevronRight, PencilLine } from "lucide-react";
import { ExamStatusBadge } from "./ExamStatusBadge";
import type { SchoolExam } from "../_types/exam";

type ExamTableSectionProps = {
  exams: SchoolExam[];
};

export function ExamTableSection({ exams }: ExamTableSectionProps) {
  return (
    <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3 font-semibold text-[#0f172a]">
            Шалгалтын жагсаалт
          </h2>
          <p className="mt-1 text-2 text-[#61708a]">
            Хуваарь, оролцоо, төлөв, эрсдэлийн мэдээллийг үйлдлийн холбоостой
            нэг хүснэгтээс удирдана.
          </p>
        </div>
        <div className="rounded-full border border-[#dbe5f0] bg-[#f8fbff] px-3 py-1.5 text-2 font-medium text-[#456080]">
          Нийт мөр: {exams.length}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1120px] text-2">
          <thead>
            <tr className="border-b border-[#e5edf6] text-left text-[#72829b]">
              <th className="pb-3 pr-4 font-medium">Шалгалт</th>
              <th className="pb-3 pr-4 font-medium">Анги</th>
              <th className="pb-3 pr-4 font-medium">Багш</th>
              <th className="pb-3 pr-4 font-medium">Хугацаа</th>
              <th className="pb-3 pr-4 font-medium">Явц</th>
              <th className="pb-3 pr-4 font-medium">Төлөв</th>
              <th className="pb-3 pr-4 font-medium">Эрсдэл</th>
              <th className="pb-3 font-medium">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => {
              const progress = exam.studentCount
                ? Math.round((exam.submittedCount / exam.studentCount) * 100)
                : 0;

              return (
                <tr
                  key={exam.id}
                  className="border-b border-[#eef3f8] align-top last:border-b-0"
                >
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-[#0f172a]">{exam.title}</p>
                    <p className="mt-1 text-[13px] text-[#71829d]">
                      {exam.subject}
                    </p>
                  </td>
                  <td className="py-4 pr-4 font-medium text-[#1f2a44]">
                    {exam.className}
                  </td>
                  <td className="py-4 pr-4 text-[#44526b]">
                    {exam.teacherName}
                  </td>
                  <td className="py-4 pr-4 text-[13px] leading-6 text-[#61708a]">
                    <p>{exam.startAt}</p>
                    <p>{exam.endAt}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-[#0f172a]">{progress}%</p>
                    <div className="mt-2 h-2.5 w-32 overflow-hidden rounded-full bg-[#e8eef7]">
                      <div
                        className="h-full rounded-full bg-[#2563eb]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[13px] text-[#71829d]">
                      {exam.submittedCount}/{exam.studentCount}
                    </p>
                  </td>
                  <td className="py-4 pr-4">
                    <ExamStatusBadge status={exam.status} />
                  </td>
                  <td className="py-4 pr-4 text-[13px] leading-6 text-[#8a5a13]">
                    {exam.risk}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/school/exams/${exam.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#dbe5f0] px-3 py-2 font-medium text-[#28446f] transition hover:bg-[#f8fbff]"
                      >
                        Дэлгэрэнгүй
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg border border-[#dbe5f0] px-3 py-2 font-medium text-[#28446f] transition hover:bg-[#f8fbff]"
                      >
                        Засах
                        <PencilLine className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
