/** @format */

"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { STUDENT_EXAM_AUTH } from "@/graphql/typeDefs/mutations";
import {
	GET_EXAM_BY_ID,
	GET_EXAM_QUESTION_ITEMS,
} from "@/graphql/typeDefs/queries";
import {
	discardStudentExamTokenIfNotForExam,
	readStudentExamToken,
	writeStudentExamToken,
} from "../_lib/exam-session-storage";
import {
  EXAM_MONITORING_STORAGE_KEY,
  createExamMonitoringScopeKey,
  readExamMonitoringStateMap,
  type ExamMonitoringScopeStateMap,
} from "../../lib/exam-monitoring-store";
import { SAVED_EXAMS_STORAGE_KEY } from "../../teacher/exam/_lib/constants";
import type { SavedExamRecord } from "../../teacher/exam/_lib/types";
import { normalizeSavedExamRecord } from "../../teacher/exam/_lib/utils";
import { CompletedScreen } from "../components/completed-screen";
import { EntryStep } from "../components/entry-step";
import { ExamScreen } from "../components/exam-screen";
import { FinishConfirmationDialog } from "../components/finish-confirmation-dialog";
import {
  buildExamDataFromApi,
  type ApiTestRow,
} from "../_lib/exam-data-from-api";
import { STUDENT_ENTRY_CLASS_OPTIONS } from "../_lib/entry-class-options";
import { examData } from "../mock-data";
import type { ExamData, ExamPhase, OptionId } from "../types";
import { formatTimer } from "../utils";

type GqlExamRow = {
  id: string;
  title: string | null;
  topic: string | null;
  duration: string | null;
  testIds: string[] | null;
  openExerciseIds: string[] | null;
};

type StudentExamAuthData = {
  studentExamAuth: { token: string };
};

function formatStudentExamAuthError(error: unknown): string {
  const raw =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: string }).message)
      : "Нэвтрэхэд алдаа гарлаа.";
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
  const [savedExams, setSavedExams] = useState<SavedExamRecord[]>([]);
  const [monitoringStateMap, setMonitoringStateMap] =
    useState<ExamMonitoringScopeStateMap>({});
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<number, OptionId>>>({});
  const [flagged, setFlagged] = useState<Partial<Record<number, boolean>>>({});
  const [manualRemainingSeconds, setManualRemainingSeconds] = useState(
    examData.durationMinutes * 60,
  );
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [entryProceedError, setEntryProceedError] = useState<string | null>(
    null,
  );

  const [studentExamAuthMutation, { loading: authLoading }] =
    useMutation<StudentExamAuthData>(STUDENT_EXAM_AUTH);

  const {
    data: examQueryData,
    loading: examLoading,
    error: examError,
  } = useQuery<{ getExamById: GqlExamRow | null }>(GET_EXAM_BY_ID, {
    variables: { examId: routeExamId },
    skip: !routeExamId || !examSessionToken,
  });

  const examRow = examQueryData?.getExamById ?? null;
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

  const linkedSavedExam = useMemo(
    () => savedExams.find((item) => item.id === routeExamId) ?? null,
    [savedExams, routeExamId],
  );

  const teacherMonitoringExam = useMemo(
    () =>
      linkedSavedExam && (linkedSavedExam.sentClassIds ?? []).length > 0
        ? linkedSavedExam
        : null,
    [linkedSavedExam],
  );

  const resolvedExamData = useMemo<ExamData>(() => {
    if (apiExamData && apiExamData.questions.length > 0) return apiExamData;
    if (linkedSavedExam) return buildDemoExamData(linkedSavedExam);
    return examData;
  }, [apiExamData, linkedSavedExam]);

  const totalQuestions = resolvedExamData.questions.length;
  const currentQuestion = resolvedExamData.questions[currentQuestionIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const normalizedClassCode = classCode.trim().toUpperCase();
  const requiresDeliveredClass = Boolean(
    linkedSavedExam && (linkedSavedExam.sentClassIds ?? []).length > 0,
  );

  const globalClassByCode = useMemo(() => {
    if (!normalizedClassCode) return null;
    return (
      STUDENT_ENTRY_CLASS_OPTIONS.find(
        (klass) => klass.name.trim().toUpperCase() === normalizedClassCode,
      ) ?? null
    );
  }, [normalizedClassCode]);

  const deliveredClassByCode = useMemo(() => {
    if (!normalizedClassCode || !linkedSavedExam?.sentClassIds?.length) {
      return null;
    }
    const labels = linkedSavedExam.sentClassLabels ?? {};
    for (const id of linkedSavedExam.sentClassIds) {
      const label = labels[id];
      if (label && label.trim().toUpperCase() === normalizedClassCode) {
        return { id, name: label };
      }
    }
    for (const opt of STUDENT_ENTRY_CLASS_OPTIONS) {
      if (
        opt.name.trim().toUpperCase() === normalizedClassCode &&
        linkedSavedExam.sentClassIds.includes(opt.id)
      ) {
        return { id: opt.id, name: opt.name };
      }
    }
    return null;
  }, [normalizedClassCode, linkedSavedExam]);

  const matchedClass = useMemo(() => {
    if (!normalizedClassCode) return null;
    if (requiresDeliveredClass) {
      return deliveredClassByCode;
    }
    return globalClassByCode;
  }, [
    normalizedClassCode,
    requiresDeliveredClass,
    deliveredClassByCode,
    globalClassByCode,
  ]);

  const selectedClassId = matchedClass?.id ?? null;

  const isSelectedClassDelivered = Boolean(
    !linkedSavedExam ||
    !requiresDeliveredClass ||
    (selectedClassId != null &&
      (linkedSavedExam.sentClassIds ?? []).includes(selectedClassId)),
  );

  const entryClassHintKind = useMemo(() => {
    if (!linkedSavedExam || !normalizedClassCode) return null;
    if (!requiresDeliveredClass) return null;
    if (deliveredClassByCode) return "ok" as const;
    if (
      globalClassByCode &&
      !(linkedSavedExam.sentClassIds ?? []).includes(globalClassByCode.id)
    ) {
      return "not_delivered" as const;
    }
    return "unknown" as const;
  }, [
    linkedSavedExam,
    normalizedClassCode,
    requiresDeliveredClass,
    deliveredClassByCode,
    globalClassByCode,
  ]);

  const monitoringScopeKey =
    teacherMonitoringExam && selectedClassId
      ? createExamMonitoringScopeKey(teacherMonitoringExam.id, selectedClassId)
      : null;
  const monitoringScopeState = monitoringScopeKey
    ? (monitoringStateMap[monitoringScopeKey] ?? null)
    : null;
  const sharedStartedAt = monitoringScopeState?.startedAt ?? null;
  const sharedRemainingSeconds = useMemo(() => {
    const totalDurationSeconds = resolvedExamData.durationMinutes * 60;
    if (!sharedStartedAt) return totalDurationSeconds;

    const elapsedSeconds = Math.floor((currentTime - sharedStartedAt) / 1000);
    return Math.max(0, totalDurationSeconds - elapsedSeconds);
  }, [currentTime, resolvedExamData.durationMinutes, sharedStartedAt]);
  const usesTeacherControlledStart = Boolean(teacherMonitoringExam);
  const remainingSeconds = usesTeacherControlledStart
    ? sharedRemainingSeconds
    : manualRemainingSeconds;
  const timerText = formatTimer(remainingSeconds);

  useEffect(() => {
    discardStudentExamTokenIfNotForExam(routeExamId);
    setExamSessionToken(readStudentExamToken(routeExamId));
  }, [routeExamId]);

  useEffect(() => {
    if (phase !== "entry" || !examSessionToken || authLoading) return;
    if (examLoading || itemsLoading || !examRow || !apiExamData) return;

    if (apiExamData.questions.length === 0) {
      setEntryProceedError(
        "Энэ шалгалтад олон сонголттой хангалттай асуулт олдсонгүй.",
      );
      return;
    }

    if (usesTeacherControlledStart) {
      if (entryClassHintKind === "not_delivered") {
        setEntryProceedError(
          "Энэ ангид тухайн шалгалт илгээгдээгүй байна.",
        );
        return;
      }
      if (!matchedClass) {
        setEntryProceedError("Ийм анги олдсонгүй. Жишээ: 10A");
        return;
      }
      if (!isSelectedClassDelivered) {
        setEntryProceedError("Энэ ангид тухайн шалгалт илгээгдээгүй байна.");
        return;
      }
      const totalDurationSeconds = apiExamData.durationMinutes * 60;
      if (sharedStartedAt != null) {
        const elapsedSeconds = Math.floor(
          (Date.now() - sharedStartedAt) / 1000,
        );
        const rs = Math.max(0, totalDurationSeconds - elapsedSeconds);
        if (rs <= 0) {
          setEntryProceedError("Шалгалтын хугацаа дууссан байна.");
          return;
        }
      }
    } else {
      setManualRemainingSeconds(apiExamData.durationMinutes * 60);
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
    usesTeacherControlledStart,
    entryClassHintKind,
    matchedClass,
    isSelectedClassDelivered,
    sharedStartedAt,
  ]);

  const classCodeHint = linkedSavedExam
    ? normalizedClassCode.length === 0
      ? "Шалгалт илгээгдсэн ангийг оруулна уу. Жишээ: 10A"
      : entryClassHintKind === "not_delivered"
        ? "Энэ ангид тухайн шалгалт илгээгдээгүй байна."
        : !matchedClass
          ? "Ийм анги олдсонгүй."
          : `Илгээсэн анги баталгаажлаа: ${matchedClass.name}`
    : undefined;
  const hasTimedOut = phase === "exam" && remainingSeconds <= 0;

  useEffect(() => {
    const syncSavedExams = () => {
      try {
        const raw = window.localStorage.getItem(SAVED_EXAMS_STORAGE_KEY);
        setSavedExams(
          raw
            ? (JSON.parse(raw) as SavedExamRecord[]).map(
                normalizeSavedExamRecord,
              )
            : [],
        );
      } catch {
        setSavedExams([]);
      }
    };

    const syncMonitoringState = () => {
      setMonitoringStateMap(readExamMonitoringStateMap());
    };

    syncSavedExams();
    syncMonitoringState();

    const onStorage = (event: StorageEvent) => {
      if (event.key === SAVED_EXAMS_STORAGE_KEY) syncSavedExams();
      if (event.key === EXAM_MONITORING_STORAGE_KEY) syncMonitoringState();
    };

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!sharedStartedAt || remainingSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [remainingSeconds, sharedStartedAt]);

  useEffect(() => {
    if (usesTeacherControlledStart || phase !== "exam" || isFinished) return;

    const timer = window.setInterval(() => {
      setManualRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isFinished, phase, usesTeacherControlledStart]);

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
    if (!normalizedClassCode) {
      setEntryProceedError("Шалгалтын кодоо оруулна уу.");
      return;
    }
    const trimmedStudentCode = studentCode.trim();
    if (!trimmedStudentCode) {
      setEntryProceedError("Сурагчийн кодоо оруулна уу.");
      return;
    }

    if (usesTeacherControlledStart) {
      if (entryClassHintKind === "not_delivered") {
        setEntryProceedError("Энэ ангид тухайн шалгалт илгээгдээгүй байна.");
        return;
      }
      if (!matchedClass) {
        setEntryProceedError("Ийм анги олдсонгүй. Жишээ: 10A");
        return;
      }
      if (!isSelectedClassDelivered) {
        setEntryProceedError("Энэ ангид тухайн шалгалт илгээгдээгүй байна.");
        return;
      }
      if (remainingSeconds <= 0) {
        setEntryProceedError("Шалгалтын хугацаа дууссан байна.");
        return;
      }
    }

    setEntryProceedError(null);

    try {
      const result = await studentExamAuthMutation({
        variables: {
          input: { examId: routeExamId, studentCode: trimmedStudentCode },
        },
      });
      const token = result.data?.studentExamAuth?.token;
      if (!token) {
        setEntryProceedError(
          result.error?.message ?? "Сурагчийн баталгаажуулалт амжилтгүй.",
        );
        return;
      }
      writeStudentExamToken(routeExamId, token);
      setExamSessionToken(token);
    } catch (error: unknown) {
      setEntryProceedError(formatStudentExamAuthError(error));
    }
  };

  if (isFinished || hasTimedOut) return <CompletedScreen />;

  if (phase === "entry") {
    const loadError =
      examSessionToken != null
        ? (examError?.message ??
          (!examLoading && !examRow ? "Шалгалт олдсонгүй." : null))
        : null;

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
        <EntryStep
          classCode={classCode}
          hasAcceptedRules={hasAcceptedRules}
          classCodeHint={classCodeHint}
          classCodeRequired={requiresDeliveredClass}
          studentCode={studentCode}
          studentCodeRequired
          proceedError={entryProceedError}
          onChangeClassCode={(value) => {
            setEntryProceedError(null);
            setClassCode(value);
          }}
          onChangeStudentCode={(value) => {
            setEntryProceedError(null);
            setStudentCode(value);
          }}
          onToggleAcceptedRules={(checked) => {
            setEntryProceedError(null);
            setHasAcceptedRules(checked);
          }}
          onProceed={() => {
            void handleStartExam();
          }}
      />
      </div>
    );
  }

  if (!currentQuestion) {
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
        onFinish={() => setShowFinishDialog(true)}
        isFinishDialogOpen={showFinishDialog}
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

function buildDemoExamData(savedExam: SavedExamRecord): ExamData {
  const questionCount = Math.max(savedExam.questionCount, 1);
  const questions = Array.from({ length: questionCount }, (_, index) => {
    const baseQuestion = examData.questions[index % examData.questions.length];

    return {
      ...baseQuestion,
      id: index + 1,
      questionNumber: index + 1,
    };
  });

  return {
    ...examData,
    title: savedExam.title,
    durationMinutes: savedExam.durationInMinutes,
    questions,
  };
}
