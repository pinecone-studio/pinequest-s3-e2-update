"use client";

import type { Question } from "../_lib/types";
import { QuestionBankEmptyState } from "./question-bank-empty-state";
import { QuestionCard } from "./question-card";

type QuestionListProps = {
  activeQuestionId?: string | null;
  questions: Question[];
  likedQuestionIds: string[];
  selectedQuestionIds: string[];
  getQuestionHeartCount: (question: Question) => number;
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
  getQuestionHeartCount,
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
    <div className="grid gap-4 md:grid-cols-2">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          heartCount={getQuestionHeartCount(question)}
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
