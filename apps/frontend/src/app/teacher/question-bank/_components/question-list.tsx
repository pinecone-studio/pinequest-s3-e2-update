"use client";

import type { Question, QuestionBankTab } from "../_lib/types";
import { EmptyState } from "./empty-state";
import { QuestionCard } from "./question-card";

type QuestionListProps = {
  questions: Question[];
  tab: QuestionBankTab;
  onAddToExam: (questionId: string) => void;
  onCopyToSchool: (questionId: string) => void;
  onCreateQuestion: () => void;
  onDeleteQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
};

export function QuestionList({
  questions,
  tab,
  onAddToExam,
  onCopyToSchool,
  onCreateQuestion,
  onDeleteQuestion,
  onEditQuestion,
}: QuestionListProps) {
  if (questions.length === 0) {
    return <EmptyState onCreateQuestion={onCreateQuestion} tab={tab} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          onAddToExam={() => onAddToExam(question.id)}
          onCopyToSchool={() => onCopyToSchool(question.id)}
          onDelete={() => onDeleteQuestion(question.id)}
          onEdit={() => onEditQuestion(question.id)}
          question={question}
          tab={tab}
        />
      ))}
    </div>
  );
}
