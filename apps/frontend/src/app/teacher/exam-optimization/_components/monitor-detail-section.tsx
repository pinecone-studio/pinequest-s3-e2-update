"use client";

import { Camera, Clock3, Users } from "lucide-react";
import { ActiveStudentRow } from "./active-student-row";
import { MiniInfoCard } from "./mini-info-card";
import { StatCard } from "./stat-card";
import { monitorStatusText, type ActiveStudentEntry, type MonitorExamCardItem } from "../_lib/monitoring";

export function MonitorDetailSection({
	activeCount,
	activeClassId,
	activeClassLabel,
	activeExam,
	activeStudents,
	disconnectedCount,
	hasStartedBefore,
	isMonitoring,
	lastUpdatedAt,
	monitorTotalStudents,
	remainingDurationLabel,
	onSelectClass,
	onStartMonitoring,
	onStopMonitoring,
}: {
	activeCount: number;
	activeClassId: string | null;
	activeClassLabel: string | null;
	activeExam: MonitorExamCardItem | null;
	activeStudents: ActiveStudentEntry[];
	disconnectedCount: number;
	hasStartedBefore: boolean;
	isMonitoring: boolean;
	lastUpdatedAt: number | null;
	monitorTotalStudents: number;
	remainingDurationLabel: string;
	onSelectClass: (classId: string) => void;
	onStartMonitoring: () => void;
	onStopMonitoring: () => void;
}) {
	const isStarted = Boolean(activeExam) && isMonitoring;
	let canManageExam = false;
	if (activeExam) {
		canManageExam =
			activeExam.status !== "approval_pending" &&
			activeExam.status !== "draft" &&
			activeExam.classOptions.length > 0;
	}
	const startActionLabel =
		activeExam?.status === "completed" || hasStartedBefore
			? "Дахин эхлүүлэх"
			: "Шалгалт эхлүүлэх";

	return (
		<section className="rounded-2xl border border-[#d9dee8] bg-white px-6 py-6 shadow-sm">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					{activeExam ? (
						<p className="mb-2 inline-flex rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#2f66b9]">
							Сонгогдсон шалгалт
						</p>
					) : null}
					<h2 className="text-5 font-extrabold text-[#1f2a44]">
						{isStarted
							? "Явагдаж буй шалгалт"
							: "Шалгалтын төлөв"}
					</h2>
					<p className="mt-2 text-3 text-[#66789f]">
						{activeExam
							? `${activeExam.title} · ${activeExam.grade}`
							: "Харах шалгалтаа сонгоно уу."}
					</p>
					{activeExam ? (
						<p className="mt-2 text-3 text-[#66789f]">
							Төлөв:{" "}
							<span className="font-bold text-[#1f2a44]">
								{monitorStatusText(
									activeExam.status,
									activeExam.classLabels,
									activeClassLabel ?? undefined,
								)}
							</span>
						</p>
					) : null}
					{activeExam && activeExam.classOptions.length > 1 ? (
						<div className="mt-3 flex flex-wrap items-center gap-2">
							{activeExam.classOptions.map((classOption) => {
								const isSelected = classOption.id === activeClassId;
								return (
									<button
										key={classOption.id}
										type="button"
										onClick={() => onSelectClass(classOption.id)}
										className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
											isSelected
												? "bg-[#1f6feb] text-white"
												: "border border-[#d7e2f1] bg-white text-[#365077] hover:border-[#aac8f8] hover:text-[#1f6feb]"
										}`}
									>
										{classOption.label}
									</button>
								);
							})}
						</div>
					) : null}
				</div>

				<div className="flex flex-wrap items-center gap-3">
					{canManageExam ? (
						!isStarted ? (
							<button
								type="button"
								onClick={onStartMonitoring}
								className="rounded-xl bg-[#2563eb] px-4 py-2.5 text-4 font-semibold text-white transition hover:bg-[#1d4ed8]"
							>
								{startActionLabel}
							</button>
						) : (
							<button
								type="button"
								onClick={onStopMonitoring}
								className="rounded-xl border border-[#d9dee8] bg-white px-4 py-2.5 text-4 font-semibold text-[#2f3c59] transition hover:bg-[#f8fafc]"
							>
								Зогсоох
							</button>
						)
					) : null}
				</div>
			</div>

			<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
				<StatCard
					tone="blue"
					title="Нийт сурагч"
					value={String(monitorTotalStudents)}
					icon={<Users className="h-5 w-5" />}
				/>
				<StatCard
					tone="green"
					title="Идэвхтэй"
					value={
						isStarted
							? String(activeCount)
							: activeExam?.status === "completed"
								? String(monitorTotalStudents)
								: "0"
					}
					icon={<span className="text-[#2f66b9]">●</span>}
				/>
				<StatCard
					tone="amber"
					title="Шалгалт үргэлжлэх хугацаа"
					value={remainingDurationLabel}
					icon={<Clock3 className="h-5 w-5" />}
				/>
				<StatCard
					tone="red"
					title="Салсан"
					value={isStarted ? String(disconnectedCount) : "0"}
					icon={<Camera className="h-5 w-5" />}
				/>
			</div>

			<div className="mt-6">
				<h3 className="text-4 font-extrabold text-[#1f2a44]">
					{isStarted
						? "Сурагчдын жагсаалт"
						: "Шалгалтын товч мэдээлэл"}
				</h3>

				<div className="mt-4 space-y-4">
					{isStarted && activeStudents.length ? (
						<div className="overflow-hidden rounded-2xl border border-[#d9dee8] bg-white">
							<div className="grid grid-cols-[minmax(0,1fr)_140px] items-center border-b border-[#e7edf5] px-6 py-4 text-[#66789f]">
								<p className="text-4 font-bold">№ / Нэр</p>
								<p className="text-right text-4 font-bold">Төлөв</p>
							</div>
							{[...activeStudents]
								.sort((a, b) => b.startedAt - a.startedAt)
								.map((student, index) => (
									<ActiveStudentRow index={index} key={student.id} student={student} />
								))}
						</div>
					) : activeExam ? (
						<div className="rounded-2xl border border-[#d9dee8] bg-[#f8fafc] p-6">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div>
									<p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7b8aa3]">
										{monitorStatusText(
											activeExam.status,
											activeExam.classLabels,
											activeClassLabel ?? undefined,
										)}
									</p>
									<h4 className="mt-2 text-xl font-extrabold text-[#1f2a44]">
										{activeExam.title}
									</h4>
									<p className="mt-2 text-sm leading-6 text-[#60728f]">
										{activeExam.subject} · {activeExam.topic} · {activeExam.grade}
									</p>
								</div>
								<div className="rounded-2xl border border-[#dbe5f2] bg-white px-4 py-3 text-right">
									<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b8aa3]">
										Хадгалсан
									</p>
									<p className="mt-2 text-sm font-semibold text-[#1f2a44]">
										{activeExam.savedAtLabel}
									</p>
								</div>
							</div>

							<div className="mt-5 grid gap-4 sm:grid-cols-3">
								<MiniInfoCard label="Асуулт" value={`${activeExam.questionCount}`} />
								<MiniInfoCard label="Нийт оноо" value={`${activeExam.totalPoints}`} />
								<MiniInfoCard label="Үргэлжлэх хугацаа" value={`${activeExam.durationInMinutes} минут`} />
								<MiniInfoCard
									label={activeExam.classLabels.length > 1 ? "Илгээсэн ангиуд" : "Илгээсэн анги"}
									value={activeClassLabel ?? activeExam.classLabel}
								/>
							</div>
						</div>
					) : (
						<div className="rounded-2xl border border-[#d9dee8] bg-[#f8fafc] px-5 py-4 text-4 text-[#66789f]">
							Одоогоор харах шалгалт алга байна.
						</div>
					)}
				</div>

				<p className="mt-4 text-3 text-[#66789f]">
					{lastUpdatedAt
						? `Сүүлд шинэчлэгдсэн: ${new Date(lastUpdatedAt).toLocaleTimeString(undefined, {
								hour: "2-digit",
								minute: "2-digit",
						  })}`
						: " "}
				</p>
			</div>
		</section>
	);
}
