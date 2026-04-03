"use client";

import type { Question } from "../../_lib/types";
import { QuestionBankEmptyState } from "../bank/question-bank-empty-state";
import { QuestionCard } from "./question-card";

type QuestionListProps = {
  activeQuestionId?: string | null;
  questions: Question[];
  likedQuestionIds: string[];
  selectedQuestionIds: string[];
  onAddToExam: (questionId: string) => void;
  onCreateQuestion: () => void;
  onDeleteQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onOpenQuestion?: (questionId: string) => void;
  onToggleQuestionSelection: (questionId: string) => void;
  onToggleLike: (questionId: string) => void;
};

export function QuestionList({
  activeQuestionId,
  questions,
  likedQuestionIds,
  selectedQuestionIds,
  onAddToExam,
  onCreateQuestion,
  onDeleteQuestion,
  onEditQuestion,
  onOpenQuestion,
  onToggleQuestionSelection,
  onToggleLike,
}: QuestionListProps) {
  if (questions.length === 0) {
    return <QuestionBankEmptyState onCreateQuestion={onCreateQuestion} />;
  }

  return (
    <div className="min-h-[min(420px,55vh)] max-h-[min(690px,65vh)] space-y-[18px] overflow-y-auto pr-1 sm:min-h-[500px] sm:max-h-[690px]">
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          compactAction={index === questions.length - 1}
          question={question}
          isActive={question.id === activeQuestionId}
          isLiked={likedQuestionIds.includes(question.id)}
          isSelected={selectedQuestionIds.includes(question.id)}
          onAddToExam={() => onAddToExam(question.id)}
          onDelete={() => onDeleteQuestion(question.id)}
          onEdit={() => onEditQuestion(question.id)}
          onOpen={() => onOpenQuestion?.(question.id)}
          onToggleSelect={() => onToggleQuestionSelection(question.id)}
          onToggleLike={() => onToggleLike(question.id)}
        />
      ))}
    </div>
  );
}
