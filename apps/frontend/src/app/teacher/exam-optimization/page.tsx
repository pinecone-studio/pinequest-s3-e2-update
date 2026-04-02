/** @format */

"use client";

import { useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
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
	type BackendExamMonitorRow,
} from "./_lib/backend-exams-to-monitor-cards";
import {
	formatRemainingDuration,
	type ActiveStudentEntry,
} from "./_lib/monitoring";

type GetAllSubjectResponse = {
	getAllSubject: { id: string; name: string }[];
};

type GetExamBySchoolIdResponse = {
	getExamBySchoolId: BackendExamMonitorRow[];
};

type ClassesByTeacherResponse = {
	getClassByTeacherAndSchoolId: Array<{
		id: string;
		grade: number;
		section: string;
	}>;
};

type StudentsByClassResponse = {
	getStudentByClassId: Array<{
		id: string;
		firstName: string;
		lastName: string;
		email: string | null;
	}>;
};

export default function ExamOptimizationPage() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const { teacher: dbTeacher } = useTeacherDb();
	const teacherId = dbTeacher?.id ?? "";
	const schoolId = dbTeacher?.schoolId ?? "";

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

	const teacherClassOptions = useMemo(
		() => apiClassOptions.map((k) => ({ id: k.id, label: k.name })),
		[apiClassOptions],
	);

	const teacherExams = useMemo(() => {
		const rows = examsData?.getExamBySchoolId ?? [];
		if (!teacherId) return [];
		return rows.filter((row) => row.teacherId === teacherId);
	}, [examsData?.getExamBySchoolId, teacherId]);

	const monitorExamCards = useMemo(() => {
		if (!teacherExams.length) return [];
		return mapBackendExamsToMonitorCards(
			teacherExams,
			subjectNameById,
			teacherClassOptions,
		);
	}, [teacherExams, subjectNameById, teacherClassOptions]);

	const initialSelectedExamId = searchParams.get("examId");
	const [selectedExamId, setSelectedExamId] = useState<string | null>(
		initialSelectedExamId,
	);
	const [selectedClassIdByExamId, setSelectedClassIdByExamId] = useState<
		Record<string, string>
	>({});
	const [monitoringByScope, setMonitoringByScope] = useState<
		Record<string, boolean>
	>(() => {
		const initialMonitoringState = readExamMonitoringStateMap();
		return Object.fromEntries(
			Object.entries(initialMonitoringState).map(([scope, value]) => [
				scope,
				Boolean(value.isStarted),
			]),
		);
	});
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
	const [currentTime, setCurrentTime] = useState(() => Date.now());

	const showToast = useCallback(() => {
		toast.success("Мэдэгдэл харагдлаа.");
	}, []);

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
	const resolvedActiveMonitorExam = useMemo(() => {
		if (!effectiveSelectedExamId) return null;
		return (
			monitorExamCards.find((item) => item.id === effectiveSelectedExamId) ??
			null
		);
	}, [effectiveSelectedExamId, monitorExamCards]);

	// Conflict-ийн дараах refactor: доорх logic-д `activeMonitorExam` нэрээр ашиглаж байгаа тул
	// resolved value-гээ alias-лаад явна.
	const activeMonitorExam = resolvedActiveMonitorExam;

	const activeClassId = activeMonitorExam
		? (selectedClassIdByExamId[activeMonitorExam.id] ??
			activeMonitorExam.classOptions[0]?.id ??
			null)
		: null;
	const activeClassLabel = activeMonitorExam
		? (activeMonitorExam.classOptions.find((item) => item.id === activeClassId)
				?.label ??
			activeMonitorExam.classOptions[0]?.label ??
			null)
		: null;
	const activeMonitoringScope =
		activeMonitorExam && activeClassId
			? createExamMonitoringScopeKey(activeMonitorExam.id, activeClassId)
			: null;
	const isActiveMonitoring = activeMonitoringScope
		? Boolean(monitoringByScope[activeMonitoringScope])
		: false;
	const activeScopeStartedAt = activeMonitoringScope
		? (monitorStartedAtByScope[activeMonitoringScope] ?? null)
		: null;

	const { data: rosterCountData } = useQuery<StudentsByClassResponse>(
		GET_STUDENT_BY_CLASS_ID,
		{
			variables: { classId: activeClassId ?? "" },
			skip: !activeClassId,
			fetchPolicy: "cache-and-network",
		},
	);

	const rosterStudents = useMemo((): ActiveStudentEntry[] => {
		const list = rosterCountData?.getStudentByClassId ?? [];
		const gradeLabel = activeClassLabel ?? "";
		return list.map((s) => ({
			id: s.id,
			fullName: `${s.firstName} ${s.lastName}`.trim() || s.id,
			email: s.email ?? "",
			grade: gradeLabel,
			school: "",
			// Render үед `Date.now()` дуудах нь React-ийн purity rule-ийг зөрчдөг.
			// Monitoring эхэлсэн цаг байхгүй бол 0-г тавина.
			startedAt: activeScopeStartedAt ?? 0,
			status: "active",
		}));
	}, [
		rosterCountData?.getStudentByClassId,
		activeClassLabel,
		activeScopeStartedAt,
	]);

	const rosterCount = rosterStudents.length;

	const monitorTotalStudents = useMemo(() => {
		if (!activeMonitorExam) return 0;
		return rosterCount;
	}, [activeMonitorExam, rosterCount]);

	const remainingDurationMs = useMemo(() => {
		if (!activeMonitorExam) return 0;
		const totalDurationMs = activeMonitorExam.durationInMinutes * 60 * 1000;
		if (!isActiveMonitoring || !activeScopeStartedAt) return totalDurationMs;

		return Math.max(0, totalDurationMs - (currentTime - activeScopeStartedAt));
	}, [
		activeMonitorExam,
		activeScopeStartedAt,
		currentTime,
		isActiveMonitoring,
	]);
	const remainingDurationLabel = useMemo(
		() => formatRemainingDuration(remainingDurationMs),
		[remainingDurationMs],
	);

	const onSelectClass = useCallback(
		(classId: string) => {
			setSelectedClassIdByExamId((prev) => {
				if (!selectedExamId) return prev;
				return { ...prev, [selectedExamId]: classId };
			});
		},
		[selectedExamId],
	);

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

	return (
		<section className="w-full overflow-x-hidden px-6 py-8 sm:px-10 sm:py-10">
			<div className="mx-auto max-w-6xl space-y-10">
				<div className="flex justify-end">
					<button
						type="button"
						onClick={showToast}
						className="rounded-full border border-[#d7e2f1] bg-white px-4 py-2 text-3 font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
					>
						Мэдэгдэл харуулах
					</button>
				</div>

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
						activeStudents={rosterStudents}
						isMonitoring={isActiveMonitoring}
						monitorTotalStudents={monitorTotalStudents}
						remainingDurationLabel={remainingDurationLabel}
						onBackToList={() => setSelectedExamId(null)}
						onSelectClass={onSelectClass}
						onStartMonitoring={startMonitoring}
					/>
				) : null}
			</div>
		</section>
	);
}
