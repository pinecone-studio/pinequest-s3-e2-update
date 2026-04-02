"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getApprovalRequestsClient,
  getApprovalUpdatedEventName,
  upsertPendingApprovalRequest,
} from "@/app/lib/exam-approval-store";
import { CREATE_EXAM } from "@/graphql/typeDefs/mutations";
import {
  GET_ALL_SUBJECTS,
  GET_CLASS_BY_TEACHER_AND_SCHOOL_ID,
  GET_EXAM_BY_SCHOOL_ID,
} from "@/graphql/typeDefs/queries";
import { useTeacherDb } from "../../_components/teacher-db-context";
import { useTeacher } from "../../teacher-shell";
import { mapGqlTeacherClasses } from "../../_lib/teacher-class-options";
import { mapBackendTestsToQuestions } from "../../question-bank/_hooks/backend-question-mappers";
import {
  GET_ALL_TESTS_QUERY,
  type GetAllTestsResponse,
} from "../../question-bank/_hooks/get-tests";
import type { Question } from "../../question-bank/_lib/types";
import { QUESTION_TYPE_LABELS } from "../../question-bank/_lib/utils";
import {
  EXAM_GRADE_OPTIONS,
  INITIAL_FORM,
  PENDING_EXAM_TRANSFER_STORAGE_KEY,
  QUESTION_BANK_PREFILL_STORAGE_KEY,
} from "../_lib/constants";
import { normalizeSavedExamRecord } from "../_lib/utils";
import type {
  ExamComposerState,
  ExamQuestionDetail,
  ExamQuestionItem,
  PendingExamTransfer,
  SavedExamRecord,
} from "../_lib/types";

type GetAllSubjectResponse = {
  getAllSubject: { id: string; name: string }[];
};

type BackendExam = {
  id: string;
  grade: number;
  subjectId: string;
  topic: string | null;
  title: string | null;
  date: string | null;
  location: string | null;
  duration: string | null;
  variation: string | null;
  testIds: string[] | null;
  openExerciseIds: string[] | null;
  notes: string | null;
  score: number | null;
  usageCount: number | null;
  isActive: number | null;
  needpermission: number | null;
  schoolId: string;
  teacherId: string | null;
  createdAt: string;
  updatedAt: string;
};

type GetExamBySchoolIdResponse = {
  getExamBySchoolId: BackendExam[];
};

type CreateExamResponse = {
  createExam: BackendExam;
};

function parseGradeToInt(gradeLabel: string) {
  const n = Number.parseInt(gradeLabel, 10);
  return Number.isFinite(n) ? n : 0;
}

function gradeLabel(grade: number): string {
  if (grade >= 1 && grade <= 12) return `${grade}-р анги`;
  return "";
}

function parseDurationMinutes(duration: string | null | undefined): number {
  if (!duration) return 40;
  const n = Number.parseInt(duration, 10);
  return Number.isFinite(n) && n > 0 ? n : 40;
}

function parseGradeCode(grade: string) {
  const matched = grade.match(/\d+/);
  return matched ? matched[0] : grade.trim();
}

type ClassesByTeacherResponse = {
  getClassByTeacherAndSchoolId: Array<{
    id: string;
    grade: number;
    section: string;
  }>;
};

export function useTeacherExamPage() {
  const router = useRouter();
  const clerkUser = useTeacher();
  const { teacher: dbTeacher } = useTeacherDb();
  const teacherId = dbTeacher?.id ?? "";
  const schoolId = dbTeacher?.schoolId ?? "";

  const { data: testsData } = useQuery<GetAllTestsResponse>(GET_ALL_TESTS_QUERY);
  const { data: subjectsData } =
    useQuery<GetAllSubjectResponse>(GET_ALL_SUBJECTS);

  const { data: classesData } = useQuery<ClassesByTeacherResponse>(
    GET_CLASS_BY_TEACHER_AND_SCHOOL_ID,
    {
      variables: { input: { teacherId, schoolId } },
      skip: !teacherId || !schoolId,
      fetchPolicy: "cache-and-network",
    },
  );

  const teacherClasses = useMemo(
    () => mapGqlTeacherClasses(classesData?.getClassByTeacherAndSchoolId ?? []),
    [classesData?.getClassByTeacherAndSchoolId],
  );

  const { data: examsData, refetch: refetchExams } =
    useQuery<GetExamBySchoolIdResponse>(GET_EXAM_BY_SCHOOL_ID, {
      variables: { schoolId },
      skip: !schoolId,
      fetchPolicy: "cache-and-network",
    });

  const [createExam] = useMutation<CreateExamResponse>(CREATE_EXAM);
  const [exam, setExam] = useState<ExamComposerState>(INITIAL_FORM);
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);
  const [examQuestions, setExamQuestions] = useState<ExamQuestionItem[]>([]);
  const [transferredQuestions, setTransferredQuestions] = useState<Question[]>(
    [],
  );
  const [savedExams, setSavedExams] = useState<SavedExamRecord[]>([]);
  const [hasLoadedSavedExams, setHasLoadedSavedExams] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeSavedExamId, setActiveSavedExamId] = useState<string | null>(
    null,
  );
  const [selectedClassByExamId, setSelectedClassByExamId] = useState<
    Record<string, string>
  >({});

  const questionBank = useMemo(() => {
    const backendQuestions = mapBackendTestsToQuestions(
      testsData?.getAllTests ?? [],
    );
    const merged = new Map<string, Question>();

    for (const question of [...backendQuestions, ...transferredQuestions]) {
      merged.set(question.id, question);
    }

    return Array.from(merged.values());
  }, [testsData?.getAllTests, transferredQuestions]);

  const subjectNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of subjectsData?.getAllSubject ?? []) map.set(s.id, s.name);
    return map;
  }, [subjectsData?.getAllSubject]);

  const subjectOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...(subjectsData?.getAllSubject ?? []).map((s) => s.name),
          ...questionBank.map((question) => question.subject),
        ]),
      ).sort((a, b) => a.localeCompare(b, "mn", { sensitivity: "base" })),
    [questionBank, subjectsData?.getAllSubject],
  );
  const topicSuggestions = useMemo(
    () =>
      Array.from(
        new Set(
          questionBank
            .filter((question) =>
              exam.subject
                ? question.subject.toLowerCase() === exam.subject.toLowerCase()
                : true,
            )
            .map((question) => question.topic),
        ),
      ).sort(),
    [exam.subject, questionBank],
  );
  const filteredQuestions = useMemo(
    () =>
      [...questionBank]
        .filter((question) => matchesSearch(question, search))
        .sort(
          (left, right) =>
            scoreQuestion(right, exam) - scoreQuestion(left, exam) ||
            right.usageCount - left.usageCount,
        ),
    [exam, questionBank, search],
  );
  const examQuestionDetails = useMemo(
    () =>
      examQuestions
        .slice()
        .sort((left, right) => left.order - right.order)
        .map((item) => ({
          ...item,
          question: questionBank.find(
            (question) => question.id === item.questionId,
          ),
        }))
        .filter((item): item is ExamQuestionDetail => Boolean(item.question)),
    [examQuestions, questionBank],
  );
  const totalPoints = examQuestionDetails.reduce(
    (sum, item) => sum + item.assignedPoints,
    0,
  );

  const savedExamsFromApi = useMemo(() => {
    const rows = examsData?.getExamBySchoolId ?? [];
    return rows
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((row) => {
        const testIds = Array.isArray(row.testIds) ? row.testIds : [];
        const openIds = Array.isArray(row.openExerciseIds)
          ? row.openExerciseIds
          : [];
        const questionIds = [...testIds, ...openIds];
        const durationInMinutes = parseDurationMinutes(row.duration);
        const subjectName =
          subjectNameById.get(row.subjectId) ?? row.subjectId ?? "";
        return normalizeSavedExamRecord({
          id: row.id,
          title: row.title ?? "",
          grade: gradeLabel(row.grade),
          classGroup: "",
          subject: subjectName,
          topic: row.topic ?? "",
          durationInMinutes,
          status: "published",
          totalPoints: row.score ?? 0,
          questionCount: questionIds.length,
          savedAt: row.createdAt,
          questions: questionIds.map((questionId, index) => ({
            examQuestionId: `exam-question-${questionId}`,
            questionId,
            assignedPoints:
              questionBank.find((q) => q.id === questionId)?.points ?? 1,
            order: index,
          })),
          requiresSchoolApproval: Boolean(row.needpermission),
          approvalStatus: row.needpermission ? "pending" : "not_required",
          sentClassIds: [],
          approvalExamDate: "",
          approvalStartTime: "09:00",
          approvalEndTime: "10:00",
          approvalLocation: "",
        });
      });
  }, [examsData?.getExamBySchoolId, questionBank, subjectNameById]);

  useEffect(() => {
    queueMicrotask(() => {
      setSavedExams(savedExamsFromApi);
      setHasLoadedSavedExams(true);
    });
  }, [savedExamsFromApi]);

  useEffect(() => {
    const syncApprovalStatus = () => {
      setSavedExams((current) => {
        const approvals = getApprovalRequestsClient();
        const statusByExamId = new Map(
          approvals.map((item) => [item.examId, item.status] as const),
        );
        return current.map((item) => {
          if (!item.requiresSchoolApproval) return item;
          const status = statusByExamId.get(item.id);
          if (status === "approved")
            return { ...item, approvalStatus: "approved" as const };
          if (status === "needs_fix")
            return { ...item, approvalStatus: "needs_fix" as const };
          if (status === "pending")
            return { ...item, approvalStatus: "pending" as const };
          return item;
        });
      });
    };

    syncApprovalStatus();
    const eventName = getApprovalUpdatedEventName();
    window.addEventListener(eventName, syncApprovalStatus);
    return () => window.removeEventListener(eventName, syncApprovalStatus);
  }, []);

  const toastTimeoutRef = useRef<number | undefined>(undefined);
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(""), 2600);
  }, []);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(
      PENDING_EXAM_TRANSFER_STORAGE_KEY,
    );
    if (!raw) return;

    try {
      const pending = JSON.parse(raw) as PendingExamTransfer;
      const pendingIds = Array.isArray(pending.questionIds)
        ? pending.questionIds
        : [];
      const transferred = Array.isArray(pending.questions)
        ? pending.questions
        : [];
      const transferredMap = new Map(
        transferred.map((question) => [question.id, question] as const),
      );
      const pendingQuestions = pendingIds
        .map(
          (questionId) =>
            transferredMap.get(questionId) ??
            questionBank.find((question) => question.id === questionId),
        )
        .filter((question): question is Question => Boolean(question));
      if (pendingQuestions.length === 0) return;

      queueMicrotask(() => {
        setTransferredQuestions((current) => {
          const merged = new Map(
            current.map((question) => [question.id, question] as const),
          );
          for (const question of transferred) {
            merged.set(question.id, question);
          }
          return Array.from(merged.values());
        });
      });

      const firstQuestion = pendingQuestions[0];
      queueMicrotask(() => {
        setExam((current) => ({
          ...current,
          grade: pending.exam?.grade || firstQuestion.grade || current.grade,
          subject:
            pending.exam?.subject || firstQuestion.subject || current.subject,
          topic: pending.exam?.topic || firstQuestion.topic || current.topic,
        }));
      });
      queueMicrotask(() => {
        setExamQuestions((current) => {
          const existingIds = new Set(current.map((item) => item.questionId));
          const appended = pendingQuestions
            .filter((question) => !existingIds.has(question.id))
            .map((question, index) => ({
              examQuestionId: `exam-question-${question.id}`,
              questionId: question.id,
              assignedPoints: question.points,
              order: current.length + index,
            }));

          return appended.length > 0 ? [...current, ...appended] : current;
        });
        setActiveSavedExamId(null);
        showToast(`${pendingQuestions.length} асуултыг шалгалт руу орууллаа.`);
      });
    } catch {
      window.sessionStorage.removeItem(PENDING_EXAM_TRANSFER_STORAGE_KEY);
      return;
    }

    window.sessionStorage.removeItem(PENDING_EXAM_TRANSFER_STORAGE_KEY);
  }, [questionBank, showToast]);

  const updateExam = <Key extends keyof ExamComposerState>(
    key: Key,
    value: ExamComposerState[Key],
  ) => setExam((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const selectedSubject = (subjectsData?.getAllSubject ?? []).find(
      (subject) => subject.name === exam.subject,
    );

    if (!exam.grade && !exam.subject) {
      window.sessionStorage.removeItem(QUESTION_BANK_PREFILL_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(
      QUESTION_BANK_PREFILL_STORAGE_KEY,
      JSON.stringify({
        grade: exam.grade,
        subject: exam.subject,
        subjectId: selectedSubject?.id ?? "",
      }),
    );
  }, [exam.grade, exam.subject, subjectsData?.getAllSubject]);

  const toggleSelectQuestion = (questionId: string) =>
    setSelectedBankIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );

  const addQuestionsToExam = (questionIds: string[]) => {
    if (questionIds.length === 0)
      return showToast("Нэмэхийн тулд дор хаяж нэг асуулт сонгоно уу.");
    const newQuestionCount = questionIds.filter(
      (questionId) =>
        !examQuestions.some((item) => item.questionId === questionId),
    ).length;
    setExamQuestions((current) => {
      const existingIds = new Set(current.map((item) => item.questionId));
      return [
        ...current,
        ...questionIds
          .filter((questionId) => !existingIds.has(questionId))
          .map((questionId, index) => ({
            examQuestionId: `exam-question-${questionId}`,
            questionId,
            assignedPoints:
              questionBank.find((item) => item.id === questionId)?.points ?? 1,
            order: current.length + index,
          })),
      ];
    });
    setSelectedBankIds((current) =>
      current.filter((id) => !questionIds.includes(id)),
    );
    showToast(
      newQuestionCount > 0
        ? `${newQuestionCount} асуултыг шалгалтад нэмлээ.`
        : "Эдгээр асуултууд шалгалтад аль хэдийн орсон байна.",
    );
  };

  const moveQuestion = (examQuestionId: string, direction: "up" | "down") =>
    setExamQuestions((current) =>
      reorderQuestions(current, examQuestionId, direction),
    );
  const removeExamQuestion = (examQuestionId: string) =>
    setExamQuestions((current) =>
      current
        .filter((item) => item.examQuestionId !== examQuestionId)
        .map((item, order) => ({ ...item, order })),
    );
  const updateAssignedPoints = (
    examQuestionId: string,
    assignedPoints: number,
  ) =>
    setExamQuestions((current) =>
      current.map((item) =>
        item.examQuestionId === examQuestionId
          ? {
              ...item,
              assignedPoints:
                Number.isFinite(assignedPoints) && assignedPoints > 0
                  ? assignedPoints
                  : 1,
            }
          : item,
      ),
    );

  const persistExam = async () => {
    if (!dbTeacher?.id) {
      return showToast(
        "Сургуулийн багшийн бүртгэл олдсонгүй. И-мэйлээр уригдаад linkTeacherClerk дууссаны дараа дахин оролдоно уу.",
      );
    }
    if (examQuestionDetails.length === 0)
      return showToast("Хадгалахаас өмнө дор хаяж нэг асуулт нэмнэ үү.");

    if (exam.requiresSchoolApproval) {
      if (!exam.approvalExamDate) {
        return showToast("Батлуулах огноо сонгоно уу.");
      }
      if (!exam.approvalLocation.trim()) {
        return showToast("Байршил/өрөө оруулна уу.");
      }
      if (!exam.approvalStartTime || !exam.approvalEndTime) {
        return showToast("Эхлэх, дуусах цаг оруулна уу.");
      }
      if (exam.approvalEndTime <= exam.approvalStartTime) {
        return showToast("Дуусах цаг нь эхлэх цагаас хойш байх ёстой.");
      }
    }

    const generatedTitle = [
      exam.subject.trim() || "Шалгалт",
      exam.topic.trim() || "Ерөнхий сэдэв",
      exam.grade.trim() || "",
    ]
      .filter(Boolean)
      .join(" · ");
    const nextTitle = exam.title.trim() || generatedTitle;

    const now = new Date().toISOString();
    const gradeInt = parseGradeToInt(exam.grade);
    const subjects = subjectsData?.getAllSubject ?? [];
    const subjectId =
      subjects.find((s) => s.name === exam.subject)?.id ?? exam.subject;

    const testIds = examQuestionDetails
      .filter((item) => item.question.questionType !== "long_answer")
      .map((item) => item.question.id);
    const openExerciseIds = examQuestionDetails
      .filter((item) => item.question.questionType === "long_answer")
      .map((item) => item.question.id);

    let createdExamId: string | null = null;
    try {
      const result = await createExam({
        variables: {
          input: {
            grade: gradeInt,
            subjectId,
            topic: exam.topic.trim() || null,
            title: nextTitle,
            date: now,
            location: null,
            duration: String(exam.durationInMinutes || 40),
            variation: null,
            testIds,
            openExerciseIds,
            notes: null,
            score: totalPoints,
            usageCount: 0,
            isActive: 1,
            needpermission: exam.requiresSchoolApproval ? 1 : 0,
            schoolId,
            teacherId: dbTeacher.id,
          },
        },
      });

      const created = result.data?.createExam;
      if (!created) {
        showToast("Шалгалт хадгалагдсангүй. Дахин оролдоно уу.");
        return;
      }

      createdExamId = created.id;
      setActiveSavedExamId(created.id);

      if (exam.requiresSchoolApproval) {
        const classCode = `${parseGradeCode(exam.grade)}${exam.classGroup.trim().toUpperCase()}`;
        upsertPendingApprovalRequest({
          examId: created.id,
          title: nextTitle,
          className: classCode || exam.grade.trim() || "Тодорхойгүй анги",
          subject: exam.subject.trim() || "Тодорхойгүй хичээл",
          teacherName: clerkUser.name || "Багш",
          materialTitle: `${exam.subject.trim() || "Шалгалт"} материал`,
          sentAt: now.slice(0, 16).replace("T", " "),
          questionCount: examQuestionDetails.length,
          requestedExamDate: exam.approvalExamDate,
          requestedStartTime: exam.approvalStartTime,
          requestedEndTime: exam.approvalEndTime,
          requestedLocation: exam.approvalLocation.trim(),
        });
      }

      showToast(
        exam.requiresSchoolApproval
          ? "Шалгалтыг хадгалж, сургуулийн зөвшөөрлийн хүсэлт илгээлээ."
          : "Шалгалтыг амжилттай хадгаллаа.",
      );
      refetchExams();
    } catch {
      showToast("Шалгалт хадгалахад алдаа гарлаа. Дахин оролдоно уу.");
      return;
    }

    if (!createdExamId) return;

    setExam((current) => ({
      ...current,
      title: nextTitle,
    }));
  };

  const openSavedExam = (savedExam: SavedExamRecord) => {
    const next = normalizeSavedExamRecord(savedExam);
    setExam({
      title: next.title,
      grade: next.grade,
      classGroup: next.classGroup,
      subject: next.subject,
      topic: next.topic,
      durationInMinutes: next.durationInMinutes,
      requiresSchoolApproval: Boolean(next.requiresSchoolApproval),
      approvalExamDate: next.approvalExamDate,
      approvalStartTime: next.approvalStartTime,
      approvalEndTime: next.approvalEndTime,
      approvalLocation: next.approvalLocation,
    });
    setExamQuestions(
      next.questions.map((item, index) => ({ ...item, order: index })),
    );
    setSelectedBankIds([]);
    setActiveSavedExamId(next.id);
    showToast(`"${next.title}" шалгалтыг нээлээ.`);
  };

  const deleteSavedExam = (savedExamId: string) => {
    setSavedExams((current) =>
      current.filter((item) => item.id !== savedExamId),
    );
    setSelectedClassByExamId((current) => {
      const next = { ...current };
      delete next[savedExamId];
      return next;
    });
    if (activeSavedExamId === savedExamId) setActiveSavedExamId(null);
    showToast("Хадгалсан шалгалтыг жагсаалтаас устгалаа.");
  };

  const selectClassForSavedExam = (savedExamId: string, classId: string) =>
    setSelectedClassByExamId((current) => ({
      ...current,
      [savedExamId]: classId,
    }));
  const openMonitoringForSavedExam = (savedExam: SavedExamRecord) => {
    router.push(
      `/teacher/exam-optimization?examId=${encodeURIComponent(savedExam.id)}`,
    );
    showToast(`"${savedExam.title}" шалгалтын хяналт руу шилжлээ.`);
  };

  const sendSavedExamToClass = (
    savedExam: SavedExamRecord,
    openMonitoring = false,
  ) => {
    if (savedExam.approvalStatus === "pending") {
      return showToast("Энэ шалгалт сургуулийн зөвшөөрөл хүлээж байна.");
    }
    if (savedExam.approvalStatus === "needs_fix") {
      return showToast(
        "Энэ шалгалтыг засварлаад дахин батлуулах шаардлагатай.",
      );
    }
    const classId = selectedClassByExamId[savedExam.id];
    if (!classId) return showToast("Илгээхийн өмнө ангиа сонгоно уу.");
    const selectedClass = teacherClasses.find((item) => item.id === classId);
    if (!selectedClass) return showToast("Сонгосон анги олдсонгүй.");

    const nextSavedExams = savedExams.map((item) =>
      item.id === savedExam.id
        ? {
            ...item,
            sentClassIds: Array.from(
              new Set([...(item.sentClassIds ?? []), classId]),
            ),
            sentClassLabels: {
              ...(item.sentClassLabels ?? {}),
              [classId]: selectedClass.name,
            },
          }
        : item,
    );

    setSavedExams(nextSavedExams);

    const monitoringUrl = `/teacher/exam-optimization?examId=${encodeURIComponent(savedExam.id)}`;
    showToast(
      openMonitoring
        ? `"${savedExam.title}" шалгалтын хяналт руу шилжлээ.`
        : `"${savedExam.title}" шалгалтыг ${selectedClass.name} ангид илгээлээ.`,
    );

    router.push(monitoringUrl);
  };

  return {
    activeSavedExamId,
    addQuestionsToExam,
    deleteSavedExam,
    exam,
    examQuestionDetails,
    examQuestions,
    filteredQuestions,
    gradeOptions: EXAM_GRADE_OPTIONS,
    hasLoadedSavedExams,
    moveQuestion,
    teacherClasses,
    openMonitoringForSavedExam,
    openSavedExam,
    persistExam,
    removeExamQuestion,
    savedExams,
    search,
    selectedBankIds,
    selectedClassByExamId,
    selectClassForSavedExam,
    sendSavedExamToClass,
    setSearch,
    subjectOptions,
    toastMessage,
    toggleSelectQuestion,
    topicSuggestions,
    totalPoints,
    updateAssignedPoints,
    updateExam,
  };
}

function matchesSearch(question: Question, search: string) {
  const normalizedSearch = search.trim().toLowerCase();
  return (
    !normalizedSearch ||
    [
      question.title,
      question.content.prompt,
      question.grade,
      question.subject,
      question.topic,
      QUESTION_TYPE_LABELS[question.questionType],
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch)
  );
}

function scoreQuestion(question: Question, exam: ExamComposerState) {
  return (
    (exam.grade && question.grade.toLowerCase() === exam.grade.toLowerCase()
      ? 4
      : 0) +
    (exam.subject &&
    question.subject.toLowerCase() === exam.subject.toLowerCase()
      ? 4
      : 0) +
    (exam.topic && question.topic.toLowerCase() === exam.topic.toLowerCase()
      ? 5
      : 0) +
    (question.status === "published" ? 1 : 0)
  );
}

function reorderQuestions(
  current: ExamQuestionItem[],
  examQuestionId: string,
  direction: "up" | "down",
) {
  const ordered = [...current].sort((left, right) => left.order - right.order);
  const index = ordered.findIndex(
    (item) => item.examQuestionId === examQuestionId,
  );
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= ordered.length) return current;
  const next = [...ordered];
  [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  return next.map((item, order) => ({ ...item, order }));
}
