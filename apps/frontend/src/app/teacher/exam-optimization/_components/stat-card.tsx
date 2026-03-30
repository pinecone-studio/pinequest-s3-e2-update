"use client";

import type { ReactNode } from "react";

export function StatCard({
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
