/** @format */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MonitorDetailSection } from "./_components/monitor-detail-section";
import { MonitorExamsSection } from "./_components/monitor-exams-section";
import { MOCK_ACTIVE_STUDENTS, type ActiveStudentEntry, type MonitorExamCardItem } from "./_lib/monitoring";
import { teacherClasses } from "../exam/_lib/class-data";
import { SAVED_EXAMS_STORAGE_KEY } from "../exam/_lib/constants";
import { formatSavedDate, normalizeSavedExamRecord } from "../exam/_lib/utils";
import type { SavedExamRecord } from "../exam/_lib/types";

export default function ExamOptimizationPage() {
	const ACTIVE_STUDENTS_STORAGE_KEY = "pinequest.activeStudents.v1";

	const [savedExams, setSavedExams] = useState<SavedExamRecord[]>([]);
	const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
	const [isMonitoring, setIsMonitoring] = useState(false);
	const [activeStudents, setActiveStudents] = useState<ActiveStudentEntry[]>(
		[],
	);
	const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
	const activeCount = useMemo(
		() => activeStudents.filter((student) => student.status === "active").length,
		[activeStudents],
	);
	const disconnectedCount = useMemo(
		() =>
			activeStudents.filter((student) => student.status === "disconnected")
				.length,
		[activeStudents],
	);

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

	const monitorExamCards = useMemo<MonitorExamCardItem[]>(() => {
		if (savedExams.length === 0) {
			return [
				{
					id: "monitor-mock-1",
					title: "10-р ангийн математикийн сорил",
					grade: "10-р анги",
					subject: "Математик",
					topic: "Квадрат функц",
					status: "ongoing",
					questionCount: 12,
					totalPoints: 24,
					classLabel: currentClassName,
					savedAtLabel: "Одоо явагдаж байна",
				},
				{
					id: "monitor-mock-2",
					title: "9-р ангийн логикийн шалгалт",
					grade: "9-р анги",
					subject: "Математик",
					topic: "Логарифм",
					status: "completed",
					questionCount: 10,
					totalPoints: 20,
					classLabel: "9B",
					savedAtLabel: "Өнөөдөр дууссан",
				},
			];
		}

		const firstSentExamId =
			savedExams.find((item) => (item.sentClassIds ?? []).length > 0)?.id ?? null;
		const resolveClassLabel = (classId?: string) => {
			if (!classId) return "Анги оноогоогүй";
			return teacherClasses.find((klass) => klass.id === classId)?.name ?? classId;
		};

		return savedExams.map((exam) => ({
			id: exam.id,
			title: exam.title,
			grade: exam.grade,
			subject: exam.subject,
			topic: exam.topic,
			status:
				exam.approvalStatus === "pending"
					? "approval_pending"
					: (exam.sentClassIds ?? []).length === 0
						? "draft"
						: exam.id === firstSentExamId
							? "ongoing"
							: "completed",
			questionCount: exam.questionCount,
			totalPoints: exam.totalPoints,
			classLabel:
				exam.id === firstSentExamId
					? currentClassName
					: resolveClassLabel(exam.sentClassIds?.[0]),
			savedAtLabel: formatSavedDate(exam.savedAt),
		}));
	}, [currentClassName, savedExams]);

	const activeMonitorExam = useMemo(() => {
		const fallbackId =
			selectedExamId ??
			monitorExamCards.find((item) => item.status === "ongoing")?.id ??
			monitorExamCards[0]?.id ??
			null;
		return monitorExamCards.find((item) => item.id === fallbackId) ?? null;
	}, [monitorExamCards, selectedExamId]);

	const monitorTotalStudents = useMemo(() => {
		if (activeMonitorExam?.status === "ongoing") return activeStudents.length;
		if (!activeMonitorExam) return 0;
		return 12;
	}, [activeMonitorExam, activeStudents.length]);

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
							(x.status === "active" || x.status === "disconnected"),
					);
		} catch {
			return MOCK_ACTIVE_STUDENTS;
		}
	}, []);

	const startMonitoring = useCallback(() => {
		setIsMonitoring(true);
		setLastUpdatedAt(Date.now());
	}, []);

	const stopMonitoring = useCallback(() => {
		setIsMonitoring(false);
		setLastUpdatedAt(Date.now());
	}, []);

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
			setLastUpdatedAt(Date.now());
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
		<section className="px-6 py-8 sm:px-10 sm:py-10">
			<div className="mx-auto max-w-6xl space-y-10">
				<MonitorExamsSection
					activeExamId={activeMonitorExam?.id ?? null}
					exams={monitorExamCards}
					onOpenExam={(exam) => {
						setSelectedExamId(exam.id);
						if (exam.status === "ongoing") {
							setIsMonitoring(true);
							setLastUpdatedAt(Date.now());
						}
					}}
				/>

				<MonitorDetailSection
					activeCount={activeCount}
					activeExam={activeMonitorExam}
					activeStudents={activeStudents}
					disconnectedCount={disconnectedCount}
					isMonitoring={isMonitoring}
					lastUpdatedAt={lastUpdatedAt}
					monitorTotalStudents={monitorTotalStudents}
					onStartMonitoring={startMonitoring}
					onStopMonitoring={stopMonitoring}
				/>
			</div>
		</section>
	);
}
