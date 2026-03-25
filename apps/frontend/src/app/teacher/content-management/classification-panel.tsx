import { FolderTree, Tags, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import {
  DIFFICULTIES,
  QUESTION_TYPES,
  SUBJECTS,
} from "./types";
import type { Question, QuestionFilters } from "./types";
import { difficultyLabel, subjectLabel, typeLabel } from "./utils";

type Props = {
  questions: Question[];
  filters: QuestionFilters;
  onChange: <K extends keyof QuestionFilters>(
    key: K,
    value: QuestionFilters[K],
  ) => void;
};

export function ClassificationPanel({ questions, filters, onChange }: Props) {
  const subjectCounts = SUBJECTS.map((item) => ({
    key: item,
    label: subjectLabel[item],
    count: questions.filter((q) => q.subject === item).length,
    active: filters.subject === item,
  }));

  const typeCounts = QUESTION_TYPES.map((item) => ({
    key: item,
    label: typeLabel[item],
    count: questions.filter((q) => q.type === item).length,
    active: filters.type === item,
  }));

  const difficultyCounts = DIFFICULTIES.map((item) => ({
    key: item,
    label: difficultyLabel[item],
    count: questions.filter((q) => q.difficulty === item).length,
    active: filters.difficulty === item,
  }));

  return (
    <section className="rounded-3xl border border-[#d6e7ff] bg-white p-5 shadow-sm">
      <h2 className="text-3xl font-bold text-[#1F2A44]">Ангилал ба эрэмбэлэх систем</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <CategoryColumn
          icon={<FolderTree className="h-5 w-5 text-[#ff8a1e]" />}
          title="Хичээлийн ангилал"
          items={subjectCounts}
          tone="subject"
          onClick={(value, active) =>
            onChange("subject", (active ? "all" : value) as QuestionFilters["subject"])
          }
        />

        <CategoryColumn
          icon={<Tags className="h-5 w-5 text-[#3b82f6]" />}
          title="Асуултын төрөл"
          items={typeCounts}
          tone="type"
          onClick={(value, active) =>
            onChange("type", (active ? "all" : value) as QuestionFilters["type"])
          }
        />

        <CategoryColumn
          icon={<Trophy className="h-5 w-5 text-[#a855f7]" />}
          title="Хүндийн зэрэг"
          items={difficultyCounts}
          tone="difficulty"
          onClick={(value, active) =>
            onChange(
              "difficulty",
              (active ? "all" : value) as QuestionFilters["difficulty"],
            )
          }
        />
      </div>
    </section>
  );
}

function CategoryColumn({
  icon,
  title,
  items,
  tone,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  items: Array<{ key: string; label: string; count: number; active: boolean }>;
  tone: "subject" | "type" | "difficulty";
  onClick: (value: string, active: boolean) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <p className="text-lg font-bold text-[#1F2A44]">{title}</p>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <button
            className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition ${
              getToneClass(tone, item.active, index)
            }`}
            key={item.key}
            onClick={() => onClick(item.key, item.active)}
            type="button"
          >
            <span className="font-semibold text-[#1F2A44]">{item.label}</span>
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-sm font-semibold text-[#6b7891]">
              {item.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function getToneClass(
  tone: "subject" | "type" | "difficulty",
  active: boolean,
  index: number,
) {
  if (active) {
    if (tone === "subject") return "border-[#ffd9b2] bg-[#fff6ec]";
    if (tone === "type") return "border-[#cfe3ff] bg-[#edf5ff]";
    if (index === 0) return "border-[#c8efda] bg-[#eaf8f0]";
    if (index === 1) return "border-[#f5e59a] bg-[#fff9de]";
    return "border-[#f4caca] bg-[#fff1f1]";
  }

  return "border-[#e6edf8] bg-[#f8fbff] hover:bg-[#f1f6ff]";
}
