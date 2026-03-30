"use client";

import { MonitorExamCard } from "./monitor-exam-card";
import type { MonitorExamCardItem } from "../_lib/monitoring";

export function MonitorExamsSection({
	activeExamId,
	exams,
	onOpenExam,
}: {
	activeExamId: string | null;
	exams: MonitorExamCardItem[];
	onOpenExam: (exam: MonitorExamCardItem) => void;
}) {
	return (
		<section className="rounded-2xl border border-[#d9dee8] bg-white px-6 py-6 shadow-sm">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-5 font-extrabold text-[#1f2a44]">
						Миний шалгалтууд
					</h2>
					<p className="mt-2 text-3 text-[#66789f]">
						Хяналт руу ороход энэ багшийн бүх шалгалт card хэлбэрээр харагдана.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<span className="rounded-full bg-[#eef6ff] px-4 py-2 text-3 font-semibold text-[#2f66b9]">
						{exams.length} шалгалт
					</span>
				</div>
			</div>

			<div className="mt-6 grid gap-4 lg:grid-cols-2">
				{exams.map((exam) => (
					<MonitorExamCard
						exam={exam}
						isActive={activeExamId === exam.id}
						key={exam.id}
						onOpen={() => onOpenExam(exam)}
					/>
				))}
			</div>
		</section>
	);
}
