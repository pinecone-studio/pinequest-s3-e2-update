"use client";

import { AlertTriangle, Camera, Users } from "lucide-react";
import { ActiveStudentRow } from "./active-student-row";
import { MiniInfoCard } from "./mini-info-card";
import { StatCard } from "./stat-card";
import { monitorStatusText, type ActiveStudentEntry, type MonitorExamCardItem } from "../_lib/monitoring";

export function MonitorDetailSection({
	activeCount,
	activeExam,
	activeStudents,
	disconnectedCount,
	isMonitoring,
	lastUpdatedAt,
	monitorTotalStudents,
	onStartMonitoring,
	onStopMonitoring,
}: {
	activeCount: number;
	activeExam: MonitorExamCardItem | null;
	activeStudents: ActiveStudentEntry[];
	disconnectedCount: number;
	isMonitoring: boolean;
	lastUpdatedAt: number | null;
	monitorTotalStudents: number;
	onStartMonitoring: () => void;
	onStopMonitoring: () => void;
}) {
	return (
		<section className="rounded-2xl border border-[#d9dee8] bg-white px-6 py-6 shadow-sm">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-5 font-extrabold text-[#1f2a44]">
						{activeExam?.status === "ongoing"
							? "Явагдаж буй шалгалтын хяналт"
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
								{monitorStatusText(activeExam.status)}
							</span>
							{" · "}Илгээсэн анги:{" "}
							<span className="font-bold text-[#1f2a44]">
								{activeExam.classLabel}
							</span>
						</p>
					) : null}
				</div>

				<div className="flex flex-wrap items-center gap-3">
					{activeExam?.status === "ongoing" ? (
						!isMonitoring ? (
							<button
								type="button"
								onClick={onStartMonitoring}
								className="rounded-xl bg-[#2563eb] px-4 py-2.5 text-4 font-semibold text-white transition hover:bg-[#1d4ed8]"
							>
								Хяналт эхлүүлэх
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
						activeExam?.status === "ongoing"
							? String(activeCount)
							: activeExam?.status === "completed"
								? String(monitorTotalStudents)
								: "0"
					}
					icon={<span className="text-[#2f66b9]">●</span>}
				/>
				<StatCard
					tone="amber"
					title="Анхааруулах"
					value={activeExam?.status === "ongoing" ? "0" : "—"}
					icon={<AlertTriangle className="h-5 w-5" />}
				/>
				<StatCard
					tone="red"
					title="Салсан"
					value={activeExam?.status === "ongoing" ? String(disconnectedCount) : "0"}
					icon={<Camera className="h-5 w-5" />}
				/>
			</div>

			<div className="mt-6">
				<h3 className="text-4 font-extrabold text-[#1f2a44]">
					{activeExam?.status === "ongoing"
						? "Сурагчдын жагсаалт"
						: "Шалгалтын товч мэдээлэл"}
				</h3>

				<div className="mt-4 space-y-4">
					{activeExam?.status === "ongoing" && activeStudents.length ? (
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
										{monitorStatusText(activeExam.status)}
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
								<MiniInfoCard label="Илгээсэн анги" value={activeExam.classLabel} />
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
