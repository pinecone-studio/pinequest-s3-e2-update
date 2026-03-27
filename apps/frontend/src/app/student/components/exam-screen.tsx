import { FaceCam } from "@/app/components/faceDetection";
import type { OptionId, ExamData } from "../types";
import { ExamActions } from "./exam-actions";
import { ExamHeader } from "./exam-header";
import { ProgressSummary } from "./progress-summary";
import { QuestionCard } from "./question-card";
import { QuestionNavigator } from "./question-navigator";


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

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-6 text-[#1f2a44] md:px-6 lg:px-8">
      <FaceCam/>
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
    </main>
  );
}
