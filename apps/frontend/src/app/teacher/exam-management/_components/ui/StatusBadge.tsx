import type { ExamTemplateStatus } from "../../_lib/types";

function tone(status: ExamTemplateStatus) {
  if (status === "draft") return "bg-[#4f9dff]/15 text-[#275f9f] border-[#d9e6fb]";
  if (status === "parsed") return "bg-[#eef6ff] text-[#2f73c4] border-[#d9e6fb]";
  if (status === "variants_ready") return "bg-[#4f9dff]/10 text-[#2f73c4] border-[#d9e6fb]";
  if (status === "assigned") return "bg-[#ffd65a]/20 text-[#8b6800] border-[#ffe9ad]";
  if (status === "sent") return "bg-[#34c759]/15 text-[#198a41] border-[#c6f7d0]";
  return "bg-[#eef2f8] text-[#66708a] border-[#e2e8f0]";
}

export function StatusBadge({ status, label }: { status: ExamTemplateStatus; label?: string }) {
  const text =
    label ??
    (status === "draft"
      ? "Ноорог"
      : status === "parsed"
        ? "Шинжилсэн"
        : status === "variants_ready"
          ? "Хувилбарууд бэлэн"
          : status === "assigned"
            ? "Анги руу хуваарилагдсан"
            : status === "sent"
              ? "Илгээсэн"
              : "Архивласан");

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tone(status)}`}>
      {text}
    </span>
  );
}

