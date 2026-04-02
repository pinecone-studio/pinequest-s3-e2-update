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
