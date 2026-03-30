"use client";

export function MiniInfoCard({
	label,
	value,
}: {
	label: string;
	value: string;
}) {
	return (
		<div className="rounded-2xl border border-[#dbe5f2] bg-white px-4 py-4">
			<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b8aa3]">
				{label}
			</p>
			<p className="mt-2 text-lg font-bold text-[#1f2a44]">{value}</p>
		</div>
	);
}
