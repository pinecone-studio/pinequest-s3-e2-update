"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ExamData, OptionId } from "../types";
import { ExamActions } from "./exam-actions";
import { ExamHeader } from "./exam-header";
import { QuestionCard } from "./question-card";
import { QuestionNavigator } from "./question-navigator";
import { WarningIcon } from "@/app/_icons/warningIcon";

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
  isFinishDialogOpen?: boolean;
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
  isFinishDialogOpen = false,
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
    <main className="relative min-h-screen bg-[#edf6ff] text-[#1f2a44]">
      <div className="mx-auto w-full max-w-[1512px] px-12 pt-7">
        <div className="flex items-center">
          <Image
            src="/bugsteibee.png"
            alt="Update"
            width={56}
            height={56}
            priority
            className="h-14 w-14 object-contain"
          />
          <span className="ml-3 text-[22px] font-semibold tracking-[0.02em] text-[#1a1a1a]">
            UPDATE
          </span>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-[1184px] flex-col gap-4">
          <ExamHeader
            title={examData.title}
            subtitle={`${examData.schoolYear} · ${examData.term}`}
            timerText={timerText}
          />

          <QuestionCard
            question={currentQuestion}
            selectedOption={answers[currentQuestion.id]}
            onSelectOption={onSelectOption}
          />

          <div className="grid gap-5 xl:grid-cols-[repeat(2,minmax(0,582px))] xl:items-start xl:justify-between">
            <QuestionNavigator
              total={totalQuestions}
              currentQuestionId={currentQuestion.id}
              answers={answers}
              flagged={flagged}
              onJump={onJump}
              answeredCount={answeredCount}
              onFinish={onFinish}
            />
            <div className="flex w-full flex-col">
              <ExamActions
                isFirst={currentQuestionIndex === 0}
                isLast={currentQuestionIndex === totalQuestions - 1}
                isFlagged={Boolean(flagged[currentQuestion.id])}
                onPrevious={onPrevious}
                onNext={onNext}
                onToggleFlag={onToggleFlag}
              />
            </div>
          </div>

          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex min-w-[271px] h-[58px] items-center justify-center rounded-[20px] border border-[#29A4FF]  px-8 py-4 text-[22px] font-medium text-[#29A4FF] transition hover:bg-[#f3f9ff]"
            >
              Шалгалт дуусгах
            </button>
          </div>
        </div>
      </div>

      {warning && !isFinishDialogOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-1/2 top-1/2 flex h-[460px] w-[min(calc(100vw-2rem),898px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[28px] bg-[#EDF6FF] px-10 py-12 shadow-lg">
            <div className="flex h-28 items-center justify-center">
              <WarningIcon />
            </div>

            <div className="mt-4 flex flex-1 flex-col items-center justify-center text-center">
              <h2 className="text-[22px] font-medium leading-[1.1] text-[#0A0A0A]">
                Анхааруулга
              </h2>
              <p className="mt-5 text-[18px] font-medium leading-[1.45] text-[#A1A1A1]">
                Шалгалтын үед дараах үйлдлүүд бүртгэгдэнэ:
              </p>
              <ul className="mt-5 list-disc text-left text-[18px] font-normal leading-[1.5] text-[#262626]">
                <li>Дэлгэц солих</li>
                <li>Шинэ цонх нээх</li>
              </ul>
              <p className="mt-5 text-[18px] font-normal  leading-[1.45] text-[#A1A1A1]">
                Энэ мэдээлэл багшид харагдана.
              </p>
            </div>

            <div className="mt-7.5 flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-[36px] min-w-[86px] items-center justify-center rounded-[20px] border border-[#29A4FF]  px-3.5 py-1.5 text-[18px] font-medium text-[#29A4FF] transition hover:bg-[#f3f9ff]"
                onClick={() => setWarning(false)}
              >
                Буцах
              </button>
              <button
                type="button"
                className="inline-flex h-[36px] min-w-[169px] items-center justify-center rounded-[20px] bg-[#349AF2] px-3.5 py-1.5 text-[18px] font-medium text-white transition hover:bg-[#2488e0]"
                onClick={() => setWarning(false)}
              >
                Үргэлжлүүлэх
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
