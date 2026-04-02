/** @format */

"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { buildTeacherExamMonitorWsUrl } from "@/lib/exam-monitor-ws-url";
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
import {
	ADD_EXAM_ALLOWED_CLASSES,
	START_EXAM_MONITORING_FOR_CLASS,
} from "@/graphql/typeDefs/mutations";
import { useTeacherDb } from "../_components/teacher-db-context";
import { mapGqlTeacherClasses } from "../_lib/teacher-class-options";
import { MonitorDetailSection } from "./_components/monitor-detail-section";
import { MonitorExamsSection } from "./_components/monitor-exams-section";
import { MonitorGroupSelectionSection } from "./_components/monitor-group-selection-section";
import {
	mapBackendExamsToMonitorCards,
	type BackendExamMonitorRow,
} from "./_lib/backend-exams-to-monitor-cards";
import {
	formatRemainingDuration,
	type ActiveStudentEntry,
	type ExamStudentTelemetry,
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
	const { getToken } = useAuth();

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

	const { data: examsData, refetch: refetchSchoolExams } =
		useQuery<GetExamBySchoolIdResponse>(GET_EXAM_BY_SCHOOL_ID, {
			variables: { schoolId },
			skip: !schoolId,
			fetchPolicy: "cache-and-network",
		});

	const [startExamMonitoringMutation, { loading: startMonitoringLoading }] =
		useMutation<{
			startExamMonitoringForClass: { ok: boolean; startedAt: string };
		}>(START_EXAM_MONITORING_FOR_CLASS);

	const [addExamAllowedClassesMutation] = useMutation<{
		addExamAllowedClasses: boolean;
	}>(ADD_EXAM_ALLOWED_CLASSES);

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
		if (!schoolId) return [];
		return rows;
	}, [examsData?.getExamBySchoolId, schoolId]);

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
	const [grantingClassId, setGrantingClassId] = useState<string | null>(null);
	const [telemetryByStudentId, setTelemetryByStudentId] = useState<
		Record<string, ExamStudentTelemetry>
	>({});

	const monitorExamCards = useMemo(() => {
		if (!teacherExams.length) return [];
		return mapBackendExamsToMonitorCards(
			teacherExams,
			subjectNameById,
			teacherClassOptions,
		);
	}, [teacherExams, subjectNameById, teacherClassOptions]);

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
		? (selectedClassIdByExamId[activeMonitorExam.id] ?? null)
		: null;
	const activeClassLabel = activeMonitorExam
		? (activeMonitorExam.classOptions.find((item) => item.id === activeClassId)
				?.label ?? null)
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

	useEffect(() => {
		setTelemetryByStudentId({});
	}, [activeMonitorExam?.id, activeClassId]);

	useEffect(() => {
		if (!activeMonitorExam || !activeClassId || !isActiveMonitoring) {
			return;
		}

		const examId = activeMonitorExam.id;
		let cancelled = false;
		const wsRef: { current: WebSocket | null } = { current: null };

		void (async () => {
			const token = await getToken();
			if (cancelled || !token?.trim()) {
				// #region agent log
				fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Debug-Session-Id": "9f3746",
					},
					body: JSON.stringify({
						sessionId: "9f3746",
						runId: "pre-fix",
						hypothesisId: "H2",
						location: "exam-optimization/page.tsx:getToken",
						message: "teacher ws no clerk token",
						data: { cancelled, hasToken: Boolean(token?.trim()) },
						timestamp: Date.now(),
					}),
				}).catch(() => {});
				// #endregion
				return;
			}

			const url = buildTeacherExamMonitorWsUrl({
				examId,
				classId: activeClassId,
				clerkToken: token.trim(),
			});
			if (!url) {
				// #region agent log
				fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Debug-Session-Id": "9f3746",
					},
					body: JSON.stringify({
						sessionId: "9f3746",
						runId: "pre-fix",
						hypothesisId: "H1",
						location: "exam-optimization/page.tsx:buildUrl",
						message: "teacher ws url null",
						data: {},
						timestamp: Date.now(),
					}),
				}).catch(() => {});
				// #endregion
				return;
			}

			let safeHost = "";
			let safeProto = "";
			try {
				const u = new URL(url);
				safeHost = u.hostname;
				safeProto = u.protocol.replace(":", "");
			} catch {
				/* ignore */
			}
			// #region agent log
			fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Debug-Session-Id": "9f3746",
				},
				body: JSON.stringify({
					sessionId: "9f3746",
					runId: "pre-fix",
					hypothesisId: "H5",
					location: "exam-optimization/page.tsx:connect",
					message: "teacher WebSocket connect attempt",
					data: { wsHost: safeHost, wsProto: safeProto },
					timestamp: Date.now(),
				}),
			}).catch(() => {});
			// #endregion

			try {
				wsRef.current = new WebSocket(url);
			} catch {
				return;
			}

			const socket = wsRef.current;
			if (!socket || cancelled) return;

			socket.onopen = () => {
				// #region agent log
				fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Debug-Session-Id": "9f3746",
					},
					body: JSON.stringify({
						sessionId: "9f3746",
						runId: "pre-fix",
						hypothesisId: "H4",
						location: "exam-optimization/page.tsx:onopen",
						message: "teacher WebSocket open",
						data: { wsHost: safeHost },
						timestamp: Date.now(),
					}),
				}).catch(() => {});
				// #endregion
			};

			socket.onclose = (ev) => {
				// #region agent log
				fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Debug-Session-Id": "9f3746",
					},
					body: JSON.stringify({
						sessionId: "9f3746",
						runId: "pre-fix",
						hypothesisId: "H3",
						location: "exam-optimization/page.tsx:onclose",
						message: "teacher WebSocket close",
						data: {
							code: ev.code,
							wasClean: ev.wasClean,
							reasonLen: ev.reason?.length ?? 0,
						},
						timestamp: Date.now(),
					}),
				}).catch(() => {});
				// #endregion
			};

			socket.onmessage = (ev) => {
				try {
					const data = JSON.parse(String(ev.data)) as {
						v?: number;
						studentId?: string;
						type?: string;
						hidden?: boolean;
						kind?: string;
						at?: number;
					};
					if (data.v !== 1 || typeof data.studentId !== "string") return;
					const sid = data.studentId;
					const at =
						typeof data.at === "number" && Number.isFinite(data.at)
							? data.at
							: Date.now();
					setTelemetryByStudentId((prev) => {
						const cur: ExamStudentTelemetry = {
							...(prev[sid] ?? { updatedAt: 0 }),
						};
						cur.updatedAt = at;
						if (data.type === "tab") {
							cur.tabHidden = Boolean(data.hidden);
						}
						if (
							data.type === "face" &&
							(data.kind === "none" ||
								data.kind === "single" ||
								data.kind === "multiple")
						) {
							cur.faceKind = data.kind;
						}
						return { ...prev, [sid]: cur };
					});
				} catch {
					/* ignore */
				}
			};

			socket.onerror = () => {
				// #region agent log
				fetch("http://127.0.0.1:7515/ingest/f9ddb3fc-5255-46a4-b9ef-406f0ac5ea3d", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Debug-Session-Id": "9f3746",
					},
					body: JSON.stringify({
						sessionId: "9f3746",
						runId: "pre-fix",
						hypothesisId: "H4",
						location: "exam-optimization/page.tsx:onerror",
						message: "teacher WebSocket error event",
						data: { wsHost: safeHost },
						timestamp: Date.now(),
					}),
				}).catch(() => {});
				// #endregion
				/* noop */
			};
		})();

		return () => {
			cancelled = true;
			wsRef.current?.close();
			wsRef.current = null;
		};
	}, [activeMonitorExam, activeClassId, isActiveMonitoring, getToken]);

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
			if (!activeMonitorExam) return;
			setSelectedClassIdByExamId((prev) => ({
				...prev,
				[activeMonitorExam.id]: classId,
			}));
		},
		[activeMonitorExam],
	);

	const grantAccessForClass = useCallback(
		async (classId: string) => {
			if (!activeMonitorExam) return;
			setGrantingClassId(classId);
			try {
				const result = await addExamAllowedClassesMutation({
					variables: {
						examId: activeMonitorExam.id,
						classIds: [classId],
					},
				});
				if (result.data?.addExamAllowedClasses !== true) {
					toast.error("Эрх нээж чадсангүй.");
					return;
				}
				await refetchSchoolExams();
				toast.success("Ангийн эрх нээгдлээ.");
				onSelectClass(classId);
			} catch {
				toast.error("Эрх нээхэд алдаа гарлаа.");
			} finally {
				setGrantingClassId(null);
			}
		},
		[
			activeMonitorExam,
			addExamAllowedClassesMutation,
			onSelectClass,
			refetchSchoolExams,
		],
	);

	const startMonitoring = useCallback(async () => {
		if (!activeMonitoringScope || !activeMonitorExam || !activeClassId) return;
		try {
			const result = await startExamMonitoringMutation({
				variables: {
					examId: activeMonitorExam.id,
					classId: activeClassId,
				},
			});
			const payload = result.data?.startExamMonitoringForClass;
			if (!payload?.ok) {
				toast.error("Серверт хяналт эхлүүлж чадсангүй.");
				return;
			}
			const startedAtMs = Date.parse(payload.startedAt);
			const startedAt = Number.isFinite(startedAtMs)
				? startedAtMs
				: Date.now();
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
			setTelemetryByStudentId({});
			void refetchSchoolExams();
			toast.success("Хяналт эхэллээ.");
		} catch {
			toast.error("Хяналт эхлүүлэхэд алдаа гарлаа.");
		}
	}, [
		activeClassId,
		activeMonitorExam,
		activeMonitoringScope,
		refetchSchoolExams,
		startExamMonitoringMutation,
	]);

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

				{activeMonitorExam && !activeClassId ? (
					<MonitorGroupSelectionSection
						exam={activeMonitorExam}
						grantingClassId={grantingClassId}
						onBack={() => setSelectedExamId(null)}
						onGrantAccess={grantAccessForClass}
						onOpenGroup={onSelectClass}
					/>
				) : null}

				{activeMonitorExam && activeClassId ? (
					<MonitorDetailSection
						activeClassId={activeClassId}
						activeClassLabel={activeClassLabel}
						activeExam={activeMonitorExam}
						activeStudents={rosterStudents}
						telemetryByStudentId={telemetryByStudentId}
						hasAccessForSelectedClass={activeMonitorExam.allowedClassIds.includes(
							activeClassId,
						)}
						isMonitoring={isActiveMonitoring}
						monitorTotalStudents={monitorTotalStudents}
						remainingDurationLabel={remainingDurationLabel}
						onBackToList={() =>
							setSelectedClassIdByExamId((prev) => {
								if (!activeMonitorExam) return prev;
								const next = { ...prev };
								delete next[activeMonitorExam.id];
								return next;
							})
						}
						onSelectClass={onSelectClass}
						onStartMonitoring={startMonitoring}
						startMonitoringLoading={startMonitoringLoading}
					/>
				) : null}
			</div>
		</section>
	);
}
