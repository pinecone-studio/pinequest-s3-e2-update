"use client";

import type { Question } from "../_lib/types";
import { EmptyState } from "./empty-state";
import { QuestionCard } from "./question-card";

type QuestionListProps = {
  questions: Question[];
  activeQuestionId: string | null;
  selectedQuestionIds: string[];
  onCreateQuestion: () => void;
  onSelectQuestion: (questionId: string) => void;
  onOpenQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onReuseQuestion: (questionId: string) => void;
};

export function QuestionList({
  questions,
  activeQuestionId,
  selectedQuestionIds,
  onCreateQuestion,
  onSelectQuestion,
  onOpenQuestion,
  onEditQuestion,
  onReuseQuestion,
}: QuestionListProps) {
  if (questions.length === 0) {
    return <EmptyState onCreateQuestion={onCreateQuestion} />;
  }

  return (
    <div className="grid gap-4">
      {questions.map((question) => (
        <QuestionCard
          isActive={question.id === activeQuestionId}
          isSelected={selectedQuestionIds.includes(question.id)}
          key={question.id}
          onEdit={() => onEditQuestion(question.id)}
          onOpen={() => onOpenQuestion(question.id)}
          onReuse={() => onReuseQuestion(question.id)}
          onSelect={() => onSelectQuestion(question.id)}
          question={question}
        />
      ))}
    </div>
  );
}
