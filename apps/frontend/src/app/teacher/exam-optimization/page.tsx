/** @format */

"use client";

import { useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
	createExamMonitoringScopeKey,
	readExamMonitoringStateMap,
	writeExamMonitoringStateMap,
} from "@/app/lib/exam-monitoring-store";
import { GET_ALL_SUBJECTS, GET_EXAM_BY_SCHOOL_ID } from "@/graphql/typeDefs/queries";
import { HARDCODED_SCHOOL_ID } from "../_lib/hardcoded-teacher-api";
import { MonitorDetailSection } from "./_components/monitor-detail-section";
import { MonitorExamsSection } from "./_components/monitor-exams-section";
import {
	mapBackendExamsToMonitorCards,
	formatMonitorSavedAt,
	type BackendExamMonitorRow,
} from "./_lib/backend-exams-to-monitor-cards";
import {
	MOCK_ACTIVE_STUDENTS,
	formatRemainingDuration,
	type ActiveStudentEntry,
	type MonitorExamCardItem,
} from "./_lib/monitoring";
import { teacherClasses } from "../exam/_lib/class-data";
import { SAVED_EXAMS_STORAGE_KEY } from "../exam/_lib/constants";
import { normalizeSavedExamRecord } from "../exam/_lib/utils";
import type { SavedExamRecord } from "../exam/_lib/types";

type GetAllSubjectResponse = {
	getAllSubject: { id: string; name: string }[];
};

type GetExamBySchoolIdResponse = {
	getExamBySchoolId: BackendExamMonitorRow[];
};

export default function ExamOptimizationPage() {
	const ACTIVE_STUDENTS_STORAGE_KEY = "pinequest.activeStudents.v1";
	const searchParams = useSearchParams();

	const { data: subjectsData } = useQuery<GetAllSubjectResponse>(GET_ALL_SUBJECTS);
	const { data: examsData } = useQuery<GetExamBySchoolIdResponse>(
		GET_EXAM_BY_SCHOOL_ID,
		{
			variables: { schoolId: HARDCODED_SCHOOL_ID },
			fetchPolicy: "cache-and-network",
		},
	);

	const subjectNameById = useMemo(() => {
		const map = new Map<string, string>();
		for (const s of subjectsData?.getAllSubject ?? []) {
			map.set(s.id, s.name);
		}
		return map;
	}, [subjectsData?.getAllSubject]);

	const demoClassOptions = useMemo(
		() => teacherClasses.map((k) => ({ id: k.id, label: k.name })),
		[],
	);

	const apiMonitorCards = useMemo(() => {
		const rows = examsData?.getExamBySchoolId;
		if (!rows?.length) return [];
		return mapBackendExamsToMonitorCards(
			rows,
			subjectNameById,
			demoClassOptions,
		);
	}, [demoClassOptions, examsData?.getExamBySchoolId, subjectNameById]);

	const [savedExams, setSavedExams] = useState<SavedExamRecord[]>([]);
	const [selectedExamId, setSelectedExamId] = useState<string | null | undefined>(
		undefined,
	);
	const [selectedClassIdByExamId] = useState<Record<string, string>>({});
	const [monitoringByScope, setMonitoringByScope] = useState<Record<string, boolean>>(
		() => {
			const initialMonitoringState = readExamMonitoringStateMap();
			return Object.fromEntries(
				Object.entries(initialMonitoringState).map(([scope, value]) => [
					scope,
					Boolean(value.isStarted),
				]),
			);
		},
	);
	const [monitorStartedAtByScope, setMonitorStartedAtByScope] = useState<
		Record<string, number>
	>(() => {
		const initialMonitoringState = readExamMonitoringStateMap();
		return Object.fromEntries(
			Object.entries(initialMonitoringState)
				.filter(([, value]) => typeof value.startedAt === "number")
				.map(([scope, value]) => [scope, value.startedAt as number]),
		);
	});
	const [activeStudents, setActiveStudents] = useState<ActiveStudentEntry[]>(
		[],
	);
	const [currentTime, setCurrentTime] = useState(() => Date.now());

	const currentClassName = useMemo(() => {
		const grades = activeStudents
			.map((s) => s.grade?.trim())
			.filter((g): g is string => Boolean(g));

		if (!grades.length) return "—";

		const freq = new Map<string, number>();
		for (const g of grades) freq.set(g, (freq.get(g) ?? 0) + 1);

		let bestGrade = grades[0];
		let bestCount = 0;
		for (const [g, c] of freq.entries()) {
			if (c > bestCount) {
				bestCount = c;
				bestGrade = g;
			}
		}

		// If multiple grades are tied, show "олон анги" but keep best as hint.
		const uniqueCount = freq.size;
		if (uniqueCount > 1) {
			return `Олон анги (${bestGrade})`;
		}

		return bestGrade;
	}, [activeStudents]);

	const fallbackMockExamCards = useMemo<MonitorExamCardItem[]>(() => {
		return [
			{
				id: "monitor-mock-1",
				title: "10-р ангийн математикийн сорил",
				grade: "10-р анги",
				subject: "Математик",
				topic: "Квадрат функц",
				status: "ongoing",
				durationInMinutes: 40,
				questionCount: 12,
				totalPoints: 24,
				classLabel: currentClassName,
				classLabels: currentClassName === "—" ? [] : [currentClassName],
				classOptions:
					currentClassName === "—"
						? []
						: [{ id: "mock-class-10a", label: currentClassName }],
				savedAtLabel: "Одоо явагдаж байна",
			},
			{
				id: "monitor-mock-2",
				title: "9-р ангийн логикийн шалгалт",
				grade: "9-р анги",
				subject: "Математик",
				topic: "Логарифм",
				status: "completed",
				durationInMinutes: 30,
				questionCount: 10,
				totalPoints: 20,
				classLabel: "9B",
				classLabels: ["9B"],
				classOptions: [{ id: "mock-class-9b", label: "9B" }],
				savedAtLabel: "Өнөөдөр дууссан",
			},
		];
	}, [currentClassName]);

	const localStorageMonitorCards = useMemo<MonitorExamCardItem[]>(() => {
		if (savedExams.length === 0) return [];

		const firstSentExamId =
			savedExams.find((item) => (item.sentClassIds ?? []).length > 0)?.id ??
			null;
		const resolveClassLabel = (classId?: string) => {
			if (!classId) return "Анги оноогоогүй";
			return (
				teacherClasses.find((klass) => klass.id === classId)?.name ?? classId
			);
		};

		return savedExams.map((exam) => {
			const classOptions =
				(exam.sentClassIds ?? []).length > 0
					? (exam.sentClassIds ?? []).map((classId) => ({
							id: classId,
							label: resolveClassLabel(classId),
						}))
					: [];
			const classLabels = classOptions.map((item) => item.label);

			return {
				id: exam.id,
				title: exam.title,
				grade: exam.grade,
				subject: exam.subject,
				topic: exam.topic,
				durationInMinutes: exam.durationInMinutes,
				status:
					exam.approvalStatus === "pending"
						? "approval_pending"
						: classLabels.length === 0
							? "draft"
							: exam.id === firstSentExamId
								? "ongoing"
								: "completed",
				questionCount: exam.questionCount,
				totalPoints: exam.totalPoints,
				classLabel:
					classLabels.length > 0 ? classLabels.join(", ") : "Анги оноогоогүй",
				classLabels,
				classOptions,
				savedAtLabel: formatMonitorSavedAt(exam.savedAt),
			};
		});
	}, [savedExams]);

	const monitorExamCards = useMemo<MonitorExamCardItem[]>(() => {
		if (apiMonitorCards.length > 0) return apiMonitorCards;
		if (localStorageMonitorCards.length > 0) return localStorageMonitorCards;
		return fallbackMockExamCards;
	}, [apiMonitorCards, fallbackMockExamCards, localStorageMonitorCards]);

	const effectiveSelectedExamId = selectedExamId ?? searchParams.get("examId");
	const activeMonitorExam = useMemo(() => {
		if (!effectiveSelectedExamId) return null;
		return monitorExamCards.find((item) => item.id === effectiveSelectedExamId) ?? null;
	}, [effectiveSelectedExamId, monitorExamCards]);
	const activeClassId = activeMonitorExam
		? selectedClassIdByExamId[activeMonitorExam.id] ??
			activeMonitorExam.classOptions[0]?.id ??
			null
		: null;
	const activeClassLabel = activeMonitorExam
		? activeMonitorExam.classOptions.find((item) => item.id === activeClassId)?.label ??
			activeMonitorExam.classOptions[0]?.label ??
			null
		: null;
	const activeMonitoringScope =
		activeMonitorExam && activeClassId
			? createExamMonitoringScopeKey(activeMonitorExam.id, activeClassId)
			: null;
	const isActiveMonitoring = activeMonitoringScope
		? Boolean(monitoringByScope[activeMonitoringScope])
		: false;
	const activeScopeStartedAt = activeMonitoringScope
		? monitorStartedAtByScope[activeMonitoringScope] ?? null
		: null;
	const filteredActiveStudents = useMemo(() => {
		if (!activeClassLabel) return activeStudents;
		return activeStudents.filter(
			(student) => student.grade.trim().toLowerCase() === activeClassLabel.trim().toLowerCase(),
		);
	}, [activeClassLabel, activeStudents]);

	const monitorTotalStudents = useMemo(() => {
		if (activeMonitorExam) {
			let computed = 0;
			if (activeClassId) {
				const klass = teacherClasses.find((item) => item.id === activeClassId);
				if (klass) computed = klass.studentCount;
			}
			if (computed === 0) computed = filteredActiveStudents.length;
			return Math.max(36, computed);
		}
		return 0;
	}, [activeClassId, activeMonitorExam, filteredActiveStudents.length]);
	const remainingDurationMs = useMemo(() => {
		if (!activeMonitorExam) return 0;
		const totalDurationMs = activeMonitorExam.durationInMinutes * 60 * 1000;
		if (!isActiveMonitoring || !activeScopeStartedAt) return totalDurationMs;

		return Math.max(0, totalDurationMs - (currentTime - activeScopeStartedAt));
	}, [activeMonitorExam, activeScopeStartedAt, currentTime, isActiveMonitoring]);
	const remainingDurationLabel = useMemo(
		() => formatRemainingDuration(remainingDurationMs),
		[remainingDurationMs],
	);
	const monitoringElapsedSeconds = useMemo(() => {
		if (!isActiveMonitoring || !activeScopeStartedAt) return 0;
		return Math.max(0, Math.floor((currentTime - activeScopeStartedAt) / 1000));
	}, [activeScopeStartedAt, currentTime, isActiveMonitoring]);

	const readActiveStudents = useCallback((): ActiveStudentEntry[] => {
		try {
			const raw = window.localStorage.getItem(ACTIVE_STUDENTS_STORAGE_KEY);
			const parsed = raw ? JSON.parse(raw) : MOCK_ACTIVE_STUDENTS;
			if (!Array.isArray(parsed) || parsed.length === 0) return MOCK_ACTIVE_STUDENTS;
			return parsed
				.filter((x) => x && typeof x === "object")
				.map((x) => x as ActiveStudentEntry)
					.filter(
						(x) =>
							typeof x.id === "string" &&
							typeof x.fullName === "string" &&
							typeof x.email === "string" &&
							typeof x.startedAt === "number" &&
							(x.status === "active" ||
								x.status === "disconnected" ||
								x.status === "submitted"),
					);
		} catch {
			return MOCK_ACTIVE_STUDENTS;
		}
	}, []);

	const startMonitoring = useCallback(() => {
		if (!activeMonitoringScope) return;
		const startedAt = Date.now();
		setCurrentTime(startedAt);
		const currentStore = readExamMonitoringStateMap();
		writeExamMonitoringStateMap({
			...currentStore,
			[activeMonitoringScope]: {
				isStarted: true,
				startedAt,
			},
		});
		setMonitorStartedAtByScope((current) => ({
			...current,
			[activeMonitoringScope]: startedAt,
		}));
		setMonitoringByScope((current) => ({
			...current,
			[activeMonitoringScope]: true,
		}));
	}, [activeMonitoringScope]);

	useEffect(() => {
		if (
			!activeMonitoringScope ||
			!isActiveMonitoring ||
			!activeScopeStartedAt ||
			!activeMonitorExam
		) {
			return;
		}

		const totalDurationMs = activeMonitorExam.durationInMinutes * 60 * 1000;
		const ticker = window.setInterval(() => {
			const now = Date.now();
			setCurrentTime(now);

			if (now - activeScopeStartedAt >= totalDurationMs) {
				const currentStore = readExamMonitoringStateMap();
				writeExamMonitoringStateMap({
					...currentStore,
					[activeMonitoringScope]: {
						isStarted: false,
						startedAt: activeScopeStartedAt,
					},
				});
				setMonitoringByScope((current) => ({
					...current,
					[activeMonitoringScope]: false,
				}));
				window.clearInterval(ticker);
			}
		}, 1000);

		return () => {
			window.clearInterval(ticker);
		};
	}, [
		activeMonitorExam,
		activeMonitoringScope,
		activeScopeStartedAt,
		isActiveMonitoring,
	]);

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

		const sync = () => {
			const next = readActiveStudents();
			setActiveStudents(next);
		};

		syncSavedExams();
		sync();

		const onStorage = (e: StorageEvent) => {
			if (e.key === ACTIVE_STUDENTS_STORAGE_KEY) sync();
			if (e.key === SAVED_EXAMS_STORAGE_KEY) syncSavedExams();
		};
		window.addEventListener("storage", onStorage);

		// Same-tab updates won't fire "storage", so poll lightly.
		const interval = window.setInterval(sync, 1000);

		return () => {
			window.removeEventListener("storage", onStorage);
			window.clearInterval(interval);
		};
	}, [readActiveStudents]);

	return (
		<section className="w-full overflow-x-hidden px-6 py-8 sm:px-10 sm:py-10">
			<div className="mx-auto max-w-6xl space-y-10">
        {!activeMonitorExam ? (
          <MonitorExamsSection
            activeExamId={null}
            exams={monitorExamCards}
            onClearSelection={() => setSelectedExamId(null)}
            onOpenExam={(exam) => {
              setSelectedExamId(exam.id);
            }}
            totalExamCount={monitorExamCards.length}
          />
        ) : null}

				{activeMonitorExam ? (
					<MonitorDetailSection
						activeClassId={activeClassId}
						activeClassLabel={activeClassLabel}
						activeExam={activeMonitorExam}
						activeStudents={filteredActiveStudents}
						isMonitoring={isActiveMonitoring}
						monitoringElapsedSeconds={monitoringElapsedSeconds}
						monitorTotalStudents={monitorTotalStudents}
						remainingDurationLabel={remainingDurationLabel}
            onBackToList={() => setSelectedExamId(null)}
						onStartMonitoring={startMonitoring}
					/>
				) : null}
			</div>
		</section>
	);
}
