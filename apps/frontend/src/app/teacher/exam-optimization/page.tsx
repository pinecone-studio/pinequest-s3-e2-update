/** @format */

"use client";

import { useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	createExamMonitoringScopeKey,
	readExamMonitoringStateMap,
	writeExamMonitoringStateMap,
} from "@/app/lib/exam-monitoring-store";
import {
	GET_ALL_SUBJECTS,
	GET_CLASS_BY_TEACHER_AND_SCHOOL_ID,
	GET_EXAM_BY_SCHOOL_ID,
	GET_STUDENT_BY_CLASS_ID,
} from "@/graphql/typeDefs/queries";
import { useTeacherDb } from "../_components/teacher-db-context";
import { mapGqlTeacherClasses } from "../_lib/teacher-class-options";
import { MonitorDetailSection } from "./_components/monitor-detail-section";
import { MonitorExamsSection } from "./_components/monitor-exams-section";
import {
	mapBackendExamsToMonitorCards,
	formatMonitorSavedAt,
	type BackendExamMonitorRow,
} from "./_lib/backend-exams-to-monitor-cards";
import {
	formatRemainingDuration,
	type ActiveStudentEntry,
	type MonitorExamCardItem,
} from "./_lib/monitoring";
import { SAVED_EXAMS_STORAGE_KEY } from "../exam/_lib/constants";
import { normalizeSavedExamRecord } from "../exam/_lib/utils";
import type { SavedExamRecord } from "../exam/_lib/types";

type GetAllSubjectResponse = {
	getAllSubject: { id: string; name: string }[];
};

type GetExamBySchoolIdResponse = {
	getExamBySchoolId: BackendExamMonitorRow[];
};

type ClassesByTeacherResponse = {
	getClassByTeacherAndSchoolId: Array<{ id: string; grade: number; section: string }>;
};

type StudentsByClassResponse = {
	getStudentByClassId: Array<{ id: string }>;
};

export default function ExamOptimizationPage() {
	const ACTIVE_STUDENTS_STORAGE_KEY = "pinequest.activeStudents.v1";
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const { teacher: dbTeacher } = useTeacherDb();
	const teacherId = dbTeacher?.id ?? "";
	const schoolId = dbTeacher?.schoolId ?? "";

	const { data: subjectsData } = useQuery<GetAllSubjectResponse>(GET_ALL_SUBJECTS);
	const { data: classesData } = useQuery<ClassesByTeacherResponse>(
		GET_CLASS_BY_TEACHER_AND_SCHOOL_ID,
		{
			variables: { input: { teacherId, schoolId } },
			skip: !teacherId || !schoolId,
			fetchPolicy: "cache-and-network",
		},
	);

	const apiClassOptions = useMemo(
		() => mapGqlTeacherClasses(classesData?.getClassByTeacherAndSchoolId ?? []),
		[classesData?.getClassByTeacherAndSchoolId],
	);

	const { data: examsData } = useQuery<GetExamBySchoolIdResponse>(
		GET_EXAM_BY_SCHOOL_ID,
		{
			variables: { schoolId },
			skip: !schoolId,
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
		() => apiClassOptions.map((k) => ({ id: k.id, label: k.name })),
		[apiClassOptions],
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
	const initialSelectedExamId = searchParams.get("examId");
	const [selectedExamId, setSelectedExamId] = useState<string | null>(
		initialSelectedExamId,
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

	const localStorageMonitorCards = useMemo<MonitorExamCardItem[]>(() => {
		if (savedExams.length === 0) return [];

		const firstSentExamId =
			savedExams.find((item) => (item.sentClassIds ?? []).length > 0)?.id ??
			null;
		const resolveClassLabel = (classId?: string) => {
			if (!classId) return "Анги оноогоогүй";
			return apiClassOptions.find((klass) => klass.id === classId)?.name ?? classId;
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
	}, [savedExams, apiClassOptions]);

	const monitorExamCards = useMemo<MonitorExamCardItem[]>(() => {
		const mergedCards = [...localStorageMonitorCards, ...apiMonitorCards];
		const seenIds = new Set<string>();

		return mergedCards.filter((card) => {
			if (seenIds.has(card.id)) return false;
			seenIds.add(card.id);
			return true;
		});
	}, [apiMonitorCards, localStorageMonitorCards]);

	useEffect(() => {
		if (!initialSelectedExamId) return;

		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.delete("examId");
		const nextUrl = nextParams.toString()
			? `${pathname}?${nextParams.toString()}`
			: pathname;

		router.replace(nextUrl, { scroll: false });
	}, [initialSelectedExamId, pathname, router, searchParams]);

	const effectiveSelectedExamId = selectedExamId;
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

	const { data: rosterCountData } = useQuery<StudentsByClassResponse>(
		GET_STUDENT_BY_CLASS_ID,
		{
			variables: { classId: activeClassId ?? "" },
			skip: !activeClassId,
			fetchPolicy: "cache-and-network",
		},
	);

	const rosterCount = rosterCountData?.getStudentByClassId?.length ?? 0;

	const monitorTotalStudents = useMemo(() => {
		if (!activeMonitorExam) return 0;
		return Math.max(rosterCount, filteredActiveStudents.length);
	}, [activeMonitorExam, rosterCount, filteredActiveStudents.length]);
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
			if (!raw) return [];
			const parsed = JSON.parse(raw) as unknown;
			if (!Array.isArray(parsed) || parsed.length === 0) return [];
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
			return [];
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
