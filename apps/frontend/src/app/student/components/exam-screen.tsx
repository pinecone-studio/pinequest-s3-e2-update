"use client";

import type { OptionId, ExamData } from "../types";
import { ExamActions } from "./exam-actions";
import { ExamHeader } from "./exam-header";
import { ProgressSummary } from "./progress-summary";
import { QuestionCard } from "./question-card";
import { QuestionNavigator } from "./question-navigator";
import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import FaceCam from "./faceDetection";

type ExamScreenProps = {
  examData: ExamData;
  timerText: string;
  currentQuestionIndex: number;
  answers: Partial<Record<number, OptionId>>;
  flagged: Partial<Record<number, boolean>>;
  answeredCount: number;
  onSelectOption: (optionId: OptionId) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFlag: () => void;
  onJump: (questionId: number) => void;
  onFinish: () => void;
};

export function ExamScreen({
  examData,
  timerText,
  currentQuestionIndex,
  answers,
  flagged,
  answeredCount,
  onSelectOption,
  onPrevious,
  onNext,
  onToggleFlag,
  onJump,
  onFinish,
}: ExamScreenProps) {
  const totalQuestions = examData.questions.length;
  const currentQuestion = examData.questions[currentQuestionIndex];

  const [warning, setWarning] = useState(false);

  // useEffect(() => {
  //   const handleWindowChange = () => {
  //     setWarning(true);
  //   };

  //   const handleVisibility = () => {
  //     if (document.hidden) {
  //       handleWindowChange();
  //     }
  //   };

  //   window.addEventListener("blur", handleWindowChange);
  //   document.addEventListener("visibilitychange", handleVisibility);

  //   return () => {
  //     window.removeEventListener("blur", handleWindowChange);
  //     document.removeEventListener("visibilitychange", handleVisibility);
  //   };
  // }, []);

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-6 text-[#1f2a44] md:px-6 lg:px-8 relative">
      <div className="absolute top-10 right-20">
        <FaceCam />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <ExamHeader
          title={examData.title}
          subtitle={`${examData.schoolYear} · ${examData.term}`}
          timerText={timerText}
        />

        <ProgressSummary
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          answeredCount={answeredCount}
        />

        <QuestionCard
          question={currentQuestion}
          selectedOption={answers[currentQuestion.id]}
          onSelectOption={onSelectOption}
        />

        <ExamActions
          isFirst={currentQuestionIndex === 0}
          isLast={currentQuestionIndex === totalQuestions - 1}
          isFlagged={Boolean(flagged[currentQuestion.id])}
          onPrevious={onPrevious}
          onNext={onNext}
          onToggleFlag={onToggleFlag}
        />

        <QuestionNavigator
          total={totalQuestions}
          currentQuestionId={currentQuestion.id}
          answers={answers}
          flagged={flagged}
          onJump={onJump}
          answeredCount={answeredCount}
          onFinish={onFinish}
        />
      </div>

      {warning && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-1/2 top-1/2 flex max-h-[min(90dvh,28rem)] w-[min(calc(100vw-1.5rem),37.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-2xl border-2 border-gray-400 bg-white shadow-lg">
            <div className="flex h-14 shrink-0 items-center justify-end sm:h-20">
              <button
                type="button"
                className="mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-gray-100 duration-200 hover:bg-gray-200 sm:mr-3"
                onClick={() => setWarning(false)}
                aria-label="Хаах"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-6 px-4 pb-8 pt-2 sm:gap-10 sm:px-6 sm:pt-6">
              <p className="flex flex-wrap items-center justify-center gap-2 text-center text-xl font-semibold sm:gap-5 sm:text-[clamp(1.25rem,4vw,1.875rem)]">
                <AlertTriangle className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" />{" "}
                Анхааруулга
              </p>
              <p className="max-w-prose text-center text-base font-semibold leading-snug text-pretty sm:text-lg">
                Шалгалтын явцад дэлгэц солих, шинэ цонх нээх зэрэг хуулах
                оролдлого гаргаж болохгүйг анхаарна уу. Энэ мэдэгдэл багшид
                хандагдана.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
