/** @format */

"use client";

import type { TeacherExamSchedule } from "../_types/exam-schedule";

type Props = {
	schedule: TeacherExamSchedule | null;
	isPending: boolean;
	error: string | null;
	onConfirm: () => void;
	onClose: () => void;
};

export function DeleteExamScheduleDialog({
	schedule,
	isPending,
	error,
	onConfirm,
	onClose,
}: Props) {
	if (!schedule) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
				<h3 className="text-lg font-semibold text-zinc-900">
					Шалгалтын хуваарь устгах уу?
				</h3>
				<p className="mt-2 text-sm text-zinc-600">
					<span className="font-medium text-zinc-900">{schedule.subject}</span>{" "}
					хичээлийн{" "}
					<span className="font-medium text-zinc-900">
						{schedule.className}
					</span>{" "}
					ангийн шалгалтыг устгах гэж байна. Энэ үйлдлийг буцаах боломжгүй.
				</p>

				{error ? (
					<p className="mt-3 text-sm font-medium text-red-600">{error}</p>
				) : null}

				<div className="mt-6 flex flex-wrap justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={isPending}
						className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed"
					>
						Болих
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isPending}
						className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
					>
						{isPending ? "Устгаж байна..." : "Устгах"}
					</button>
				</div>
			</div>
		</div>
	);
}
