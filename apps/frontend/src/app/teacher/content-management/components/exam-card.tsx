import { Copy, Eye, Send, SquarePen, Trash2 } from "lucide-react";
import type { Exam } from "../types";
import { statusLabel, statusTone } from "../utils";

export function ExamCard({
  exam,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onSend,
}: {
  exam: Exam;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSend: () => void;
}) {
  const statusClass = "rounded-full px-2 py-1 text-2 font-semibold " + statusTone(exam.status);

  return (
    <article className="rounded-xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-4 font-bold text-[#1f2a44]">{exam.title}</p>
          <p className="text-2 text-[#5c6f91]">
            {exam.subject} · {exam.grade} · {exam.questions.length} асуулт · {exam.duration} минут
          </p>
          <p className="text-2 text-[#5c6f91]">Үүсгэсэн: {exam.createdAt}</p>
        </div>
        <span className={statusClass}>{statusLabel(exam.status)}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-[#d9e6fb] px-2 py-1 text-2 text-[#335c96]"
          onClick={onView}
          type="button"
        >
          <Eye className="h-3.5 w-3.5" /> Харах
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-[#d9e6fb] px-2 py-1 text-2 text-[#335c96]"
          onClick={onEdit}
          type="button"
        >
          <SquarePen className="h-3.5 w-3.5" /> Засах
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-[#d9e6fb] px-2 py-1 text-2 text-[#335c96]"
          onClick={onDuplicate}
          type="button"
        >
          <Copy className="h-3.5 w-3.5" /> Хуулах
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-lg bg-[#34c759] px-2 py-1 text-2 font-semibold text-white"
          onClick={onSend}
          type="button"
        >
          <Send className="h-3.5 w-3.5" /> Илгээх
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-[#ff6b6b]/50 bg-[#ff6b6b]/10 px-2 py-1 text-2 text-[#b64747]"
          onClick={onDelete}
          type="button"
        >
          <Trash2 className="h-3.5 w-3.5" /> Устгах
        </button>
      </div>
    </article>
  );
}
