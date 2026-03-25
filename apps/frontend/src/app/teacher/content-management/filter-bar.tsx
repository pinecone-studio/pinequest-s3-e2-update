import {
  DIFFICULTIES,
  QUESTION_STATUSES,
  QUESTION_TYPES,
  SKILL_TAGS,
  SUBJECTS,
} from "./types";
import type { QuestionFilters } from "./types";
import { difficultyLabel, statusLabel, subjectLabel, typeLabel } from "./utils";

type Props = {
  filters: QuestionFilters;
  gradeLevels: string[];
  onChange: <K extends keyof QuestionFilters>(
    key: K,
    value: QuestionFilters[K],
  ) => void;
  onReset: () => void;
};

export function FilterBar({ filters, gradeLevels, onChange, onReset }: Props) {
  return (
    <div className="rounded-2xl bg-[#F6FAFF] p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#1F2A44]">Ухаалаг шүүлтүүр</p>
        <button
          className="text-xs font-semibold text-[#4F9DFF] hover:underline"
          onClick={onReset}
          type="button"
        >
          Шүүлтүүр цэвэрлэх
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">
        <select
          className="h-10 rounded-lg border border-[#d6e7ff] bg-white px-3 text-sm text-[#1F2A44]"
          onChange={(event) =>
            onChange("subject", event.target.value as QuestionFilters["subject"])
          }
          value={filters.subject}
        >
          <option value="all">Бүх хичээл</option>
          {SUBJECTS.map((item) => (
            <option key={item} value={item}>
              {subjectLabel[item]}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-lg border border-[#d6e7ff] bg-white px-3 text-sm text-[#1F2A44]"
          onChange={(event) => onChange("type", event.target.value as QuestionFilters["type"])}
          value={filters.type}
        >
          <option value="all">Бүх төрөл</option>
          {QUESTION_TYPES.map((item) => (
            <option key={item} value={item}>
              {typeLabel[item]}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-lg border border-[#d6e7ff] bg-white px-3 text-sm text-[#1F2A44]"
          onChange={(event) =>
            onChange(
              "difficulty",
              event.target.value as QuestionFilters["difficulty"],
            )
          }
          value={filters.difficulty}
        >
          <option value="all">Бүх түвшин</option>
          {DIFFICULTIES.map((item) => (
            <option key={item} value={item}>
              {difficultyLabel[item]}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-lg border border-[#d6e7ff] bg-white px-3 text-sm text-[#1F2A44]"
          onChange={(event) =>
            onChange("gradeLevel", event.target.value as QuestionFilters["gradeLevel"])
          }
          value={filters.gradeLevel}
        >
          <option value="all">Бүх анги</option>
          {gradeLevels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-lg border border-[#d6e7ff] bg-white px-3 text-sm text-[#1F2A44]"
          onChange={(event) =>
            onChange("status", event.target.value as QuestionFilters["status"])
          }
          value={filters.status}
        >
          <option value="all">Бүх төлөв</option>
          {QUESTION_STATUSES.map((item) => (
            <option key={item} value={item}>
              {statusLabel[item]}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-lg border border-[#d6e7ff] bg-white px-3 text-sm text-[#1F2A44]"
          onChange={(event) =>
            onChange("skillTag", event.target.value as QuestionFilters["skillTag"])
          }
          value={filters.skillTag}
        >
          <option value="all">Бүх чадвар</option>
          {SKILL_TAGS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
