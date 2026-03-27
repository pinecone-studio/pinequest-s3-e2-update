/** @format */

"use client";

import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { AlertTriangle, Camera, Users } from "lucide-react";

type ActiveStudentEntry = {
	id: string;
	fullName: string;
	email: string;
	grade: string;
	school: string;
	startedAt: number;
	status: "active" | "disconnected";
};

const MOCK_ACTIVE_STUDENTS: ActiveStudentEntry[] = [
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

export default function ExamOptimizationPage() {
	const ACTIVE_STUDENTS_STORAGE_KEY = "pinequest.activeStudents.v1";

	const MONITOR_TOTAL_STUDENTS = 12;
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
		const sync = () => {
			const next = readActiveStudents();
			setActiveStudents(next);
			setLastUpdatedAt(Date.now());
		};

		sync();

		const onStorage = (e: StorageEvent) => {
			if (e.key !== ACTIVE_STUDENTS_STORAGE_KEY) return;
			sync();
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
				<section className="rounded-2xl border border-[#d9dee8] bg-white px-6 py-6 shadow-sm">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-5 font-extrabold text-[#1f2a44]">
								Бодит цагийн жагсаалт
							</h2>
							<p className="mt-2 text-3 text-[#66789f]">
								{isMonitoring
									? "Шалгалт/хариултын статусыг бодит цагаар шинэчилж байна."
									: "Хяналтыг эхлүүлэхийн тулд дээрх товчийг дарна уу."}
							</p>
							<p className="mt-2 text-3 text-[#66789f]">
								Одоо явагдаж буй анги:{" "}
								<span className="font-bold text-[#1f2a44]">
									{currentClassName}
								</span>
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							{!isMonitoring ? (
								<button
									type="button"
									onClick={startMonitoring}
									className="rounded-xl bg-[#2563eb] px-4 py-2.5 text-4 font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-45"
								>
									Хяналт эхлүүлэх
								</button>
							) : (
								<button
									type="button"
									onClick={stopMonitoring}
									className="rounded-xl border border-[#d9dee8] bg-white px-4 py-2.5 text-4 font-semibold text-[#2f3c59] transition hover:bg-[#f8fafc]"
								>
									Зогсоох
								</button>
							)}
						</div>
					</div>

					<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
						<StatCard
							tone="blue"
							title="Нийт сурагч"
							value={String(MONITOR_TOTAL_STUDENTS)}
							icon={<Users className="h-5 w-5" />}
						/>
							<StatCard
              tone="green"
              title="Идэвхтэй"
              value={String(activeCount)}
              icon={<span className="text-[#2f66b9]">●</span>}
							/>
						<StatCard
							tone="amber"
							title="Анхааруулах"
							value={"0"}
							icon={<AlertTriangle className="h-5 w-5" />}
						/>
							<StatCard
								tone="red"
								title="Салсан"
								value={String(disconnectedCount)}
								icon={<Camera className="h-5 w-5" />}
							/>
					</div>

					<div className="mt-6">
						<h3 className="text-4 font-extrabold text-[#1f2a44]">
							Сурагчдын жагсаалт
						</h3>

						<div className="mt-4 space-y-4">
							{activeStudents.length ? (
								<div className="overflow-hidden rounded-2xl border border-[#d9dee8] bg-white">
									<div className="grid grid-cols-[minmax(0,1fr)_140px] items-center border-b border-[#e7edf5] px-6 py-4 text-[#66789f]">
										<p className="text-4 font-bold">№ / Нэр</p>
										<p className="text-right text-4 font-bold">Төлөв</p>
									</div>
									{[...activeStudents]
										.sort((a, b) => b.startedAt - a.startedAt)
										.map((student, index) => (
											<ActiveStudentRow
												index={index}
												key={student.id}
												student={student}
											/>
										))}
								</div>
							) : (
								<div className="rounded-2xl border border-[#d9dee8] bg-[#f8fafc] px-5 py-4 text-4 text-[#66789f]">
									Одоогоор линкээр орсон сурагч алга байна.
								</div>
							)}
						</div>

						<p className="mt-4 text-3 text-[#66789f]">
							{lastUpdatedAt
								? `Сүүлд шинэчлэгдсэн: ${new Date(
										lastUpdatedAt,
									).toLocaleTimeString(undefined, {
										hour: "2-digit",
										minute: "2-digit",
									})}`
								: " "}
						</p>
					</div>
				</section>
			</div>
		</section>
	);
}
function StatCard({
	tone,
	title,
	value,
	icon,
}: {
	tone: "blue" | "green" | "amber" | "red";
	title: string;
	value: string;
	icon: ReactNode;
}) {
	const cfg = {
		blue: {
			bg: "bg-[#e6f2ff]",
			value: "text-[#0b78d1]",
			border: "border-[#cfe6ff]",
			iconWrap: "text-[#0b78d1]",
		},
      green: {
        bg: "bg-[#edf5ff]",
        value: "text-[#2f66b9]",
        border: "border-[#cfe0fb]",
        iconWrap: "text-[#2f66b9]",
		},
		amber: {
			bg: "bg-[#fff4e5]",
			value: "text-[#f59e0b]",
			border: "border-[#ffe5b8]",
			iconWrap: "text-[#a16207]",
		},
		red: {
			bg: "bg-[#ffe9ec]",
			value: "text-[#f15f6a]",
			border: "border-[#ffd3d9]",
			iconWrap: "text-[#d61f3f]",
		},
	}[tone];

	return (
		<div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}>
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-3 font-semibold text-[#66789f]">{title}</p>
					<p className={`mt-2 text-6 font-extrabold ${cfg.value}`}>{value}</p>
				</div>
				<div className={`mt-1 ${cfg.iconWrap}`}>{icon}</div>
			</div>
		</div>
	);
}

function ActiveStudentRow({
	index,
	student,
}: {
	index: number;
		student: {
			fullName: string;
			email: string;
			grade: string;
			school: string;
			startedAt: number;
			status: "active" | "disconnected";
		};
	}) {
	return (
		<div
			className={`grid grid-cols-[minmax(0,1fr)_140px] items-center border-b border-[#eef2f7] px-6 py-5 last:border-b-0 ${
				index % 2 === 1 ? "bg-[#f8fbff]" : "bg-white"
			}`}
		>
			<div className="flex min-w-0 items-start gap-4">
				<div className="w-12 shrink-0 text-5 font-extrabold text-[#66789f]">
					{index + 1}.
				</div>
				<div className="min-w-0">
					<p className="truncate text-5 font-extrabold text-[#1f2a44]">
						{student.fullName}
					</p>
					<p className="mt-2 truncate text-4 text-[#7c8fb1]">
						{student.email}
					</p>
				</div>
			</div>

			<div
				className={`text-right text-4 font-semibold ${
					student.status === "active" ? "text-[#4f9dff]" : "text-[#f15f6a]"
				}`}
			>
				{student.status === "active" ? "Идэвхтэй" : "Салсан"}
			</div>
		</div>
	);
}
