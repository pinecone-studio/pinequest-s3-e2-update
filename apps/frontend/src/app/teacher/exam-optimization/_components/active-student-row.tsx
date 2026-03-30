"use client";

import type { ActiveStudentEntry } from "../_lib/monitoring";

export function ActiveStudentRow({
	index,
	student,
}: {
	index: number;
	student: ActiveStudentEntry;
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
