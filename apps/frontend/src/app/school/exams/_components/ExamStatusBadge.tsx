import { examStatusMeta } from "../_mock/school-exams";
import type { ExamStatus } from "../_types/exam";

type ExamStatusBadgeProps = {
  status: ExamStatus;
};

export function ExamStatusBadge({ status }: ExamStatusBadgeProps) {
  const meta = examStatusMeta[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badgeClassName}`}
    >
      {meta.label}
    </span>
  );
}
