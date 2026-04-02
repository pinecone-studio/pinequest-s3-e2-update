export type ActiveStudentEntry = {
	id: string;
	fullName: string;
	email: string;
	grade: string;
	school: string;
	startedAt: number;
	status: "active" | "disconnected" | "submitted";
};

export type MonitorExamCardItem = {
	id: string;
	title: string;
	grade: string;
	subject: string;
	topic: string;
	status: "ongoing" | "completed" | "approval_pending" | "draft";
	durationInMinutes: number;
	questionCount: number;
	totalPoints: number;
	classLabel: string;
	classLabels: string[];
	classOptions: Array<{ id: string; label: string }>;
	savedAtLabel: string;
	participantCount: number;
	autoScoredCount: number;
	finalizedCount: number;
	pendingManualCount: number;
	manualQuestionCount: number;
	gradingStatus: "manual_pending" | "finalized";
};

function hashSeed(value: string) {
	let hash = 0;
	for (let i = 0; i < value.length; i += 1) {
		hash = (hash * 31 + value.charCodeAt(i)) % 10007;
	}
	return hash;
}

export function buildMonitorGradingSummary({
	participantCount,
	openQuestionCount,
	seedSource,
}: {
	participantCount: number;
	openQuestionCount: number;
	seedSource: string;
}) {
	const safeParticipantCount = Math.max(0, participantCount);
	const safeOpenQuestionCount = Math.max(0, openQuestionCount);

	if (safeOpenQuestionCount === 0) {
		return {
			participantCount: safeParticipantCount,
			autoScoredCount: safeParticipantCount,
			finalizedCount: safeParticipantCount,
			pendingManualCount: 0,
			manualQuestionCount: 0,
			gradingStatus: "finalized" as const,
		};
	}

	const pendingManualCount = Math.min(
		safeParticipantCount,
		Math.max(1, hashSeed(seedSource) % Math.max(2, safeParticipantCount)),
	);
	const finalizedCount = Math.max(0, safeParticipantCount - pendingManualCount);

	return {
		participantCount: safeParticipantCount,
		autoScoredCount: safeParticipantCount,
		finalizedCount,
		pendingManualCount,
		manualQuestionCount: safeOpenQuestionCount,
		gradingStatus: pendingManualCount > 0 ? ("manual_pending" as const) : ("finalized" as const),
	};
}

export const MOCK_ACTIVE_STUDENTS: ActiveStudentEntry[] = [
	{ id: "s-10a-01", fullName: "А. Тэмүүлэн", email: "temuulen10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 2, status: "active" },
	{ id: "s-10a-02", fullName: "Б. Номин", email: "nomin10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 3, status: "active" },
	{ id: "s-10a-03", fullName: "В. Анударь", email: "anudari10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 4, status: "active" },
	{ id: "s-10a-04", fullName: "Г. Билгүүн", email: "bilguun10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 5, status: "active" },
	{ id: "s-10a-05", fullName: "Д. Энэрэл", email: "enerel10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 6, status: "active" },
	{ id: "s-10a-06", fullName: "Е. Марал", email: "maral10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 7, status: "active" },
	{ id: "s-10a-07", fullName: "Ж. Төгөлдөр", email: "tuguldur10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 8, status: "active" },
	{ id: "s-10a-08", fullName: "З. Хүслэн", email: "huslen10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 9, status: "active" },
	{ id: "s-10a-09", fullName: "И. Содон", email: "sodon10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 10, status: "active" },
	{ id: "s-10a-10", fullName: "Й. Мөнхжин", email: "munkhjin10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 11, status: "active" },
	{ id: "s-10a-11", fullName: "К. Нандин", email: "nandin10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 12, status: "disconnected" },
	{ id: "s-10a-12", fullName: "Л. Тэнүүн", email: "tenuun10a@example.com", grade: "10A", school: "UPDATE", startedAt: Date.now() - 1000 * 60 * 13, status: "disconnected" },
];

export function monitorStatusText(
	status: MonitorExamCardItem["status"],
	classLabels: string[] = [],
	selectedClassLabel?: string,
) {
	if (status === "ongoing") {
		if (selectedClassLabel) {
			return `${selectedClassLabel}-д илгээгдсэн`;
		}
		if (classLabels.length === 1) {
			return `${classLabels[0]}-д илгээгдсэн`;
		}
		if (classLabels.length > 1) {
			return `${classLabels.length} ангид илгээгдсэн`;
		}
		return "Илгээгдсэн";
	}
	if (status === "completed") return "Дууссан";
	if (status === "approval_pending") return "Зөвшөөрөл хүлээж байна";
	return "Илгээхэд бэлэн";
}

export function formatRemainingDuration(totalMs: number) {
	const safeMs = Math.max(0, totalMs);
	const totalSeconds = Math.floor(safeMs / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
