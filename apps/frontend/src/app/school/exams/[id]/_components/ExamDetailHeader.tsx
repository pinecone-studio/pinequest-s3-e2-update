import Link from "next/link";
import { BarChart3, PencilLine } from "lucide-react";
import { ExamStatusBadge } from "../../_components/ExamStatusBadge";
import type { ExamDetail } from "../_types/exam";

type ExamDetailHeaderProps = {
  exam: ExamDetail;
};

export function ExamDetailHeader({ exam }: ExamDetailHeaderProps) {
  return (
    <section className="rounded-[28px] border border-[#dbe5f0] bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_60%,#eef6ff_100%)] p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 text-2 text-[#6c7b94]">
        <Link href="/school/exams" className="transition hover:text-[#1d4ed8]">
          Шалгалтын удирдлага
        </Link>
        <span aria-hidden>/</span>
        <span className="text-[#0f172a]">{exam.title}</span>
      </div>

      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-5 font-bold text-[#0f172a]">{exam.title}</h1>
            <ExamStatusBadge status={exam.status} />
          </div>
          <p className="mt-2 text-2 text-[#5f7090]">{exam.subject}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-[#dbe5f0] bg-white px-4 py-2.5 text-2 font-semibold text-[#28446f] transition hover:bg-[#f8fbff]"
          >
            <PencilLine className="h-4 w-4" />
            Засах
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1d4ed8] px-4 py-2.5 text-2 font-semibold text-white transition hover:bg-[#1b43bd]"
          >
            <BarChart3 className="h-4 w-4" />
            Үнэлгээ харах
          </button>
        </div>
      </div>
    </section>
  );
}
