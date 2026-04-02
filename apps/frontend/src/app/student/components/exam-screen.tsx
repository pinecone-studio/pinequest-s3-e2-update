"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { WarningIcon } from "@/app/_icons/warningIcon";
import type { ExamData, OptionId } from "../types";
import { ExamActions } from "./exam-actions";
import { ExamHeader } from "./exam-header";
import { QuestionCard } from "./question-card";
import { QuestionNavigator } from "./question-navigator";
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
  const [faceDetectionWarning, setFaceDetectionWarning] = useState<
    string | null
  >(null);

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
    <main className="relative min-h-screen bg-[#edf6ff] px-3 pb-8 pt-4 text-[#1f2a44] sm:px-5 sm:pt-6 md:px-8 lg:px-12 lg:pt-7">
      <div className="mx-auto w-full max-w-[min(100%,56rem)] xl:max-w-[72rem]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center">
            <Image
              src="/bugsteibee.png"
              alt="Update"
              width={56}
              height={56}
              priority
              className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14"
            />
            <span className="ml-2 truncate text-lg font-semibold tracking-[0.02em] text-[#1a1a1a] sm:ml-3 sm:text-[22px]">
              UPDATE
            </span>
          </div>
          <FaceCam
            setFaceDetectionWarning={setFaceDetectionWarning}
            faceDetectionWarning={faceDetectionWarning}
          />
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-[46rem] flex-col gap-4 sm:mt-8 xl:max-w-none">
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

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-2 lg:items-start lg:gap-6 xl:grid-cols-[repeat(2,minmax(0,582px))] xl:justify-between">
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

          <div className="flex w-full justify-stretch sm:justify-end">
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-[20px] border border-[#29A4FF] px-5 py-3 text-base font-medium text-[#29A4FF] transition hover:bg-[#f3f9ff] sm:w-auto sm:min-w-[12rem] sm:px-8 sm:py-4 sm:text-lg lg:text-[22px]"
            >
              Шалгалт дуусгах
            </button>
          </div>
        </div>
      </div>

      {warning && !isFinishDialogOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-1/2 top-1/2 flex max-h-[min(90dvh,36rem)] w-[min(calc(100vw-1.5rem),898px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-y-auto overscroll-contain rounded-[20px] bg-[#edf6ff] px-4 py-6 shadow-lg sm:rounded-[28px] sm:px-8 sm:py-10 md:px-10 md:py-12">
            <div className="flex h-20 shrink-0 items-center justify-center sm:h-28">
              <WarningIcon />
            </div>

            <div className="mt-3 flex min-h-0 flex-col items-center justify-center text-center sm:mt-4">
              <h2 className="text-lg font-medium leading-tight text-[#0A0A0A] sm:text-[22px]">
                Анхааруулга
              </h2>
              <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-[#A1A1A1] sm:mt-5 sm:text-[18px]">
                Шалгалтын үед дараах үйлдлүүд бүртгэгдэнэ:
              </p>
              <ul className="mt-4 max-w-sm list-disc pl-5 text-left text-sm font-normal leading-normal text-[#262626] sm:mt-5 sm:pl-6 sm:text-[18px]">
                <li>Дэлгэц солих</li>
                <li>Шинэ цонх нээх</li>
              </ul>
              <p className="mt-4 max-w-md text-sm font-normal leading-relaxed text-[#A1A1A1] sm:mt-5 sm:text-[18px]">
                Энэ мэдээлэл багшид харагдана.
              </p>
            </div>

            <div className="mt-6 flex w-full shrink-0 justify-center sm:mt-7">
              <button
                type="button"
                className="inline-flex h-10 w-full max-w-xs items-center justify-center rounded-[20px] border border-[#29A4FF] px-4 py-2 text-base font-medium text-[#29A4FF] transition hover:bg-[#f3f9ff] sm:h-9 sm:w-auto sm:px-6 sm:text-[18px]"
                onClick={() => setWarning(false)}
              >
                Буцах
              </button>
            </div>
          </div>
        </div>
      )}

      {faceDetectionWarning && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-1/2 top-1/2 flex max-h-[min(90dvh,28rem)] w-[min(calc(100vw-1.5rem),37.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-2xl border-2 border-gray-400 bg-white shadow-lg">
            <div className="flex h-14 shrink-0 items-center justify-end sm:h-20">
              <button
                type="button"
                className="mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-gray-100 duration-200 hover:bg-gray-200 sm:mr-3"
                onClick={() => setFaceDetectionWarning(null)}
                aria-label="Хаах"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-6 px-4 pb-8 pt-2 sm:gap-10 sm:px-6 sm:pt-6">
              <p className="flex flex-wrap items-center justify-center gap-2 text-center text-xl font-semibold sm:gap-5 sm:text-[clamp(1.25rem,4vw,1.875rem)]">
                <AlertTriangle className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" />
                Анхааруулга
              </p>
              <p className="max-w-prose text-center text-base font-semibold leading-snug text-pretty sm:text-lg">
                {faceDetectionWarning}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
