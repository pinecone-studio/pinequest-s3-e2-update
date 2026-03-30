"use client";

import {
	ArrowRight,
	BookOpen,
	CheckCircle2,
	Clock3,
	PlayCircle,
} from "lucide-react";
import { monitorStatusText, type MonitorExamCardItem } from "../_lib/monitoring";

export function MonitorExamCard({
	exam,
	isActive,
	onOpen,
}: {
	exam: MonitorExamCardItem;
	isActive: boolean;
	onOpen: () => void;
}) {
	const statusStyles = {
		ongoing: {
			badge: "bg-[#e8f3ff] text-[#1f6feb]",
			icon: <PlayCircle className="h-4 w-4" />,
		},
		completed: {
			badge: "bg-[#ecfdf3] text-[#15803d]",
			icon: <CheckCircle2 className="h-4 w-4" />,
		},
		approval_pending: {
			badge: "bg-[#fff4e5] text-[#b45309]",
			icon: <Clock3 className="h-4 w-4" />,
		},
		draft: {
			badge: "bg-[#f1f5f9] text-[#475569]",
			icon: <BookOpen className="h-4 w-4" />,
		},
	}[exam.status];

	return (
		<button
			type="button"
			onClick={onOpen}
			className={`rounded-3xl border p-5 text-left transition ${
				isActive
					? "border-[#7fb3ff] bg-[#edf5ff] shadow-[0_14px_30px_rgba(79,157,255,0.12)]"
					: "border-[#d8e2f0] bg-[#f9fcff] hover:border-[#aac8f8] hover:bg-white"
			}`}
		>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<span
					className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles.badge}`}
				>
					{statusStyles.icon}
					{monitorStatusText(exam.status)}
				</span>
				<span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b8aa3]">
					{exam.savedAtLabel}
				</span>
			</div>

			<h3 className="mt-4 text-xl font-extrabold text-[#1f2a44]">
				{exam.title}
			</h3>
			<p className="mt-2 text-sm leading-6 text-[#60728f]">
				{exam.subject} · {exam.topic} · {exam.grade}
			</p>

			<div className="mt-4 flex flex-wrap items-center gap-2">
				<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#3b5a8f]">
					Илгээсэн анги: {exam.classLabel}
				</span>
				<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2f66b9]">
					{exam.questionCount} асуулт
				</span>
				<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#7047a9]">
					{exam.totalPoints} оноо
				</span>
			</div>

			<div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f6feb]">
				{exam.status === "ongoing" ? "Хяналт руу орох" : "Дэлгэрэнгүй харах"}
				<ArrowRight className="h-4 w-4" />
			</div>
		</button>
	);
}
