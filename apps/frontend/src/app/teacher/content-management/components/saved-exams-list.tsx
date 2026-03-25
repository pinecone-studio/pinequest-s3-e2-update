import type { Exam } from "../types";
import { ExamCard } from "./exam-card";

export function SavedExamsList({
  exams,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onSend,
}: {
  exams: Exam[];
  onView: (exam: Exam) => void;
  onEdit: (exam: Exam) => void;
  onDelete: (exam: Exam) => void;
  onDuplicate: (exam: Exam) => void;
  onSend: (exam: Exam) => void;
}) {
  if (exams.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d9e6fb] bg-[#f7fbff] p-10 text-center text-2 text-[#5c6f91]">
        Одоогоор хадгалсан шалгалт алга. Баруун талын Шинэ шалгалт үүсгэх таб дээрээс эхлээрэй.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exams.map((exam) => (
        <ExamCard
          exam={exam}
          key={exam.id}
          onDelete={() => onDelete(exam)}
          onDuplicate={() => onDuplicate(exam)}
          onEdit={() => onEdit(exam)}
          onSend={() => onSend(exam)}
          onView={() => onView(exam)}
        />
      ))}
    </div>
  );
}
