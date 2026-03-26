/** @format */

import {
	formatExamDate,
	statusBadgeClassNames,
	statusLabels,
} from "../_utils/exam-schedule";
import type { TeacherExamSchedule } from "../_types/exam-schedule";

type Props = {
	schedule: TeacherExamSchedule;
	onEdit: (schedule: TeacherExamSchedule) => void;
	onDelete: (schedule: TeacherExamSchedule) => void;
};

export function TeacherExamScheduleCard({ schedule, onEdit, onDelete }: Props) {
	return (
		<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="text-base font-semibold text-zinc-900">
							{schedule.subject}
						</h3>
						<span
							className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClassNames[schedule.status]}`}
						>
							{statusLabels[schedule.status]}
						</span>
					</div>
					<p className="mt-1 text-sm text-zinc-500">
						{schedule.className} анги
					</p>
				</div>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => onEdit(schedule)}
						className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
					>
						Edit
					</button>
					<button
						type="button"
						onClick={() => onDelete(schedule)}
						className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
					>
						Delete
					</button>
				</div>
			</div>

			<dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-600 sm:grid-cols-2 xl:grid-cols-4">
				<div>
					<dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
						Огноо
					</dt>
					<dd className="mt-1 text-zinc-900">
						{formatExamDate(schedule.examDate)}
					</dd>
				</div>
				<div>
					<dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
						Цаг
					</dt>
					<dd className="mt-1 text-zinc-900">
						{schedule.startTime} - {schedule.endTime}
					</dd>
				</div>
				<div>
					<dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
						Хугацаа
					</dt>
					<dd className="mt-1 text-zinc-900">{schedule.duration}</dd>
				</div>
				<div>
					<dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
						Тэмдэглэл
					</dt>
					<dd className="mt-1 text-zinc-900">
						{schedule.notes || "Тэмдэглэлгүй"}
					</dd>
				</div>
			</dl>
		</article>
	);
}
