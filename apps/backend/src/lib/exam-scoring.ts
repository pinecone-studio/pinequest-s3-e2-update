/** MCQ зөв хариултыг тооцоолох — зөвхөн серверт ашиглана. */

const OPTION_IDS = ["A", "B", "C", "D"] as const;
export type McqOptionId = (typeof OPTION_IDS)[number];

export function parseTestAnswersCell(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return value ? [value] : [];
  }
}

export function mapRightAnswerToOptionId(
  rightAnswer: string | null | undefined,
  choices: string[],
): McqOptionId {
  const raw = (rightAnswer ?? "").trim();
  const upper = raw.toUpperCase();
  if (upper === "A" || upper === "B" || upper === "C" || upper === "D") {
    return upper;
  }
  const idx = choices.findIndex((c) => c.trim() === raw);
  if (idx >= 0 && idx < OPTION_IDS.length) return OPTION_IDS[idx]!;
  const n = Number.parseInt(raw, 10);
  if (n >= 1 && n <= choices.length && n <= 4) {
    return OPTION_IDS[n - 1]!;
  }
  return "A";
}

export function normalizeSelectedOption(raw: string | null | undefined): string {
  return (raw ?? "").trim().toUpperCase();
}
