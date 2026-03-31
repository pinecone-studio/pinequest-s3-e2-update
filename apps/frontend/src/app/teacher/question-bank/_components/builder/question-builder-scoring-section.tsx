"use client";

import {
  QUESTION_DIFFICULTIES,
  type QuestionValidationErrors,
} from "../../_lib/types";
import { DIFFICULTY_LABELS } from "../../_lib/utils";
import {
  BuilderField,
  BuilderSelectField,
  builderInputClassName,
} from "./question-builder-form-fields";

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
      <div className="mb-4">
        <h3 className="text-[13px] font-semibold text-[#183153]">Үнэлгээ</h3>
        <p className="text-[13px] text-[#6d7f9c]">
          Түвшин, оноо зэрэг үнэлгээтэй холбоотой тохиргоо.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BuilderSelectField
          label="Түвшин"
          onValueChange={(value) =>
            onDifficultyChange(value as "easy" | "medium" | "hard")
          }
          options={QUESTION_DIFFICULTIES.map((item) => ({
            label: DIFFICULTY_LABELS[item],
            value: item,
          }))}
          value={difficulty}
        />

        <BuilderField error={validationErrors?.points} label="Оноо">
          <input
            className={builderInputClassName}
            min={1}
            onChange={(event) => onPointsChange(Number(event.target.value))}
            type="number"
            value={points}
          />
        </BuilderField>
      </div>
    </section>
  );
}
