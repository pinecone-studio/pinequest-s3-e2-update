"use client";
import { FaceCam } from "@/app/components/faceDetection";
import type { OptionId, ExamData } from "../types";
import { ExamActions } from "./exam-actions";
import { ExamHeader } from "./exam-header";
import { ProgressSummary } from "./progress-summary";
import { QuestionCard } from "./question-card";
import { QuestionNavigator } from "./question-navigator";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { IoWarning } from "react-icons/io5";

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

  useEffect(() => {
    const handleWindowChange = () => {
      setWarning(true);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        handleWindowChange();
      }
    };

    window.addEventListener("blur", handleWindowChange);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("blur", handleWindowChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-6 text-[#1f2a44] md:px-6 lg:px-8 relative">
      <FaceCam />
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
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-white border-2 border-gray-400 rounded-2xl flex flex-col">
            <div className="w-full h-20 flex justify-end items-center">
              <button
                className="w-10 h-10 border-2 border-black rounded-full mr-3 flex justify-center items-center cursor-pointer bg-gray-100 hover:bg-gray-200 duration-200"
                onClick={() => setWarning(false)}
              >
                <IoClose size={25} />
              </button>
            </div>
            <div className="w-full h-full flex flex-col pt-10 items-center gap-10">
              <p className="text-[30px] font-semibold flex justify-center items-center gap-5">
                <IoWarning size={40} color="" /> Анхааруулга
              </p>
              <p className="text-[20px] font-semibold w-[85%] text-center">
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
