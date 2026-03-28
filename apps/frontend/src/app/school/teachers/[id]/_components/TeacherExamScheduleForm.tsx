/** @format */

"use client";

import {
	calculateDuration,
	scheduleStatuses,
	statusLabels,
} from "../_utils/exam-schedule";
import type { TeacherExamScheduleFormValues } from "../_types/exam-schedule";

const inputClass =
	"mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-zinc-100";

const labelClass =
	"block text-xs font-semibold uppercase tracking-wide text-zinc-500";

type Props = {
	values: TeacherExamScheduleFormValues;
	classOptions: string[];
	error: string | null;
	isPending: boolean;
	onChange: (field: keyof TeacherExamScheduleFormValues, value: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	onCancelEdit: () => void;
};

export function TeacherExamScheduleForm({
	values,
	classOptions,
	error,
	isPending,
	onChange,
	onSubmit,
	onCancelEdit,
}: Props) {
	const durationPreview =
		values.startTime && values.endTime
			? calculateDuration(values.startTime, values.endTime)
			: "Эхлэх ба дуусах цаг сонгоно уу";

	return (
		<section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold text-zinc-900">
						{values.id ? "Шалгалтын хуваарь засах" : "Шалгалтын хуваарь нэмэх"}
					</h2>
					<p className="mt-1 text-sm text-zinc-500">
						Багшийн шалгалтын хуваарийг анги, сэдэв, цагийн мэдээлэлтэйгээр
						удирдана.
					</p>
				</div>
				{values.id ? (
					<button
						type="button"
						onClick={onCancelEdit}
						className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
					>
						Цуцлах
					</button>
				) : null}
			</div>

			<form
				onSubmit={onSubmit}
				className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
			>
				<label className={labelClass}>
					Сэдэв
					<input
						value={values.subject}
						onChange={(event) => onChange("subject", event.target.value)}
						className={inputClass}
						disabled={isPending}
						required
					/>
				</label>

				<label className={labelClass}>
					Анги
					<select
						value={values.className}
						onChange={(event) => onChange("className", event.target.value)}
						className={inputClass}
						disabled={isPending || classOptions.length === 0}
						required
					>
						<option value="">Анги сонгох</option>
						{classOptions.map((className) => (
							<option key={className} value={className}>
								{className}
							</option>
						))}
					</select>
				</label>

				<label className={labelClass}>
					Төлөв
					<select
						value={values.status}
						onChange={(event) => onChange("status", event.target.value)}
						className={inputClass}
						disabled={isPending}
					>
						{scheduleStatuses.map((status) => (
							<option key={status} value={status}>
								{statusLabels[status]}
							</option>
						))}
					</select>
				</label>

				<label className={labelClass}>
					Огноо
					<input
						type="date"
						value={values.examDate}
						onChange={(event) => onChange("examDate", event.target.value)}
						className={inputClass}
						disabled={isPending}
						required
					/>
				</label>

				<label className={labelClass}>
					Эхлэх цаг
					<input
						type="time"
						value={values.startTime}
						onChange={(event) => onChange("startTime", event.target.value)}
						className={inputClass}
						disabled={isPending}
						required
					/>
				</label>

				<label className={labelClass}>
					Дуусах цаг
					<input
						type="time"
						value={values.endTime}
						onChange={(event) => onChange("endTime", event.target.value)}
						className={inputClass}
						disabled={isPending}
						required
					/>
				</label>

				<label className={`${labelClass} md:col-span-2 xl:col-span-3`}>
					Тэмдэглэл
					<textarea
						value={values.notes ?? ""}
						onChange={(event) => onChange("notes", event.target.value)}
						className={`${inputClass} min-h-24`}
						disabled={isPending}
						placeholder="Нэмэлт заавар, танхим, бэлтгэл материал..."
					/>
				</label>

				<div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
					Үргэлжлэх хугацаа цагийн сонголтоос автоматаар тооцогдоно. Урьдчилсан
					дүн:
					<span className="ml-1 font-semibold text-zinc-900">
						{durationPreview}
					</span>
				</div>

				<div className="flex flex-wrap items-center gap-3 xl:col-span-2 xl:justify-end">
					{error ? (
						<p className="text-sm font-medium text-red-600">{error}</p>
					) : null}
					<button
						type="submit"
						disabled={isPending || classOptions.length === 0}
						className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
					>
						{isPending
							? "Хадгалж байна..."
							: values.id
								? "Өөрчлөлт хадгалах"
								: "Хуваарь нэмэх"}
					</button>
				</div>
			</form>
		</section>
	);
}
