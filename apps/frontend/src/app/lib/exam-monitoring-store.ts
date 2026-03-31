"use client";

export const EXAM_MONITORING_STORAGE_KEY = "pinequest.examMonitoring.v1";

export type ExamMonitoringScopeState = {
	isStarted: boolean;
	startedAt: number | null;
};

export type ExamMonitoringScopeStateMap = Record<
	string,
	ExamMonitoringScopeState
>;

export function createExamMonitoringScopeKey(examId: string, classId: string) {
	return `${examId}:${classId}`;
}

export function readExamMonitoringStateMap(): ExamMonitoringScopeStateMap {
	if (typeof window === "undefined") return {};

	try {
		const raw = window.localStorage.getItem(EXAM_MONITORING_STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : {};
		if (!parsed || typeof parsed !== "object") return {};

		return Object.fromEntries(
			Object.entries(parsed).map(([scope, value]) => {
				const entry =
					value && typeof value === "object"
						? (value as Partial<ExamMonitoringScopeState>)
						: null;

				return [
					scope,
					{
						isStarted: Boolean(entry?.isStarted),
						startedAt:
							typeof entry?.startedAt === "number" ? entry.startedAt : null,
					},
				];
			}),
		);
	} catch {
		return {};
	}
}

export function writeExamMonitoringStateMap(
	nextState: ExamMonitoringScopeStateMap,
) {
	if (typeof window === "undefined") return;

	try {
		window.localStorage.setItem(
			EXAM_MONITORING_STORAGE_KEY,
			JSON.stringify(nextState),
		);
	} catch {
		// ignore storage errors in demo
	}
}
