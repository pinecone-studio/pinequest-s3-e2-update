"use client";

import type { Question } from "../_lib/types";
import { EmptyState } from "./empty-state";
import { QuestionCard } from "./question-card";

type QuestionListProps = {
  activeQuestionId?: string | null;
  questions: Question[];
  likedQuestionIds: string[];
  getQuestionHeartCount: (question: Question) => number;
  onAddToExam: (questionId: string) => void;
  onCreateQuestion: () => void;
  onDeleteQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onOpenQuestion?: (questionId: string) => void;
  onToggleLike: (questionId: string) => void;
};

export function QuestionList({
  activeQuestionId,
  questions,
  likedQuestionIds,
  getQuestionHeartCount,
  onAddToExam,
  onCreateQuestion,
  onDeleteQuestion,
  onEditQuestion,
  onOpenQuestion,
  onToggleLike,
}: QuestionListProps) {
  if (questions.length === 0) {
    return <EmptyState onCreateQuestion={onCreateQuestion} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {questions.map((question) => (
        <QuestionCard
          heartCount={getQuestionHeartCount(question)}
          isActive={question.id === activeQuestionId}
          isLiked={likedQuestionIds.includes(question.id)}
          key={question.id}
          onAddToExam={() => onAddToExam(question.id)}
          onDelete={() => onDeleteQuestion(question.id)}
          onEdit={() => onEditQuestion(question.id)}
          onOpen={() => onOpenQuestion?.(question.id)}
          onToggleLike={() => onToggleLike(question.id)}
          question={question}
        />
      ))}
    </div>
  );
}
