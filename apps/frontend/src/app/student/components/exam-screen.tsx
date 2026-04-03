"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ExamData, OptionId } from "../types";
import type { FaceKindTelemetry } from "./faceDetection";
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
  showWaitForStart?: boolean;
  /** Хяналтын WebSocket — таб/нүүрний telemetry */
  sendExamTelemetry?: (payload: Record<string, unknown>) => void;
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
  showWaitForStart = false,
  sendExamTelemetry,
}: ExamScreenProps) {
  const totalQuestions = examData.questions.length;
  const currentQuestion = examData.questions[currentQuestionIndex];

  const [warning, setWarning] = useState(false);
  const [faceDetectionWarning, setFaceDetectionWarning] = useState<
    string | null
  >(null);

  const sendExamTelemetryRef = useRef(sendExamTelemetry);
  sendExamTelemetryRef.current = sendExamTelemetry;
  const lastTabTelemetryAtRef = useRef(0);

  const emitTabTelemetry = useCallback((hidden: boolean) => {
    const now = Date.now();
    if (now - lastTabTelemetryAtRef.current < 1000) return;
    lastTabTelemetryAtRef.current = now;
    sendExamTelemetryRef.current?.({ type: "tab", hidden, at: now });
  }, []);

  const handleFaceKindTelemetry = useCallback((kind: FaceKindTelemetry) => {
    sendExamTelemetryRef.current?.({ type: "face", kind, at: Date.now() });
  }, []);

  useEffect(() => {
    const handleWindowChange = () => {
      setWarning(true);
      emitTabTelemetry(true);
    };

    const handleVisibility = () => {
      const hidden = document.hidden;
      if (hidden) {
        setWarning(true);
      }
      emitTabTelemetry(hidden);
    };

    const handleFocus = () => {
      emitTabTelemetry(false);
    };

    window.addEventListener("blur", handleWindowChange);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("blur", handleWindowChange);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [emitTabTelemetry]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C"].includes(e.key.toUpperCase())
      ) {
        e.preventDefault();
      }

      // Ctrl+U (view source)
      if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Disable right-click
    document.addEventListener("contextmenu", disableRightClick, {
      capture: true,
    });

    return () => {
      document.removeEventListener("contextmenu", disableRightClick, {
        capture: true,
      });
    };
  }, []);

  return (
    <main
      className="relative min-h-screen bg-[#edf6ff] px-3 pb-8 pt-4 text-[#1f2a44] sm:px-5 sm:pt-6 md:px-8 lg:px-12 lg:pt-7"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={`mx-auto w-full max-w-[min(100%,56rem)] transition-[filter,opacity] duration-200 xl:max-w-[72rem] ${
          showWaitForStart
            ? "pointer-events-none select-none blur-lg opacity-40"
            : ""
        }`}
      >
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
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4" />
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-[46rem] flex-col gap-4 sm:mt-8 xl:max-w-none">
          <ExamHeader
            title={examData.title}
            subtitle={`${examData.schoolYear} · ${examData.term}`}
            timerText={timerText}
            rightSlot={
              <FaceCam
                setFaceDetectionWarning={setFaceDetectionWarning}
                faceDetectionWarning={faceDetectionWarning}
                onFaceKindChange={handleFaceKindTelemetry}
              />
            }
          />

          <QuestionCard
            question={currentQuestion}
            selectedOption={answers[currentQuestion.id]}
            onSelectOption={onSelectOption}
          />

          <div className="flex w-full flex-col gap-4 sm:gap-5">
            <QuestionNavigator
              total={totalQuestions}
              currentQuestionId={currentQuestion.id}
              answers={answers}
              flagged={flagged}
              onJump={onJump}
              answeredCount={answeredCount}
              onFinish={onFinish}
            />

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <ExamActions
                isFirst={currentQuestionIndex === 0}
                isLast={currentQuestionIndex === totalQuestions - 1}
                isFlagged={Boolean(flagged[currentQuestion.id])}
                onPrevious={onPrevious}
                onNext={onNext}
                onToggleFlag={onToggleFlag}
              />

              <div className="flex w-full justify-end sm:w-auto">
                <button
                  type="button"
                  onClick={onFinish}
                  className="inline-flex h-10 min-w-[7.5rem] items-center justify-center rounded-[12px] border border-[#7bb8ff] bg-[#8ec4ff] px-6 text-base font-semibold text-[#1b2b57] transition hover:bg-[#7bb8ff] sm:h-10.5 sm:text-[18px]"
                >
                  Дуусгах
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {warning && !isFinishDialogOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-1/2 top-1/2 flex max-h-[min(80dvh,29.5rem)] w-[min(calc(100vw-2.625rem),31.375rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-y-auto overscroll-contain rounded-[20px] bg-[#edf6ff] px-4 py-6 shadow-lg sm:max-h-[min(90dvh,35.5rem)] sm:w-[min(calc(100vw-1.5rem),888px)] sm:rounded-[28px] sm:px-8 sm:py-10 md:px-10 md:py-12">
            <div className="flex h-20 shrink-0 items-center justify-center sm:h-28">
              <Image
                src="/alert-bee.png"
                alt="Анхааруулга"
                width={74}
                height={74}
                className="h-[60px] w-[60px] object-contain sm:h-[74px] sm:w-[74px]"
              />
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

      {showWaitForStart && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/58 backdrop-blur-[7px]" />
          <div className="absolute left-1/2 top-1/2 w-[min(calc(100vw-1.5rem),40rem)] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border border-[#cfe1f5] bg-[#edf6ff] px-5 py-8 text-center shadow-[0_14px_30px_rgba(15,23,42,0.2)] sm:w-[min(calc(100vw-2rem),42rem)] sm:px-10 sm:py-10">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#f3c846] text-lg font-bold text-[#f3c846]">
              !
            </div>
            <p className="mt-5 text-lg font-semibold leading-snug text-[#111827] sm:text-[20px]">
              Багш шалгалтыг эхлүүлэх хүртэл
              <br />
              түр хүлээнэ үү.
            </p>
          </div>
        </div>
      )}

      {faceDetectionWarning && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-1/2 top-1/2 flex min-h-[20rem] max-h-[min(88dvh,30rem)] w-[min(calc(100vw-2rem),32rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-2xl border border-[#7dc8ff] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.25)] sm:min-h-[22rem] sm:max-h-[min(92dvh,34rem)] sm:w-[min(calc(100vw-1.5rem),42rem)] sm:border-2">
            <div className="flex h-full mt-3 flex-col items-center justify-center gap-3 px-4 pb-6 pt-4 text-center sm:gap-3 sm:px-6 sm:pt-6">
              <div className="flex w-full justify-center">
                <span className="relative h-14 w-14 shrink-0 sm:h-20 sm:w-20">
                  <Image
                    src="/alert-bee.png"
                    alt="Анхааруулга"
                    fill
                    className="object-contain"
                  />
                </span>
              </div>
              <div className="flex w-full flex-col items-center gap-2 text-center mt-2">
                <p className="text-center text-xl font-semibold text-[#fdae00] sm:text-[clamp(1.2rem,4vw,1.9rem)]">
                  Анхааруулга
                </p>
                <p className="mx-auto max-w-prose text-center text-lg font-semibold leading-snug text-pretty text-[#111827] sm:text-xl">
                  {faceDetectionWarning}
                </p>
              </div>
            </div>
            <div className="mt-auto flex w-full justify-end px-4 pb-4 sm:px-6 sm:pb-6">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#7dc8ff] bg-white px-4 text-sm font-medium text-[#1f2a44] transition hover:bg-[#edf6ff] sm:h-10.5 sm:px-5 sm:text-base"
                onClick={() => setFaceDetectionWarning(null)}
              >
                Буцах
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
