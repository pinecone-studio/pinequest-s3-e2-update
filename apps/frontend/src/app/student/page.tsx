"use client"

import { useEffect, useMemo, useState } from "react";
import { CompletedScreen } from "./components/completed-screen";
import { EntryStep } from "./components/entry-step";
import { ExamScreen } from "./components/exam-screen";
import { FinishConfirmationDialog } from "./components/finish-confirmation-dialog";
import { PrecheckStep } from "./components/precheck-step";
import { examData } from "./mock-data";
import type { ExamPhase, OptionId } from "./types";
import { formatTimer } from "./utils";

export default function StudentExamPage() {
  const [phase, setPhase] = useState<ExamPhase>("entry");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [classCode, setClassCode] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<number, OptionId>>>({});
  const [flagged, setFlagged] = useState<Partial<Record<number, boolean>>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(
    examData.durationMinutes * 60,
  );
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const totalQuestions = examData.questions.length;
  const currentQuestion = examData.questions[currentQuestionIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.trim());
  const canProceed =
    studentLastName.trim().length > 1 &&
    studentFirstName.trim().length > 1 &&
    isEmailValid;

  useEffect(() => {
    if (phase !== "exam" || isFinished || remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, isFinished, remainingSeconds]);

  const handleSelectOption = (optionId: OptionId) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleStartExam = () => {
    setRemainingSeconds(examData.durationMinutes * 60);
    setPhase("exam");
  };

  if (isFinished) return <CompletedScreen />;

  if (phase === "entry") {
    return (
      <EntryStep
        studentLastName={studentLastName}
        studentFirstName={studentFirstName}
        studentEmail={studentEmail}
        classCode={classCode}
        canProceed={canProceed}
        onChangeLastName={setStudentLastName}
        onChangeFirstName={setStudentFirstName}
        onChangeEmail={setStudentEmail}
        onChangeClassCode={setClassCode}
        onApplyDemo={() => {
          setStudentLastName("Түвшин");
          setStudentFirstName("Элзий-Орших");
          setStudentEmail("student@school.mn");
          setClassCode("10A");
        }}
        onProceed={() => setPhase("precheck")}
      />
    );
  }

  if (phase === "precheck") {
    return (
      <PrecheckStep
        examTitle={examData.title}
        durationMinutes={examData.durationMinutes}
        studentEmail={studentEmail}
        onStart={handleStartExam}
      />
    );
  }

  return (
    <>
      <ExamScreen
        examData={examData}
        timerText={formatTimer(remainingSeconds)}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        flagged={flagged}
        answeredCount={answeredCount}
        onSelectOption={handleSelectOption}
        onPrevious={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
        onNext={() =>
          setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
        }
        onToggleFlag={handleToggleFlag}
        onJump={(questionId) => setCurrentQuestionIndex(questionId - 1)}
        onFinish={() => setShowFinishDialog(true)}
      />

      <FinishConfirmationDialog
        isOpen={showFinishDialog}
        answeredCount={answeredCount}
        total={totalQuestions}
        onCancel={() => setShowFinishDialog(false)}
        onConfirm={() => {
          setShowFinishDialog(false);
          setIsFinished(true);
        }}
      />
    </>
  );
}
