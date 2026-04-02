/** @format */

"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  STUDENT_EXAM_AUTH,
  SUBMIT_STUDENT_EXAM,
} from "@/graphql/typeDefs/mutations";
import {
  GET_EXAM_BY_ID,
  GET_EXAM_QUESTION_ITEMS,
} from "@/graphql/typeDefs/queries";
import {
  discardStudentExamTokenIfNotForExam,
  readStudentExamClassId,
  readStudentExamToken,
  writeStudentExamToken,
} from "../_lib/exam-session-storage";
import {
  buildExamDataFromApi,
  type ApiTestRow,
} from "../_lib/exam-data-from-api";
import { CompletedScreen } from "../components/completed-screen";
import { EntryStep } from "../components/entry-step";
import { ExamScreen } from "../components/exam-screen";
import { FinishConfirmationDialog } from "../components/finish-confirmation-dialog";
import type { ExamPhase, OptionId } from "../types";
import { formatTimer } from "../utils";

const DEFAULT_DURATION_MINUTES = 40;

type GqlExamRow = {
  id: string;
  title: string | null;
  topic: string | null;
  duration: string | null;
  testIds: string[] | null;
  openExerciseIds: string[] | null;
  allowedClassIds: string[] | null;
  monitoringStartedAt: string | null;
};

type StudentExamAuthData = {
  studentExamAuth: {
    token: string;
    student: { classId: string } | null;
  };
};

type SubmitStudentExamData = {
  submitStudentExam: {
    id: string;
    status: string | null;
    testScore: number | null;
    totalScore: number | null;
    actualScore: number | null;
  };
};

function formatGraphQLError(error: unknown): string {
  const raw =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: string }).message)
      : "Алдаа гарлаа.";
  return raw.trim() || raw;
}

function formatStudentExamAuthError(error: unknown): string {
  const raw = formatGraphQLError(error);
  return (
    raw
      .replace(/^Failed to student exam auth:\s*Error:\s*/i, "")
      .replace(/^Failed to student exam auth:\s*/i, "")
      .trim() || raw
  );
}

function StudentExamByIdInner({ routeExamId }: { routeExamId: string }) {
  const [phase, setPhase] = useState<ExamPhase>("entry");
  const [classCode, setClassCode] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [examSessionToken, setExamSessionToken] = useState<string | null>(() =>
    readStudentExamToken(routeExamId),
  );
  const [hasAcceptedRules, setHasAcceptedRules] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<number, OptionId>>>({});
  const [flagged, setFlagged] = useState<Partial<Record<number, boolean>>>({});
  const [manualRemainingSeconds, setManualRemainingSeconds] = useState(
    DEFAULT_DURATION_MINUTES * 60,
  );
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [entryProceedError, setEntryProceedError] = useState<string | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const studentClassIdForGate =
    examSessionToken != null ? readStudentExamClassId(routeExamId) : null;

  const [studentExamAuthMutation, { loading: authLoading }] =
    useMutation<StudentExamAuthData>(STUDENT_EXAM_AUTH);

  const [submitExamMutation, { loading: submitLoading }] =
    useMutation<SubmitStudentExamData>(SUBMIT_STUDENT_EXAM);

  const [examPollIntervalMs, setExamPollIntervalMs] = useState(0);

  const {
    data: examQueryData,
    loading: examLoading,
    error: examError,
  } = useQuery<{ getExamById: GqlExamRow | null }>(GET_EXAM_BY_ID, {
    variables: { examId: routeExamId },
    skip: !routeExamId || !examSessionToken,
    pollInterval: examPollIntervalMs,
  });

  const examRow = examQueryData?.getExamById ?? null;

  const waitingForTeacherStart = useMemo(() => {
    if (!examSessionToken || !examRow) return false;
    const cid = studentClassIdForGate?.trim();
    if (!cid) return false;
    const allowed = examRow.allowedClassIds ?? [];
    if (!allowed.includes(cid)) return false;
    return !examRow.monitoringStartedAt?.trim();
  }, [examSessionToken, examRow, studentClassIdForGate]);

  useEffect(() => {
    setExamPollIntervalMs(waitingForTeacherStart ? 2000 : 0);
  }, [waitingForTeacherStart]);
  const testIds = examRow?.testIds ?? [];
  const openExerciseIds = examRow?.openExerciseIds ?? [];

  const { data: itemsData, loading: itemsLoading } = useQuery<{
    getTestsByIds: ApiTestRow[];
    getOpenExerciesByIds: unknown[];
  }>(GET_EXAM_QUESTION_ITEMS, {
    variables: { testIds, openExerciseIds },
    skip: !routeExamId || !examSessionToken || !examRow,
  });

  const testsById = useMemo(() => {
    const rows = itemsData?.getTestsByIds ?? [];
    return new Map(rows.map((r) => [r.id, r]));
  }, [itemsData?.getTestsByIds]);

  const apiExamData = useMemo(() => {
    if (!examRow || !itemsData) return null;
    return buildExamDataFromApi(
      {
        title: examRow.title,
        topic: examRow.topic,
        duration: examRow.duration,
        testIds: examRow.testIds,
      },
      testsById,
    );
  }, [examRow, itemsData, testsById]);

  const resolvedExamData = apiExamData;

  const totalQuestions = resolvedExamData?.questions.length ?? 0;
  const currentQuestion = resolvedExamData?.questions[currentQuestionIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const remainingSeconds = manualRemainingSeconds;
  const timerText = formatTimer(remainingSeconds);

  useEffect(() => {
    discardStudentExamTokenIfNotForExam(routeExamId);
    setExamSessionToken(readStudentExamToken(routeExamId));
  }, [routeExamId]);

  useEffect(() => {
    if (phase !== "entry" || !examSessionToken || authLoading) return;
    if (examLoading || itemsLoading || !examRow || !apiExamData) {
      return;
    }

    if (apiExamData.questions.length === 0) {
      setEntryProceedError(
        "Энэ шалгалтад олон сонголттой хангалттай асуулт олдсонгүй.",
      );
      return;
    }

    if (waitingForTeacherStart) {
      return;
    }

    const rawStart = examRow.monitoringStartedAt?.trim();
    const startedMs = rawStart ? Date.parse(rawStart) : Number.NaN;
    const totalSec = apiExamData.durationMinutes * 60;
    if (Number.isFinite(startedMs)) {
      const elapsed = Math.floor((Date.now() - startedMs) / 1000);
      setManualRemainingSeconds(Math.max(0, totalSec - elapsed));
    } else {
      setManualRemainingSeconds(totalSec);
    }
    setEntryProceedError(null);
    setPhase("exam");
  }, [
    phase,
    examSessionToken,
    authLoading,
    examLoading,
    itemsLoading,
    examRow,
    apiExamData,
    waitingForTeacherStart,
  ]);

  const hasTimedOut = phase === "exam" && remainingSeconds <= 0;

  const serverExamStartedAtMs = useMemo(() => {
    const raw = examRow?.monitoringStartedAt?.trim();
    if (!raw) return null;
    const t = Date.parse(raw);
    return Number.isFinite(t) ? t : null;
  }, [examRow?.monitoringStartedAt]);

  useEffect(() => {
    if (phase !== "exam" || isFinished || !resolvedExamData) return;

    const totalSec = resolvedExamData.durationMinutes * 60;

    if (serverExamStartedAtMs != null) {
      const tick = () => {
        const elapsed = Math.floor(
          (Date.now() - serverExamStartedAtMs) / 1000,
        );
        setManualRemainingSeconds(Math.max(0, totalSec - elapsed));
      };
      tick();
      const timer = window.setInterval(tick, 1000);
      return () => {
        window.clearInterval(timer);
      };
    }

    const timer = window.setInterval(() => {
      setManualRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isFinished, phase, resolvedExamData, serverExamStartedAtMs]);

  const handleSelectOption = (optionId: OptionId) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleStartExam = async () => {
    if (!hasAcceptedRules) {
      setEntryProceedError("Шалгалтын журмыг уншиж танилцсанаа чеклэнэ үү.");
      return;
    }
    const trimmedStudentCode = studentCode.trim();
    if (!trimmedStudentCode) {
      setEntryProceedError("Сурагчийн кодоо оруулна уу.");
      return;
    }

    setEntryProceedError(null);

    try {
      const result = await studentExamAuthMutation({
        variables: {
          input: { examId: routeExamId, studentCode: trimmedStudentCode },
        },
      });
      const auth = result.data?.studentExamAuth;
      const token = auth?.token;
      const classId = auth?.student?.classId ?? null;
      if (!token) {
        setEntryProceedError(
          result.error?.message ?? "Сурагчийн баталгаажуулалт амжилтгүй.",
        );
        return;
      }
      writeStudentExamToken(routeExamId, token, classId);
      setExamSessionToken(token);
    } catch (error: unknown) {
      setEntryProceedError(formatStudentExamAuthError(error));
    }
  };

  const handleConfirmFinish = async () => {
    if (!resolvedExamData || resolvedExamData.questions.length === 0) return;

    setSubmitError(null);

    const missing = resolvedExamData.questions.filter(
      (q) => answers[q.id] == null,
    );
    if (missing.length > 0) {
      setSubmitError("Бүх асуултад хариулна уу.");
      return;
    }

    const testResponses = resolvedExamData.questions
      .map((q) => {
        const testId = q.sourceTestId?.trim();
        if (!testId) return null;
        const selectedOption = answers[q.id];
        if (!selectedOption) return null;
        return { testId, selectedOption };
      })
      .filter((x): x is { testId: string; selectedOption: OptionId } => x != null);

    if (testResponses.length !== resolvedExamData.questions.length) {
      setSubmitError("Асуултын ID тохируулаагүй байна. Дахин ачаална уу.");
      return;
    }

    try {
      await submitExamMutation({
        variables: {
          input: {
            examId: routeExamId,
            testResponses,
          },
        },
      });
      setShowFinishDialog(false);
      setIsFinished(true);
    } catch (error: unknown) {
      setSubmitError(formatGraphQLError(error));
    }
  };

  if (isFinished || hasTimedOut) return <CompletedScreen />;

  if (phase === "entry") {
    const loadError =
      examSessionToken != null
        ? (examError?.message ??
          (!examLoading && !examRow ? "Шалгалт олдсонгүй." : null))
        : null;

    const showTeacherWait =
      examSessionToken != null &&
      !examLoading &&
      examRow != null &&
      waitingForTeacherStart;

    return (
      <div className="relative">
        {authLoading ||
        (examSessionToken != null &&
          (examLoading || (examRow != null && itemsLoading))) ? (
          <div className="flex min-h-[120px] items-center justify-center bg-[#edf6ff] px-4 py-6 text-sm text-[#5c6786]">
            Шалгалтын өгөгдлийг ачааллаж байна…
          </div>
        ) : null}
        {loadError ? (
          <div className="mx-auto max-w-lg px-4 py-4 text-center text-sm text-red-700">
            {loadError}
          </div>
        ) : null}
        {showTeacherWait ? (
          <div className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-[#365077]">
            <p className="text-base font-medium text-[#1f2a44]">
              Багш шалгалтыг эхлүүлэхийг хүлээнэ үү.
            </p>
            <p className="mt-2 text-[#5c6786]">
              Хяналтын дэлгэц дээр «Эхлүүлэх» товч дарагдмагц автоматаар
              нээгдэнэ.
            </p>
          </div>
        ) : null}
        {!showTeacherWait ? (
        <EntryStep
          classCode={classCode}
          hasAcceptedRules={hasAcceptedRules}
          classCodeRequired={false}
          showClassCodeField={false}
          studentCode={studentCode}
          studentCodeRequired
          proceedError={entryProceedError}
          onChangeStudentCode={(value) => {
            setEntryProceedError(null);
            setStudentCode(value);
          }}
          onChangeClassCode={(value) => {
            setEntryProceedError(null);
            setClassCode(value);
          }}
          onToggleAcceptedRules={(checked) => {
            setEntryProceedError(null);
            setHasAcceptedRules(checked);
          }}
          onProceed={() => {
            void handleStartExam();
          }}
        />
        ) : null}
      </div>
    );
  }

  if (!resolvedExamData || !currentQuestion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#edf6ff] px-4 text-[#1f2a44]">
        <p className="text-sm">Асуулт олдсонгүй.</p>
      </main>
    );
  }

  return (
    <>
      <ExamScreen
        examData={resolvedExamData}
        timerText={timerText}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        flagged={flagged}
        answeredCount={answeredCount}
        onSelectOption={handleSelectOption}
        onPrevious={() =>
          setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
        }
        onNext={() =>
          setCurrentQuestionIndex((prev) =>
            Math.min(totalQuestions - 1, prev + 1),
          )
        }
        onToggleFlag={handleToggleFlag}
        onJump={(questionId) => setCurrentQuestionIndex(questionId - 1)}
        onFinish={() => {
          setSubmitError(null);
          setShowFinishDialog(true);
        }}
        isFinishDialogOpen={showFinishDialog}
        showWaitForStart={false}
      />

      <FinishConfirmationDialog
        isOpen={showFinishDialog}
        answeredCount={answeredCount}
        total={totalQuestions}
        isSubmitting={submitLoading}
        submitError={submitError}
        onCancel={() => {
          if (!submitLoading) {
            setShowFinishDialog(false);
            setSubmitError(null);
          }
        }}
        onConfirm={() => {
          void handleConfirmFinish();
        }}
      />
    </>
  );
}

export default function StudentExamByIdPage() {
  const params = useParams();
  const routeExamId =
    typeof params?.examId === "string" ? params.examId.trim() : "";

  if (!routeExamId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#edf6ff] px-4 text-[#1f2a44]">
        <p className="text-sm">Шалгалтын ID олдсонгүй.</p>
      </main>
    );
  }

  return <StudentExamByIdInner key={routeExamId} routeExamId={routeExamId} />;
}
