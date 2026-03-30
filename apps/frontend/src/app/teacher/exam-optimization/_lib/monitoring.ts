export type ActiveStudentEntry = {
	id: string;
	fullName: string;
	email: string;
	grade: string;
	school: string;
	startedAt: number;
	status: "active" | "disconnected";
};

export type MonitorExamCardItem = {
	id: string;
	title: string;
	grade: string;
	subject: string;
	topic: string;
	status: "ongoing" | "completed" | "approval_pending" | "draft";
	questionCount: number;
	totalPoints: number;
	classLabel: string;
	savedAtLabel: string;
};

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

export function monitorStatusText(status: MonitorExamCardItem["status"]) {
	if (status === "ongoing") return "Явагдаж байна";
	if (status === "completed") return "Дууссан";
	if (status === "approval_pending") return "Зөвшөөрөл хүлээж байна";
	return "Илгээхэд бэлэн";
}
