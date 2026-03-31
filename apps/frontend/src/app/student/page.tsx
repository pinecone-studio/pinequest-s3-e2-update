"use client";

import { useEffect, useMemo, useState } from "react";
import {
	EXAM_MONITORING_STORAGE_KEY,
	createExamMonitoringScopeKey,
	readExamMonitoringStateMap,
	type ExamMonitoringScopeStateMap,
} from "../lib/exam-monitoring-store";
import { teacherClasses } from "../teacher/exam/_lib/class-data";
import { SAVED_EXAMS_STORAGE_KEY } from "../teacher/exam/_lib/constants";
import type { SavedExamRecord } from "../teacher/exam/_lib/types";
import { normalizeSavedExamRecord } from "../teacher/exam/_lib/utils";
import { CompletedScreen } from "./components/completed-screen";
import { EntryStep } from "./components/entry-step";
import { ExamScreen } from "./components/exam-screen";
import { FinishConfirmationDialog } from "./components/finish-confirmation-dialog";
import { PrecheckStep } from "./components/precheck-step";
import { examData } from "./mock-data";
import type { ExamData, ExamPhase, OptionId } from "./types";
import { formatTimer } from "./utils";

export default function StudentExamPage() {
	const [phase, setPhase] = useState<ExamPhase>("entry");
	const [studentLastName, setStudentLastName] = useState("");
	const [studentFirstName, setStudentFirstName] = useState("");
	const [studentEmail, setStudentEmail] = useState("");
	const [classCode, setClassCode] = useState("");
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

	const activeSavedExam = useMemo(() => {
		return [...savedExams]
			.filter((item) => (item.sentClassIds ?? []).length > 0)
			.sort(
				(left, right) =>
					new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime(),
			)[0] ?? null;
	}, [savedExams]);

	const resolvedExamData = useMemo<ExamData>(
		() =>
			activeSavedExam
				? buildDemoExamData(activeSavedExam)
				: examData,
		[activeSavedExam],
	);
	const totalQuestions = resolvedExamData.questions.length;
	const currentQuestion = resolvedExamData.questions[currentQuestionIndex];
	const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
	const normalizedClassCode = classCode.trim().toUpperCase();
	const matchedClass = useMemo(
		() =>
			teacherClasses.find(
				(klass) => klass.name.trim().toUpperCase() === normalizedClassCode,
			) ?? null,
		[normalizedClassCode],
	);
	const selectedClassId = matchedClass?.id ?? null;
	const requiresDeliveredClass = Boolean(
		activeSavedExam && (activeSavedExam.sentClassIds ?? []).length > 0,
	);
	const isSelectedClassDelivered = Boolean(
		!activeSavedExam ||
			!requiresDeliveredClass ||
			(selectedClassId &&
				(activeSavedExam.sentClassIds ?? []).includes(selectedClassId)),
	);
	const monitoringScopeKey =
		activeSavedExam && selectedClassId
			? createExamMonitoringScopeKey(activeSavedExam.id, selectedClassId)
			: null;
	const monitoringScopeState = monitoringScopeKey
		? monitoringStateMap[monitoringScopeKey] ?? null
		: null;
	const sharedStartedAt = monitoringScopeState?.startedAt ?? null;
	const isTeacherStarted = Boolean(sharedStartedAt);
	const sharedRemainingSeconds = useMemo(() => {
		const totalDurationSeconds = resolvedExamData.durationMinutes * 60;
		if (!sharedStartedAt) return totalDurationSeconds;

		const elapsedSeconds = Math.floor((currentTime - sharedStartedAt) / 1000);
		return Math.max(0, totalDurationSeconds - elapsedSeconds);
	}, [currentTime, resolvedExamData.durationMinutes, sharedStartedAt]);
	const usesTeacherControlledStart = Boolean(activeSavedExam);
	const remainingSeconds = usesTeacherControlledStart
		? sharedRemainingSeconds
		: manualRemainingSeconds;
	const timerText = formatTimer(remainingSeconds);

	const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.trim());
	const canProceed =
		studentLastName.trim().length > 1 &&
		studentFirstName.trim().length > 1 &&
		isEmailValid &&
		(!requiresDeliveredClass ||
			(normalizedClassCode.length > 0 && isSelectedClassDelivered));
	const canStartExam = usesTeacherControlledStart
		? Boolean(
				normalizedClassCode &&
					isSelectedClassDelivered &&
					isTeacherStarted &&
					remainingSeconds > 0,
		  )
		: true;
	const precheckStatusText = activeSavedExam
		? !normalizedClassCode
			? "Илгээсэн ангийн кодоо оруулна уу."
			: !isSelectedClassDelivered
				? "Энэ ангид тухайн шалгалт илгээгдээгүй байна."
				: !isTeacherStarted
					? "Багш шалгалтыг эхлүүлэхийг хүлээж байна."
					: remainingSeconds > 0
						? `Шалгалт эхэлсэн. Үлдсэн хугацаа: ${timerText}`
						: "Шалгалтын хугацаа дууссан байна."
		: "Шалгалт эхлэхэд бэлэн байна.";
	const startButtonLabel = usesTeacherControlledStart
		? canStartExam
			? "Шалгалтад орох"
			: "Багш эхлүүлэхийг хүлээнэ үү"
		: "Шалгалт эхлүүлэх";
	const classCodeHint = activeSavedExam
		? normalizedClassCode.length === 0
			? "Шалгалт илгээгдсэн ангийг оруулна уу. Жишээ: 10A"
			: !matchedClass
				? "Ийм анги олдсонгүй."
				: !isSelectedClassDelivered
					? "Энэ ангид тухайн шалгалт илгээгдээгүй байна."
					: `Илгээсэн анги баталгаажлаа: ${matchedClass.name}`
		: undefined;
	const hasTimedOut = phase === "exam" && remainingSeconds <= 0;

	useEffect(() => {
		const syncSavedExams = () => {
			try {
				const raw = window.localStorage.getItem(SAVED_EXAMS_STORAGE_KEY);
				setSavedExams(
					raw
						? (JSON.parse(raw) as SavedExamRecord[]).map(normalizeSavedExamRecord)
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
		setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
	};

	const handleToggleFlag = () => {
		setFlagged((prev) => ({
			...prev,
			[currentQuestion.id]: !prev[currentQuestion.id],
		}));
	};

	const handleStartExam = () => {
		if (!canStartExam) return;

		if (!usesTeacherControlledStart) {
			setManualRemainingSeconds(resolvedExamData.durationMinutes * 60);
		}

		setPhase("exam");
	};

	if (isFinished || hasTimedOut) return <CompletedScreen />;

	if (phase === "entry") {
		return (
			<EntryStep
				studentLastName={studentLastName}
				studentFirstName={studentFirstName}
				studentEmail={studentEmail}
				classCode={classCode}
				canProceed={canProceed}
				classCodeHint={classCodeHint}
				classCodeRequired={requiresDeliveredClass}
				onChangeLastName={setStudentLastName}
				onChangeFirstName={setStudentFirstName}
				onChangeEmail={setStudentEmail}
				onChangeClassCode={setClassCode}
				onApplyDemo={() => {
					const demoClassName =
						activeSavedExam && (activeSavedExam.sentClassIds ?? []).length > 0
							? teacherClasses.find(
									(klass) => klass.id === activeSavedExam.sentClassIds?.[0],
							  )?.name ?? "10A"
							: "10A";

					setStudentLastName("Түвшин");
					setStudentFirstName("Элзий-Орших");
					setStudentEmail("student@school.mn");
					setClassCode(demoClassName);
				}}
				onProceed={() => setPhase("precheck")}
			/>
		);
	}

	if (phase === "precheck") {
		return (
			<PrecheckStep
				examTitle={resolvedExamData.title}
				durationMinutes={resolvedExamData.durationMinutes}
				canStart={canStartExam}
				startButtonLabel={startButtonLabel}
				statusText={precheckStatusText}
				studentEmail={studentEmail}
				onStart={handleStartExam}
			/>
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
