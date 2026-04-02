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

export function buildMonitorGradingSummary({
	participantCount,
	openQuestionCount,
	seedSource,
}: {
	participantCount: number;
	openQuestionCount: number;
	seedSource: string;
}) {
	const normalizedParticipants = Math.max(0, participantCount);
	const manualQuestionCount = Math.max(0, openQuestionCount);

	if (normalizedParticipants === 0) {
		return {
			participantCount: 0,
			autoScoredCount: 0,
			finalizedCount: 0,
			pendingManualCount: 0,
			manualQuestionCount,
			gradingStatus: "manual_pending" as const,
		};
	}

	if (manualQuestionCount === 0) {
		return {
			participantCount: normalizedParticipants,
			autoScoredCount: normalizedParticipants,
			finalizedCount: normalizedParticipants,
			pendingManualCount: 0,
			manualQuestionCount: 0,
			gradingStatus: "finalized" as const,
		};
	}

	const seedValue = Array.from(seedSource).reduce(
		(total, character) => total + character.charCodeAt(0),
		0,
	);
	const pendingManualCount = seedValue % (normalizedParticipants + 1);
	const finalizedCount = Math.max(0, normalizedParticipants - pendingManualCount);

	return {
		participantCount: normalizedParticipants,
		autoScoredCount: normalizedParticipants,
		finalizedCount,
		pendingManualCount,
		manualQuestionCount,
		gradingStatus: pendingManualCount > 0 ? ("manual_pending" as const) : ("finalized" as const),
	};
}

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
