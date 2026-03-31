"use client";

import {
  QUESTION_DIFFICULTIES,
  type QuestionValidationErrors,
} from "../../_lib/types";
import { DIFFICULTY_LABELS } from "../../_lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QuestionBuilderScoringSectionProps = {
  difficulty: "easy" | "medium" | "hard";
  onDifficultyChange: (value: "easy" | "medium" | "hard") => void;
  onPointsChange: (value: number) => void;
  points: number;
  validationErrors?: QuestionValidationErrors;
};

export function QuestionBuilderScoringSection({
  difficulty,
  onDifficultyChange,
  onPointsChange,
  points,
  validationErrors,
}: QuestionBuilderScoringSectionProps) {
  return (
    <section>
      <div className="mb-4 ml-2">
        <h3 className="text-[13px] font-semibold text-[#183153]">Үнэлгээ</h3>
        <p className="text-[13px] text-[#6d7f9c]">
          Түвшин, оноо зэрэг үнэлгээтэй холбоотой тохиргоо.
        </p>
      </div>

      <div className="flex flex-col gap-[4px] md:flex-row md:items-center">
        <Select
          onValueChange={(value) =>
            onDifficultyChange(value as "easy" | "medium" | "hard")
          }
          value={difficulty}
        >
          <SelectTrigger className="h-11 rounded-[12px] border-[#d3deef] bg-[#fafafa] px-[14px] text-[13px] focus:border-[#4f9dff] focus:ring-[#4f9dff]/10 md:w-[178px]">
            <SelectValue placeholder="Дэд сэдэв сонгоно уу." />
          </SelectTrigger>
          <SelectContent>
            {QUESTION_DIFFICULTIES.map((item) => (
              <SelectItem key={item} value={item}>
                {DIFFICULTY_LABELS[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="inline-flex h-[46px] w-full items-center gap-[10px] rounded-[12px] border border-[#d3deef] bg-[#fafafa] px-[14px] md:w-[116px]">
          <input
            className="h-full min-w-0 flex-1 border-none bg-transparent p-0 text-[13px] text-[#183153] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            min={1}
            onChange={(event) => onPointsChange(Number(event.target.value))}
            placeholder="Оноо оруулна уу."
            type="number"
            value={points}
          />
          <div className="shrink-0">
            <button
              className="text-[23px] leading-none text-[#6d7f9c]"
              onClick={() => onPointsChange(points + 1)}
              type="button"
            >
              ⊕
            </button>
            <button
              className="ml-1 text-[23px] leading-none text-[#6d7f9c]"
              onClick={() => onPointsChange(Math.max(1, points - 1))}
              type="button"
            >
              ⊖
            </button>
          </div>
        </label>
      </div>
      {validationErrors?.points ? (
        <p className="mt-2 text-[13px] font-medium text-[#d34f4f]">
          {validationErrors.points}
        </p>
      ) : null}
    </section>
  );
}
