import type {
  DisplayChoice,
  DisplayQuestion,
  ExamTemplate,
  Question,
  QuestionType,
  StudentSubmission,
  StudentVersion,
  VariantLabel,
  VariantRules,
} from "./types";
import { createHashSeed, seededShuffle, seededStringHash } from "./seeded";

function isAutoGradedType(type: QuestionType) {
  return type === "multiple_choice" || type === "true_false";
}

function isMovableQuestion(q: Question, rules: VariantRules) {
  if (!rules.shuffleQuestionOrder) return false;
  if (q.preserveOrder) return false;
  if (q.type === "short_answer" || q.type === "essay") return false;
  return true;
}

function groupKey(q: Question) {
  const groupId = q.group?.id ?? null;
  if (!groupId) return null;
  return groupId;
}

function sectionKey(q: Question) {
  return q.section?.id ?? null;
}

function indexById<T extends { id: string }>(arr: T[]) {
  return Object.fromEntries(arr.map((x) => [x.id, x]));
}

function stableFixedMask(template: ExamTemplate, rules: VariantRules) {
  return template.questions.map((q) => !isMovableQuestion(q, rules));
}

function applyPreserveOrderFixedPositions(template: ExamTemplate, rules: VariantRules, movable: Question[]) {
  const fixedMask = stableFixedMask(template, rules);
  const result: string[] = [];
  let movableIdx = 0;
  for (let i = 0; i < template.questions.length; i++) {
    const q = template.questions[i];
    if (fixedMask[i]) {
      result.push(q.id);
      continue;
    }
    const next = movable[movableIdx];
    movableIdx += 1;
    result.push(next.id);
  }
  return result;
}

function computeQuestionOrder(template: ExamTemplate, rules: VariantRules, studentSeed: number) {
  if (!rules.shuffleQuestionOrder) {
    return template.questions.map((q) => q.id);
  }

  // Movable questions are shuffled. If preserveGroupedQuestions is enabled, group stays together.
  // If preserveSectionOrder is enabled, sections order stays fixed.
  const movable = template.questions.filter((q) => isMovableQuestion(q, rules));

  // Group / section blocks are built only from movable questions.
  const questions = template.questions;

  const movableBySection = new Map<string | null, Question[]>();
  const movableByGroup = new Map<string, Question[]>();

  for (const q of movable) {
    const sk = sectionKey(q);
    if (!movableBySection.has(sk)) movableBySection.set(sk, []);
    movableBySection.get(sk)!.push(q);

    const gk = groupKey(q);
    if (gk) {
      if (!movableByGroup.has(gk)) movableByGroup.set(gk, []);
      movableByGroup.get(gk)!.push(q);
    }
  }

  // If preserveGroupedQuestions: treat each group as an indivisible block, but only if it exists.
  const movableNonGrouped: Question[] = [];
  const groupBlocks: Question[][] = [];
  const usedGroupIds = new Set<string>();
  for (const q of movable) {
    const gk = groupKey(q);
    if (!gk) {
      movableNonGrouped.push(q);
      continue;
    }
    if (usedGroupIds.has(gk)) continue;
    usedGroupIds.add(gk);
    groupBlocks.push(movableByGroup.get(gk) ?? []);
  }

  // If preserveSectionOrder: shuffle inside each section, but keep section sequence as in template.
  if (rules.preserveSectionOrder) {
    // Build section sequence from template positions (including null sections).
    const sectionSeq: (string | null)[] = [];
    const seen = new Set<string | null>();
    for (const q of template.questions) {
      if (!isMovableQuestion(q, rules)) continue;
      const sk = sectionKey(q);
      if (seen.has(sk)) continue;
      seen.add(sk);
      sectionSeq.push(sk);
    }

    const resultIds: string[] = [];
    const fixedMask = stableFixedMask(template, rules);
    const movablePointerBySection = new Map<string | null, number>();
    for (const sk of sectionSeq) movablePointerBySection.set(sk, 0);

    // Prepare shuffled movable ids per section.
    const shuffledMovableIdsBySection = new Map<string | null, string[]>();
    for (const sk of sectionSeq) {
      const sectionMovable = movableBySection.get(sk) ?? [];
      const shuffled = seededShuffle(sectionMovable, studentSeed + hashString(`${sk ?? "null"}`));
      // If preserveGroupedQuestions, shuffle group blocks among themselves; otherwise we already seededShuffle above.
      if (rules.preserveGroupedQuestions) {
        // Rebuild as blocks within section.
        const blocks: Question[][] = [];
        const localUsed = new Set<string>();
        const localMovableNonGrouped: Question[] = [];
        for (const qq of sectionMovable) {
          const gk = groupKey(qq);
          if (!gk) {
            localMovableNonGrouped.push(qq);
            continue;
          }
          if (localUsed.has(gk)) continue;
          localUsed.add(gk);
          blocks.push(seededShuffle(movableByGroup.get(gk) ?? [], studentSeed + hashString(`${gk}`)));
        }
        const blockOrder = seededShuffle(blocks, studentSeed + hashString(`blocks-${sk ?? "null"}`));
        // Flatten blocks, then append non-grouped in a seeded order.
        const flattened = blockOrder.flat();
        const nonGroupedShuffled = seededShuffle(localMovableNonGrouped, studentSeed + 999 + hashString(`nong-${sk ?? "null"}`));
        const ids = [...flattened.map((x) => x.id), ...nonGroupedShuffled.map((x) => x.id)];
        shuffledMovableIdsBySection.set(sk, ids);
      } else {
        shuffledMovableIdsBySection.set(sk, shuffled.map((x) => x.id));
      }
    }

    // Now apply at fixed positions to preserve essay/short + preserveOrder pins.
    const movableIdxBySection = new Map<string | null, number>();
    for (const sk of sectionSeq) movableIdxBySection.set(sk, 0);

    for (let i = 0; i < template.questions.length; i++) {
      if (fixedMask[i]) {
        resultIds.push(template.questions[i].id);
        continue;
      }
      const sk = sectionKey(template.questions[i]);
      const ptr = movableIdxBySection.get(sk) ?? 0;
      const arr = shuffledMovableIdsBySection.get(sk) ?? [];
      const id = arr[ptr] ?? template.questions[i].id;
      movableIdxBySection.set(sk, ptr + 1);
      resultIds.push(id);
    }
    return resultIds;
  }

  // Not preserving section order: we can shuffle movable blocks across the whole template.
  if (rules.preserveGroupedQuestions) {
    // Build block list from movable questions: group blocks + ungrouped movable questions as singletons.
    const singletonBlocks = movableNonGrouped.map((q) => [q]);
    const allBlocks = [...groupBlocks, ...singletonBlocks];
    const shuffledBlocks = seededShuffle(allBlocks, studentSeed + 12345);
    const flattenedIds = shuffledBlocks.flat().map((q) => q.id);

    // Reinsert into fixed positions.
    const movableById = new Map(movable.map((q) => [q.id, q] as const));
    const movableQuestionObjects: Question[] = flattenedIds.map((id) => movableById.get(id)!).filter(Boolean);
    return applyPreserveOrderFixedPositions(
      { ...template, questions: template.questions }, // keep structure
      rules,
      movableQuestionObjects,
    );
  }

  // Default: shuffle movable questions directly and insert into fixed positions.
  const shuffledMovable = seededShuffle(movable, studentSeed + 4242);
  return applyPreserveOrderFixedPositions(template, rules, shuffledMovable);
}

function hashString(s: string) {
  return seededStringHash(s);
}

function computeChoiceOrders(template: ExamTemplate, rules: VariantRules, studentSeed: number, questionOrder: string[]) {
  if (!rules.shuffleAnswerChoices) return {};

  const templateByQId = indexById(template.questions);
  const choiceOrder: Record<string, string[]> = {};

  for (const qId of questionOrder) {
    const q = templateByQId[qId];
    if (!q) continue;
    if (q.type !== "multiple_choice" && q.type !== "true_false") continue;
    const choices = q.choices;
    if (choices.length <= 1) continue;

    // Deterministic shuffle of the choice IDs for this question/student.
    const seed = studentSeed + hashString(`choice-${q.id}`);
    const shuffled = seededShuffle(choices, seed);
    choiceOrder[q.id] = shuffled.map((c) => c.id);
  }

  return choiceOrder;
}

export function createStudentVersionFromRules(params: {
  template: ExamTemplate;
  rules: VariantRules;
  studentId: string;
  /** Only used when limited_shared_variants. */
  variantLabel?: VariantLabel;
  sharedVariantSeed?: number;
}): StudentVersion {
  const { template, rules, studentId, variantLabel } = params;

  // Seed strategy:
  // - dynamic_per_student: seed depends on studentId
  // - limited_shared_variants: seed depends only on variantLabel (so all students in the same bucket share ordering)
  const seedKey =
    rules.strategy === "limited_shared_variants"
      ? `${template.id}|limited|${variantLabel ?? "A"}`
      : `${template.id}|dynamic|${studentId}`;
  const baseSeed = createHashSeed(seedKey);
  const studentSeed = baseSeed + (params.sharedVariantSeed ?? 0);

  const questionOrder = computeQuestionOrder(template, rules, studentSeed);
  const displayChoiceOrderByQuestionId = computeChoiceOrders(template, rules, studentSeed, questionOrder);

  return {
    studentId,
    variantLabel,
    displayQuestionIds: questionOrder,
    displayChoiceOrderByQuestionId,
    createdAt: new Date().toISOString(),
  };
}

export function buildDisplayExam(params: {
  template: ExamTemplate;
  rules: VariantRules;
  version: StudentVersion;
}): DisplayQuestion[] {
  const { template, version } = params;
  const templateByQId = indexById(template.questions);

  return version.displayQuestionIds.map((qid) => {
    const q = templateByQId[qid];
    if (!q) {
      return {
        originalQuestionId: qid,
        text: "(Асуулт олдсонгүй)",
        type: "multiple_choice",
        score: 0,
      };
    }

    const out: DisplayQuestion = {
      originalQuestionId: q.id,
      text: q.text,
      type: q.type,
      score: q.score,
      sectionTitle: q.section?.title,
      groupTitle: q.group?.title,
    };

    if (q.type === "multiple_choice" || q.type === "true_false") {
      const order = version.displayChoiceOrderByQuestionId[q.id] ?? q.choices.map((c) => c.id);
      const choicesById = indexById(q.choices);
      out.displayChoices = order
        .map((choiceId) => {
          const c = choicesById[choiceId];
          if (!c) return null;
          return { text: c.text, originalChoiceId: c.id };
        })
        .filter(Boolean) as DisplayChoice[];
    }

    return out;
  });
}

export function autoGradeSubmission(params: {
  template: ExamTemplate;
  submission: StudentSubmission;
}): { autoScore: number; autoCorrectCount: number; autoTotalCount: number } {
  const { template, submission } = params;

  let autoScore = 0;
  let autoCorrectCount = 0;
  let autoTotalCount = 0;

  for (const q of template.questions) {
    if (!isAutoGradedType(q.type)) continue;
    const answer = submission.answersByQuestionId[q.id];
    if (!answer) continue;
    autoTotalCount += 1;

    if ((q.type === "multiple_choice" || q.type === "true_false") && answer.type !== "multiple_choice" && answer.type !== "true_false") {
      continue;
    }
    const selected = answer.type === "multiple_choice" || answer.type === "true_false" ? answer.selectedChoiceId : null;
    if (!selected) continue;
    const correct = q.correctChoiceId;
    if (!correct) continue;
    if (selected === correct) {
      autoCorrectCount += 1;
      // Full score per question. (If you want partial grading, add rubric later.)
      autoScore += q.score;
    }
  }

  return { autoScore, autoCorrectCount, autoTotalCount };
}

export function buildFinalScore(submission: StudentSubmission) {
  const manualScores = Object.values(submission.manualByQuestionId)
    .map((x) => x.score)
    .filter((x): x is number => typeof x === "number");

  const manualTotal = manualScores.reduce((a, b) => a + b, 0);
  const autoTotal = submission.autoScore ?? 0;

  // If any manual is missing (null), final score stays null to indicate “not ready”.
  const hasUnscoredManual = Object.values(submission.manualByQuestionId).some((x) => x.status === "pending" || x.score == null);

  return hasUnscoredManual ? null : autoTotal + manualTotal;
}

