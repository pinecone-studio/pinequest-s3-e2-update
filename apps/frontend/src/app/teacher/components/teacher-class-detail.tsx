/** @format */

"use client";

import {
	ArrowLeft,
	BarChart3,
	BookOpen,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Download,
	Search,
	Users,
	X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
	buildPastExamFullStatisticsExportHtml,
	getPastExamsForClass,
	type PastExamRow,
	type PastExamStudentScore,
} from "@/app/lib/class-past-exams-mock";
import { store } from "@/app/lib/store";
import type { Student } from "@/app/lib/types";
import ReviewScreen from "./review-screen";
import { useTeacher } from "../teacher-shell";

type ClassView = "students" | "history";

function escapeHtml(s: string) {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function sanitizeFilename(s: string) {
	const t = s.replace(/[^\w\u0400-\u04FF-]+/g, "_").replace(/^_+|_+$/g, "");
	return t.slice(0, 80) || "export";
}

function triggerExcelDownload(filename: string, tableHtml: string) {
	const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8" /></head>
      <body>${tableHtml}</body>
    </html>`;
	const blob = new Blob([`\ufeff${html}`], {
		type: "application/vnd.ms-excel;charset=utf-8;",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

function triggerPdfDownload(title: string, bodyHtml: string) {
	const printWindow = window.open("", "_blank", "noopener,noreferrer");
	if (!printWindow) return;

	printWindow.document.write(`
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1f2a44; }
          h1 { margin-bottom: 16px; font-size: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #d9dee8; padding: 8px 10px; text-align: left; }
          th { background: #f6faff; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        ${bodyHtml}
      </body>
    </html>
  `);
	printWindow.document.close();
	printWindow.onload = () => {
		printWindow.focus();
		printWindow.print();
	};
	printWindow.onafterprint = () => {
		printWindow.close();
	};
}

function buildStudentListTable(className: string, students: Student[]) {
	const rows = students
		.map(
			(s, i) =>
				`<tr><td>${i + 1}</td><td>${escapeHtml(`${s.firstName} ${s.lastName}`)}</td></tr>`,
		)
		.join("");
	return `
    <table border="1">
      <tr><th colspan="2">Анги: ${escapeHtml(className)}</th></tr>
      <tr><th>№</th><th>Овог нэр</th></tr>
      ${rows}
    </table>`;
}

function downloadStudentListXls(className: string, students: Student[]) {
	const table = buildStudentListTable(className, students);
	triggerExcelDownload(`${sanitizeFilename(className)}-suragchid.xls`, table);
}

function downloadStudentListPdf(className: string, students: Student[]) {
	triggerPdfDownload(
		`${className} - Сурагчдын жагсаалт`,
		buildStudentListTable(className, students),
	);
}

function downloadFullExamStatisticsXls(className: string, row: PastExamRow) {
	const html = buildPastExamFullStatisticsExportHtml(className, row);
	const base = sanitizeFilename(
		`${className}_${row.date}_${row.examTitle}_ang_statistik`,
	);
	triggerExcelDownload(`${base}.xls`, html);
}

function sortPastExamStudents(
	scores: ReturnType<typeof getPastExamsForClass>[number]["studentScores"],
) {
	return [...scores].sort(
		(a, b) =>
			a.lastName.localeCompare(b.lastName, "mn", { sensitivity: "base" }) ||
			a.firstName.localeCompare(b.firstName, "mn", { sensitivity: "base" }),
	);
}

type LetterGrade = "A" | "B" | "C" | "D" | "F";

const LETTER_GRADE_ORDER: LetterGrade[] = ["A", "B", "C", "D", "F"];

const LETTER_GRADE_STYLES: Record<
	LetterGrade,
	{ fill: string; labelMn: string }
> = {
	A: { fill: "#16a34a", labelMn: "Маш сайн (A)" },
	B: { fill: "#4f9dff", labelMn: "Сайн (B)" },
	C: { fill: "#ca8a04", labelMn: "Дунд (C)" },
	D: { fill: "#ea580c", labelMn: "Муу (D)" },
	F: { fill: "#dc2626", labelMn: "Тэнцээгүй (F)" },
};

function letterGradeFromPercent(percent: number): LetterGrade {
	if (percent >= 90) return "A";
	if (percent >= 80) return "B";
	if (percent >= 70) return "C";
	if (percent >= 60) return "D";
	return "F";
}

function pastExamGradeBuckets(row: PastExamRow): Record<LetterGrade, number> {
	const empty: Record<LetterGrade, number> = {
		A: 0,
		B: 0,
		C: 0,
		D: 0,
		F: 0,
	};
	if (row.maxScore <= 0 || row.studentScores.length === 0) return empty;
	for (const s of row.studentScores) {
		const pct = (s.score / row.maxScore) * 100;
		const g = letterGradeFromPercent(pct);
		empty[g] += 1;
	}
	return empty;
}

function PastExamMostFailedInsight({ row }: { row: PastExamRow }) {
	const insight = row.mostFailedQuestion;
	if (!insight) {
		return (
			<section
				className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6"
				aria-label="Даваагүй асуултын мэдээлэл"
			>
				<div className="flex gap-4">
					<div
						className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f1f5f9] text-[#64748b]"
						aria-hidden
					>
						<BookOpen className="h-5 w-5" />
					</div>
					<div className="min-w-0 text-[0.9375rem] leading-relaxed text-[#64748b] sm:text-base">
						<p className="font-semibold text-[#475569]">
							Даваагүй асуулт олдсонгүй
						</p>
						<p className="mt-1.5">
							Энэ шалгалтын бүх асуултаар сурагчид бүрэн оноо авсан, эсвэл
							статистикийн дата байхгүй байна.
						</p>
					</div>
				</div>
			</section>
		);
	}
	const failPct = Math.round(
		(insight.failCount / Math.max(1, insight.totalStudents)) * 100,
	);
	return (
		<section
			className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 p-5 shadow-[0_4px_24px_rgba(180,83,9,0.08)] sm:p-6"
			aria-label="Хамгийн олон сурагч алдсан асуулт"
		>
			<div className="flex flex-col gap-5">
				<div className="flex items-start gap-4">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-sm ring-1 ring-amber-200/80">
						<BookOpen className="h-6 w-6" strokeWidth={2} aria-hidden />
					</div>
					<div className="min-w-0 flex-1 pt-0.5">
						<h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-amber-900/90">
							Хамгийн олон сурагч алдсан асуулт
						</h3>
						<div className="mt-2 flex flex-wrap items-center gap-2">
							<span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[0.8125rem] font-semibold tabular-nums text-amber-950 shadow-sm ring-1 ring-amber-100">
								Асуулт №{insight.order}
							</span>
							<span className="inline-flex items-center rounded-full bg-amber-900/90 px-3 py-1 text-[0.8125rem] font-semibold text-white shadow-sm">
								{insight.failCount} / {insight.totalStudents} сурагч · {failPct}%
							</span>
						</div>
					</div>
				</div>

				<div className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm sm:px-6 sm:py-5">
					<p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-[#64748b]">
						Асуултын өгүүлбэр
					</p>
					<p className="mt-3 text-[0.9375rem] font-medium leading-[1.65] text-[#1e293b] sm:text-base sm:leading-[1.7]">
						{insight.question}
					</p>
				</div>

				<div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 px-5 py-4 shadow-sm sm:px-6 sm:py-5">
					<div className="flex items-start gap-3">
						<div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
							<CheckCircle2 className="h-5 w-5" strokeWidth={2.2} aria-hidden />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-[0.8125rem] font-bold uppercase tracking-wide text-emerald-900">
								Зөв хариулт (загвар)
							</p>
							<p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-emerald-950 sm:text-base sm:leading-[1.7]">
								{insight.correctAnswer}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function PastExamClassGradeChart({ row }: { row: PastExamRow }) {
	const buckets = useMemo(() => pastExamGradeBuckets(row), [row]);
	const total = row.studentScores.length;
	if (total === 0) {
		return (
			<section
				className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-[#fafbfd] p-6 text-center text-[0.9375rem] text-[#64748b]"
				aria-label="Үнэлгээний график"
			>
				<BarChart3 className="mb-3 h-10 w-10 text-[#cbd5e1]" aria-hidden />
				<p className="font-semibold text-[#475569]">Сурагчийн дата байхгүй</p>
				<p className="mt-1 max-w-xs leading-relaxed">
					Үнэлгээний хуваарилалт харагдахын тулд дор хаяд нэг сурагч шалгалт өгсөн байх
					ёстой.
				</p>
			</section>
		);
	}

	const segments = LETTER_GRADE_ORDER.filter((g) => buckets[g] > 0).map(
		(grade) => ({
			grade,
			count: buckets[grade],
			pct: (buckets[grade] / total) * 100,
			fill: LETTER_GRADE_STYLES[grade].fill,
		}),
	);

	const ariaSummary = LETTER_GRADE_ORDER.map(
		(g) =>
			`${g} ${buckets[g]} сурагч, ${Math.round((buckets[g] / total) * 100)} хувь`,
	).join("; ");

	return (
		<section
			className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] sm:p-6"
			aria-label="Ангийн үнэлгээний хуваарилалт"
		>
			<h3 className="text-lg font-extrabold tracking-tight text-[#0f172a] sm:text-xl">
				Ангийн үнэлгээ (A–F)
			</h3>
			<p className="mt-3 max-w-prose rounded-xl bg-[#f8fafc] px-3.5 py-2.5 text-[0.8125rem] leading-snug text-[#64748b] ring-1 ring-[#f1f5f9] sm:text-[0.875rem]">
				Нийт онооны хувиар:{" "}
				<span className="font-semibold text-[#475569]">A — 90%+</span> ·{" "}
				<span className="font-semibold text-[#475569]">B — 80%+</span> ·{" "}
				<span className="font-semibold text-[#475569]">C — 70%+</span> ·{" "}
				<span className="font-semibold text-[#475569]">D — 60%+</span> ·{" "}
				<span className="font-semibold text-[#475569]">F — доош</span>
			</p>

			<div
				className="mt-5 flex h-14 w-full overflow-hidden rounded-2xl shadow-inner ring-1 ring-[#e2e8f0]"
				role="img"
				aria-label={`Үнэлгээний хуваарилалт. ${ariaSummary}`}
			>
				{segments.map((s) => (
					<div
						key={s.grade}
						style={{
							width: `${s.pct}%`,
							backgroundColor: s.fill,
							minWidth: s.count > 0 ? "6px" : undefined,
						}}
						className="min-h-[3.5rem] transition-[width] duration-300"
						title={`${s.grade}: ${s.count} сурагч (${Math.round(s.pct)}%)`}
					/>
				))}
			</div>

			<ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
				{LETTER_GRADE_ORDER.map((grade) => {
					const n = buckets[grade];
					const p = total > 0 ? Math.round((n / total) * 100) : 0;
					const { fill, labelMn } = LETTER_GRADE_STYLES[grade];
					return (
						<li
							key={grade}
							className="flex flex-col rounded-xl border border-[#e8ecf2] bg-[#fafbfd] px-3 py-3 text-[#334261] shadow-sm"
						>
							<div className="flex items-center gap-2">
								<span
									className="h-3 w-3 shrink-0 rounded-full shadow-sm ring-2 ring-white"
									style={{ backgroundColor: fill }}
									aria-hidden
								/>
								<span className="text-lg font-extrabold tabular-nums text-[#0f172a]">
									{grade}
								</span>
							</div>
							<span className="mt-2 text-[0.8125rem] font-medium tabular-nums text-[#64748b]">
								{n} сурагч
							</span>
							<span className="mt-1 line-clamp-2 text-[0.6875rem] font-medium leading-tight text-[#94a3b8]">
								{p}% — {labelMn}
							</span>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

function buildSingleStudentPastExamTablesHtml(
	className: string,
	exam: PastExamRow,
	student: PastExamStudentScore,
) {
	const summary = `
    <table border="1">
      <tr><th colspan="2">Сурагчийн шалгалтын дүн — ${escapeHtml(className)}</th></tr>
      <tr><td>Огноо</td><td>${escapeHtml(exam.date)}</td></tr>
      <tr><td>Хичээл</td><td>${escapeHtml(exam.subject)}</td></tr>
      <tr><td>Шалгалт</td><td>${escapeHtml(exam.examTitle)}</td></tr>
      <tr><td>Сурагч</td><td>${escapeHtml(`${student.lastName} ${student.firstName}`)}</td></tr>
      <tr><td>Оноо</td><td>${student.score} / ${exam.maxScore}</td></tr>
      <tr><td>Тэнцсэн</td><td>${student.passed ? "Тийм" : "Үгүй"}</td></tr>
    </table>`;

	if (!student.attempts?.length) return summary;

	const attemptRows = student.attempts
		.map(
			(a) =>
				`<tr><td>${a.order}</td><td>${escapeHtml(a.question)}</td><td>${escapeHtml(a.studentAnswer)}</td><td>${a.pointsEarned} / ${a.pointsMax}</td></tr>`,
		)
		.join("");

	return `${summary}
    <table border="1" style="margin-top:14px">
      <tr><th colspan="4">Асуулт бүрээр</th></tr>
      <tr><th>№</th><th>Асуулт</th><th>Хариулт</th><th>Оноо</th></tr>
      ${attemptRows}
    </table>`;
}

function downloadSingleStudentPastExamXls(
	className: string,
	exam: PastExamRow,
	student: PastExamStudentScore,
) {
	const html = buildSingleStudentPastExamTablesHtml(className, exam, student);
	const base = sanitizeFilename(
		`${className}_${student.lastName}_${student.firstName}_${exam.date}`,
	);
	triggerExcelDownload(`${base}.xls`, html);
}

function PastExamStudentStatPopover({
	classLabel,
	exam,
	student,
	onClose,
}: {
	classLabel: string;
	exam: PastExamRow;
	student: PastExamStudentScore;
	onClose: () => void;
}) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	return (
		<>
			<button
				type="button"
				className="fixed inset-0 z-[90] cursor-default bg-[#1f2a44]/25"
				aria-label="Дэлгэц хаах"
				onClick={onClose}
			/>
			<div
				className="fixed left-1/2 top-1/2 z-[100] w-[min(calc(100vw-20px),42rem)] max-h-[min(92vh,900px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[#d9dee8] bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.25)] outline-none"
				role="dialog"
				aria-modal="true"
				aria-labelledby="student-exam-stat-popover-title"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-3 border-b border-[#e8ecf2] bg-gradient-to-r from-[#f8fafc] to-white px-5 py-4 sm:px-6 sm:py-5">
					<div className="min-w-0">
						<p
							id="student-exam-stat-popover-title"
							className="text-xl font-extrabold tracking-tight text-[#0f172a] sm:text-2xl"
						>
							{student.lastName} {student.firstName}
						</p>
						<p className="mt-1.5 truncate text-[0.9375rem] text-[#64748b]">
							{classLabel}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="shrink-0 rounded-xl p-2 text-[#64748b] transition hover:bg-[#e8ecf2] hover:text-[#1f2a44]"
						aria-label="Хаах"
					>
						<X className="h-6 w-6" aria-hidden />
					</button>
				</div>
				<div className="max-h-[min(82vh,820px)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
					<p className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-[#4f9dff]">
						Шалгалтын статистик
					</p>
					<dl className="mt-4 grid gap-3 sm:grid-cols-2">
						{[
							{ label: "Огноо", value: exam.date },
							{ label: "Хичээл", value: exam.subject },
							{
								label: "Шалгалт",
								value: exam.examTitle,
								className: "sm:col-span-2",
							},
							{
								label: "Оноо",
								value: (
									<>
										<span className="text-[1.125rem] font-bold tabular-nums">
											{student.score}
										</span>
										<span className="font-normal text-[#94a3b8]">
											{" "}
											/ {exam.maxScore}
										</span>
									</>
								),
							},
							{
								label: "Тэнцсэн",
								value: student.passed ? "Тийм" : "Үгүй",
								valueClass: student.passed
									? "font-semibold text-[#15803d]"
									: "font-semibold text-[#b91c1c]",
							},
						].map((item) => (
							<div
								key={item.label}
								className={`rounded-xl border border-[#e8ecf2] bg-[#fafbfd] px-4 py-3 ${"className" in item ? item.className ?? "" : ""}`}
							>
								<dt className="text-[0.75rem] font-semibold uppercase tracking-wide text-[#94a3b8]">
									{item.label}
								</dt>
								<dd
									className={`mt-1 text-[0.9375rem] font-semibold leading-snug text-[#0f172a] ${"valueClass" in item ? item.valueClass ?? "" : ""}`}
								>
									{item.value}
								</dd>
							</div>
						))}
					</dl>

					{student.attempts?.length ? (
						<div className="mt-8 border-t border-[#e8ecf2] pt-6">
							<p className="text-base font-extrabold text-[#0f172a]">
								Асуулт бүрээр
							</p>
							<p className="mt-1 text-[0.8125rem] text-[#64748b]">
								Бүтэн оноо ногоон, хэсэгчилсэн оноо улбар шар зураасаар тэмдэглэгдсэн.
							</p>
							<ul className="mt-4 space-y-4">
								{student.attempts.map((a) => {
									const full = a.pointsEarned >= a.pointsMax;
									const none = a.pointsEarned <= 0;
									const barColor = full
										? "border-emerald-500 bg-emerald-50/80"
										: none
											? "border-rose-400 bg-rose-50/50"
											: "border-amber-400 bg-amber-50/40";
									return (
										<li
											key={a.order}
											className={`rounded-2xl border border-[#e4eaf5] ${barColor} pl-4 pr-4 py-4 shadow-sm sm:pl-5 sm:pr-5 sm:py-4`}
										>
											<p className="text-[0.9375rem] font-semibold leading-[1.65] text-[#0f172a] sm:text-base sm:leading-[1.7]">
												<span className="mr-2 font-extrabold tabular-nums text-[#4f9dff]">
													{a.order}.
												</span>
												{a.question}
											</p>
											<p className="mt-3 text-[0.875rem] leading-relaxed text-[#4a5875]">
												<span className="font-semibold text-[#64748b]">
													Хариулт:{" "}
												</span>
												<span className="text-[#1e293b]">{a.studentAnswer}</span>
											</p>
											<p
												className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-[0.8125rem] font-bold tabular-nums ${
													full
														? "bg-emerald-600 text-white"
														: none
															? "bg-rose-600 text-white"
															: "bg-amber-600 text-white"
												}`}
											>
												Оноо: {a.pointsEarned} / {a.pointsMax}
											</p>
										</li>
									);
								})}
							</ul>
						</div>
					) : null}
				</div>
			</div>
		</>
	);
}

function StudentClassExamResultsPanel({
	classLabel,
	student,
	examRows,
	placement = "standalone",
}: {
	classLabel: string;
	student: Student;
	examRows: Array<{ exam: PastExamRow; score: PastExamStudentScore }>;
	placement?: "standalone" | "underRow";
}) {
	const underRow = placement === "underRow";
	return (
		<section
			className={
				underRow
					? "border-t-2 border-[#4f9dff]/35 bg-gradient-to-b from-[#f4f9ff] to-[#fafdff]"
					: "mt-6 rounded-2xl border border-[#4f9dff]/25 bg-gradient-to-b from-[#f6faff] to-white p-5 shadow-[0_4px_24px_rgba(79,157,255,0.08)] sm:p-6"
			}
			aria-label={`${student.lastName} ${student.firstName} — шалгалтын дүн`}
		>
			<div className={underRow ? "px-4 py-4 sm:px-5 sm:py-5" : ""}>
				{underRow ? (
					<div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e2e8f0] pb-3">
						<p className="text-[0.8125rem] font-semibold text-[#334261]">
							{student.firstName} {student.lastName}
							<span className="ml-2 font-normal text-[#64748b]">
								· {student.studentNumber} · {classLabel}
							</span>
						</p>
						<p className="text-[0.8125rem] text-[#64748b]">
							Өмнөх шалгалт:{" "}
							<span className="font-bold tabular-nums text-[#0f172a]">
								{examRows.length}
							</span>
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-1 border-b border-[#e2e8f0] pb-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h3 className="text-lg font-extrabold text-[#0f172a] sm:text-xl">
								{student.firstName} {student.lastName}
							</h3>
							<p className="mt-1 text-[0.875rem] text-[#64748b]">
								{student.studentNumber} · {classLabel}
							</p>
						</div>
						<p className="text-[0.8125rem] font-medium text-[#64748b]">
							Өмнөх шалгалт:{" "}
							<span className="font-bold tabular-nums text-[#0f172a]">
								{examRows.length}
							</span>
						</p>
					</div>
				)}

				{examRows.length === 0 ? (
					<p
						className={`rounded-xl border border-dashed border-[#cbd5e1] bg-white/80 px-4 py-6 text-center text-[0.875rem] text-[#64748b] ${underRow ? "" : "mt-6 py-8"}`}
					>
						Энэ сурагчийн ангийн жагсаалтад өмнөх шалгалтын дүн байхгүй байна.
					</p>
				) : (
					<div
						className={underRow ? "mt-1 space-y-3" : "mt-5 space-y-3"}
					>
						{examRows.map(({ exam, score }) => (
						<details
							key={exam.id}
							className="group rounded-2xl border border-[#e2e8f0] bg-white shadow-sm open:shadow-md"
						>
							<summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition hover:bg-[#f8fafc] sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
								<div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
									<span className="whitespace-nowrap text-[0.8125rem] font-semibold tabular-nums text-[#475569]">
										{exam.date}
									</span>
									<span className="min-w-0 text-[0.9375rem] font-semibold leading-snug text-[#0f172a]">
										{exam.subject} — {exam.examTitle}
									</span>
								</div>
								<div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
									<span
										className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold ${
											score.passed
												? "bg-emerald-100 text-emerald-800"
												: "bg-rose-100 text-rose-800"
										}`}
									>
										{score.passed ? "Тэнцсэн" : "Тэнцээгүй"}
									</span>
									<span className="text-[0.9375rem] font-bold tabular-nums text-[#0f172a]">
										{score.score}
										<span className="font-normal text-[#94a3b8]">
											{" "}
											/ {exam.maxScore}
										</span>
									</span>
									<ChevronDown
										className="h-5 w-5 shrink-0 text-[#94a3b8] transition group-open:rotate-180"
										aria-hidden
									/>
								</div>
							</summary>
							<div className="border-t border-[#e8ecf2] px-4 py-4 sm:px-5 sm:py-5">
								<div className="mb-3 flex flex-wrap items-center justify-between gap-2">
									<p className="text-[0.8125rem] font-semibold text-[#64748b]">
										Асуулт бүрээр
									</p>
									<button
										type="button"
										className="inline-flex items-center gap-1.5 rounded-xl border border-[#c8d6ea] bg-white px-3 py-2 text-[0.8125rem] font-semibold text-[#4f9dff] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff]"
										onClick={() =>
											downloadSingleStudentPastExamXls(
												classLabel,
												exam,
												score,
											)
										}
									>
										<Download className="h-4 w-4 shrink-0" aria-hidden />
										Excel
									</button>
								</div>
								{score.attempts?.length ? (
									<ul className="space-y-3">
										{score.attempts.map((a) => {
											const full = a.pointsEarned >= a.pointsMax;
											const none = a.pointsEarned <= 0;
											const barColor = full
												? "border-emerald-500 bg-emerald-50/80"
												: none
													? "border-rose-400 bg-rose-50/50"
													: "border-amber-400 bg-amber-50/40";
											return (
												<li
													key={a.order}
													className={`rounded-xl border px-3 py-3 sm:px-4 sm:py-3.5 ${barColor}`}
												>
													<p className="text-[0.875rem] font-semibold leading-relaxed text-[#0f172a]">
														<span className="mr-1.5 font-extrabold text-[#4f9dff]">
															{a.order}.
														</span>
														{a.question}
													</p>
													<p className="mt-2 text-[0.8125rem] text-[#4a5875]">
														<span className="font-semibold text-[#64748b]">
															Хариулт:{" "}
														</span>
														{a.studentAnswer}
													</p>
													<p
														className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold tabular-nums text-white ${
															full
																? "bg-emerald-600"
																: none
																	? "bg-rose-600"
																	: "bg-amber-600"
														}`}
													>
														{a.pointsEarned} / {a.pointsMax}
													</p>
												</li>
											);
										})}
									</ul>
								) : (
									<p className="text-[0.875rem] text-[#64748b]">
										Асуулт бүрийн дэлгэрэнгүй алга.
									</p>
								)}
							</div>
						</details>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

function DownloadMenu({
	onExcel,
	onPdf,
	disabled,
	label = "Татах",
}: {
	onExcel: () => void;
	onPdf: () => void;
	disabled?: boolean;
	label?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleOutside = (event: MouseEvent) => {
			if (!menuRef.current) return;
			if (!menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutside);
		return () => document.removeEventListener("mousedown", handleOutside);
	}, []);

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				disabled={disabled}
				aria-expanded={isOpen}
				aria-haspopup="menu"
				onClick={() => setIsOpen((prev) => !prev)}
				className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#4f9dff] px-4 py-2.5 text-3 font-semibold text-white shadow-sm transition hover:bg-[#3f8ff5] disabled:cursor-not-allowed disabled:opacity-50 sm:text-4"
			>
				<Download className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
				{label}
			</button>

			{isOpen ? (
				<div
					className="absolute right-0 z-20 mt-2 min-w-40 rounded-xl border border-[#d9dee8] bg-white p-1 shadow-md"
					role="menu"
				>
					<button
						type="button"
						role="menuitem"
						onClick={() => {
							onExcel();
							setIsOpen(false);
						}}
						className="w-full rounded-lg px-3 py-2 text-left text-3 font-semibold text-[#1f2a44] hover:bg-[#f1f6ff]"
					>
						Excel татах
					</button>
					<button
						type="button"
						role="menuitem"
						onClick={() => {
							onPdf();
							setIsOpen(false);
						}}
						className="w-full rounded-lg px-3 py-2 text-left text-3 font-semibold text-[#1f2a44] hover:bg-[#f1f6ff]"
					>
						PDF татах
					</button>
				</div>
			) : null}
		</div>
	);
}

export default function TeacherClassDetail({ classId }: { classId: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const studentNumber = searchParams.get("student");
	const teacher = useTeacher();

	const cls = useMemo(() => store.getClass(classId), [classId]);
	const canAccess = useMemo(
		() =>
			store
				.getClassesForTeacherWithDemo(teacher.id)
				.some((c) => c.id === classId),
		[teacher.id, classId],
	);

	const students = useMemo(() => {
		if (!canAccess || !cls) return [];
		return store.listStudentsInClass(classId);
	}, [classId, canAccess, cls]);

	const pastExams = useMemo(
		() => (canAccess && cls ? getPastExamsForClass(classId, students) : []),
		[classId, canAccess, cls, students],
	);

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [activeView, setActiveView] = useState<ClassView>("students");
	const [historyQuery, setHistoryQuery] = useState("");
	const [expandedPastExamId, setExpandedPastExamId] = useState<string | null>(
		null,
	);
	const [examStudentPopover, setExamStudentPopover] = useState<{
		examId: string;
		studentId: string;
	} | null>(null);

	const selectedStudentExams = useMemo(() => {
		if (!selectedId) return [];
		const items: Array<{ exam: PastExamRow; score: PastExamStudentScore }> =
			[];
		for (const exam of pastExams) {
			const score = exam.studentScores.find((s) => s.studentId === selectedId);
			if (score) items.push({ exam, score });
		}
		return items.sort((a, b) => b.exam.date.localeCompare(a.exam.date));
	}, [pastExams, selectedId]);

	const filteredPastExams = useMemo(() => {
		const q = historyQuery.trim().toLowerCase();
		if (!q) return pastExams;
		return pastExams.filter((e) => {
			if (
				e.subject.toLowerCase().includes(q) ||
				e.examTitle.toLowerCase().includes(q) ||
				e.date.toLowerCase().includes(q) ||
				`${e.maxScore}`.includes(q)
			) {
				return true;
			}
			return e.studentScores.some(
				(s) =>
					s.studentNumber.toLowerCase().includes(q) ||
					`${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
					`${s.lastName} ${s.firstName}`.toLowerCase().includes(q),
			);
		});
	}, [pastExams, historyQuery]);

	const examStudentPopoverResolved = useMemo(() => {
		if (!examStudentPopover) return null;
		const exam = filteredPastExams.find(
			(e) => e.id === examStudentPopover.examId,
		);
		const student = exam?.studentScores.find(
			(s) => s.studentId === examStudentPopover.studentId,
		);
		if (!exam || !student) return null;
		return {
			exam,
			student,
		};
	}, [examStudentPopover, filteredPastExams]);

	const classTotal = students.length;

	const classPath = `/teacher/class/${encodeURIComponent(classId)}`;

	if (!canAccess || !cls) {
		return (
			<section className="px-4 py-10 sm:px-10">
				<div className="mx-auto max-w-lg rounded-2xl border border-[#d9dee8] bg-white p-8 text-center shadow-sm">
					<p className="text-4 font-semibold text-[#475569]">
						Энэ ангид хандах эрхгүй эсвэл анги олдсонгүй.
					</p>
					<button
						type="button"
						onClick={() => router.push("/teacher")}
						className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4f9dff] px-5 py-2.5 text-4 font-semibold text-white transition hover:bg-[#3f8ff5]"
					>
						<ArrowLeft className="h-5 w-5" />
						Нүүр хуудас
					</button>
				</div>
			</section>
		);
	}

	if (studentNumber) {
		return (
			<ReviewScreen
				studentCode={studentNumber}
				onBack={() => router.push(classPath)}
			/>
		);
	}

	return (
		<section className="px-4 py-10 sm:px-10">
			<div className="mx-auto max-w-6xl space-y-6">
				<div className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
					<button
						type="button"
						onClick={() => router.push("/teacher")}
						className="inline-flex items-center gap-2 text-4 font-semibold text-[#2f3c59] transition-colors hover:text-[#4f9dff]"
					>
						<ArrowLeft className="h-5 w-5" />
						Нүүр хуудас руу буцах
					</button>

					<div className="mt-6 flex items-start gap-4">
						<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-[#4f9dff]">
							<Users className="h-7 w-7" />
						</div>
						<div>
							<h1 className="text-5 font-extrabold text-[#1f2a44]">
								{cls.name}
							</h1>
							<p className="mt-2 text-3 text-[#66789f]">
								Сурагчид, шалгалтын статистик хайх.
							</p>
						</div>
					</div>
				</div>

				<div
					className="flex flex-wrap justify-center gap-6 rounded-2xl border border-[#d9dee8] bg-white p-2 shadow-sm"
					role="tablist"
					aria-label="Ангийн хэсгүүд"
				>
					<button
						type="button"
						role="tab"
						aria-selected={activeView === "students"}
						onClick={() => {
							setExamStudentPopover(null);
							setActiveView("students");
						}}
						className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[200px] ${
							activeView === "students"
								? "bg-[#4f9dff] text-white shadow-sm"
								: "bg-transparent text-[#2f3c59] hover:bg-[#f6faff] hover:text-[#4f9dff]"
						}`}
					>
						<Users
							className={`h-5 w-5 shrink-0 ${activeView === "students" ? "text-white" : "text-[#4f9dff]"}`}
						/>
						Сурагчид
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={activeView === "history"}
						onClick={() => setActiveView("history")}
						className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[200px] ${
							activeView === "history"
								? "bg-[#4f9dff] text-white shadow-sm"
								: "bg-transparent text-[#2f3c59] hover:bg-[#f6faff] hover:text-[#4f9dff]"
						}`}
					>
						<BarChart3
							className={`h-5 w-5 shrink-0 ${activeView === "history" ? "text-white" : "text-[#4f9dff]"}`}
						/>
						Шалгалтын статистик
					</button>
				</div>

				{activeView === "students" ? (
					<div className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div className="min-w-0">
								<h2 className="flex items-center gap-2 text-5 font-extrabold text-[#1f2a44]">
									<Users className="h-6 w-6 shrink-0 text-[#4f9dff]" />
									Сурагчид
								</h2>
								<p className="mt-2 text-4 text-[#64748b]">
									Мөр дарахад нэрний доор өмнөх шалгалтын дүн нээгдэнэ. Дахин
									дарахад хаагдана.
								</p>
							</div>
							<DownloadMenu
								onExcel={() => downloadStudentListXls(cls.name, students)}
								onPdf={() => downloadStudentListPdf(cls.name, students)}
							/>
						</div>

						{!selectedId ? (
							<div className="mt-5 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-6 text-center text-4 text-[#64748b]">
								Сурагч сонгоогүй байна. Доорх хүснэгтээс мөр дараарай.
								<p className="mt-2 font-semibold text-[#334261]">
									Ангид одоогоор {classTotal} сурагч байна.
								</p>
							</div>
						) : null}

						<div className="mt-6 overflow-x-auto rounded-xl border border-[#e2e8f0]">
							<table className="w-full min-w-[320px]">
								<thead>
									<tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
										<th className="px-4 py-3 text-left text-4 font-semibold text-[#64748b]">
											№ / Нэр
										</th>
									</tr>
								</thead>
								<tbody>
									{students.map((student, index) => {
										const open = selectedId === student.id;
										return (
											<Fragment key={student.id}>
												<tr
													role="button"
													tabIndex={0}
													aria-expanded={open}
													onClick={() =>
														setSelectedId((cur) =>
															cur === student.id ? null : student.id,
														)
													}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															setSelectedId((cur) =>
																cur === student.id ? null : student.id,
															);
														}
													}}
													className={`cursor-pointer border-b border-[#f1f5f9] transition hover:bg-[#f6faff] ${
														open
															? "bg-[#edf4ff]/90 ring-1 ring-inset ring-[#4f9dff]/35"
															: ""
													}`}
												>
													<td className="px-4 py-3 text-[#1f2a44]">
														<div className="flex items-start gap-3">
															<ChevronDown
																className={`mt-1 h-4 w-4 shrink-0 text-[#4f9dff] transition-transform ${open ? "rotate-180" : ""}`}
																aria-hidden
															/>
															<span className="mt-0.5 w-8 shrink-0 text-4 font-semibold text-[#64748b]">
																{index + 1}.
															</span>
															<div className="min-w-0 flex-1">
																<p className="text-4 font-semibold text-[#1f2a44]">
																	{student.firstName} {student.lastName}
																</p>
																<p className="mt-1 text-3 text-[#7b8aa3]">
																	{`${student.studentNumber.toLowerCase()}@gmail.com`}
																</p>
															</div>
														</div>
													</td>
												</tr>
												{open ? (
													<tr className="border-b border-[#e2e8f0] bg-[#fafbfd]">
														<td className="p-0 align-top">
															<StudentClassExamResultsPanel
																classLabel={cls.name}
																examRows={selectedStudentExams}
																placement="underRow"
																student={student}
															/>
														</td>
													</tr>
												) : null}
											</Fragment>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				) : (
					<div className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
						<div className="min-w-0">
							<h2 className="flex items-center gap-2 text-5 font-extrabold text-[#1f2a44]">
								<BarChart3 className="h-6 w-6 shrink-0 text-[#4f9dff]" />
								Шалгалтын статистик
							</h2>
							<p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-[#64748b] sm:text-base">
								Хичээл, шалгалт, огноо, дүн эсвэл сурагчийн нэрээр хайна уу. Мөр
								дарахад ангийн үнэлгээ, хамгийн олон сурагч алдсан асуулт, сурагчдын
								жагсаалт нэг дор нээгдэнэ. Сурагчийн мөр дээр дарахад тухайн
								шалгалтын дэлгэрэнгүй цонх гарна.
							</p>
						</div>

						<div className="relative mt-6">
							<Search
								className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a96ac]"
								aria-hidden
							/>
							<input
								type="search"
								value={historyQuery}
								onChange={(e) => {
									setExamStudentPopover(null);
									setHistoryQuery(e.target.value);
								}}
								placeholder="Хайх: хичээл, шалгалт, огноо, сурагч…"
								className="w-full rounded-2xl border border-[#d9dee8] bg-[#fafbfd] py-3.5 pl-11 pr-4 text-[0.9375rem] text-[#1f2a44] shadow-inner outline-none transition placeholder:text-[#94a3b8] focus:border-[#4f9dff] focus:bg-white focus:ring-4 focus:ring-[#4f9dff]/15 sm:text-base"
								aria-label="Шалгалтын статистик хайх"
							/>
						</div>

						{filteredPastExams.length === 0 ? (
							<div className="mt-6 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-10 text-center text-4 text-[#64748b]">
								{historyQuery.trim()
									? "Хайлтад тохирох шалгалт олдсонгүй."
									: "Энэ ангийн шалгалтын статистик одоогоор алга."}
							</div>
						) : (
							<div className="mt-6 overflow-x-auto rounded-2xl border border-[#e2e8f0] shadow-sm">
								<table className="w-full min-w-[520px]">
									<thead>
										<tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
											<th
												className="w-10 px-2 py-3.5 text-left text-[0.8125rem] font-semibold text-[#64748b] sm:text-sm"
												aria-label="Дэлгэрэнгүй"
											/>
											<th className="px-4 py-3.5 text-left text-[0.8125rem] font-semibold text-[#64748b] sm:text-sm">
												Огноо
											</th>
											<th className="px-4 py-3.5 text-left text-[0.8125rem] font-semibold text-[#64748b] sm:text-sm">
												Хичээл
											</th>
											<th className="px-4 py-3.5 text-left text-[0.8125rem] font-semibold text-[#64748b] sm:text-sm">
												Шалгалт
											</th>
											<th className="px-4 py-3.5 text-right text-[0.8125rem] font-semibold text-[#64748b] sm:text-sm">
												Тэнцсэн
											</th>
											<th
												className="w-[1%] whitespace-nowrap px-3 py-3.5 text-center text-[0.8125rem] font-semibold text-[#64748b] sm:text-sm"
												aria-label="Тайлан татах багана"
											>
												Татах
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredPastExams.map((row) => {
											const open = expandedPastExamId === row.id;
											return (
												<Fragment key={row.id}>
													<tr
														role="button"
														tabIndex={0}
														onClick={() =>
															setExpandedPastExamId((id) => {
																if (id === row.id) {
																	setExamStudentPopover((p) =>
																		p?.examId === row.id ? null : p,
																	);
																	return null;
																}
																setExamStudentPopover(null);
																return row.id;
															})
														}
														onKeyDown={(ev) => {
															if (ev.key !== "Enter" && ev.key !== " ") return;
															ev.preventDefault();
															setExpandedPastExamId((id) => {
																if (id === row.id) {
																	setExamStudentPopover((p) =>
																		p?.examId === row.id ? null : p,
																	);
																	return null;
																}
																setExamStudentPopover(null);
																return row.id;
															});
														}}
														className={`cursor-pointer border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f0f7ff] ${
															open ? "bg-[#eef4ff]/50" : ""
														}`}
													>
														<td className="px-2 py-3.5 text-[#4f9dff]">
															{open ? (
																<ChevronUp className="h-5 w-5" aria-hidden />
															) : (
																<ChevronDown className="h-5 w-5" aria-hidden />
															)}
														</td>
														<td className="whitespace-nowrap px-4 py-3.5 text-[0.9375rem] font-semibold text-[#1f2a44]">
															{row.date}
														</td>
														<td className="px-4 py-3.5 text-[0.9375rem] text-[#334261]">
															{row.subject}
														</td>
														<td className="max-w-[min(280px,40vw)] px-4 py-3.5 text-[0.9375rem] leading-snug text-[#334261]">
															{row.examTitle}
														</td>
														<td className="whitespace-nowrap px-4 py-3.5 text-right text-[0.9375rem] tabular-nums text-[#4a5875]">
															{row.passed} / {row.total}
														</td>
														<td className="px-3 py-3.5 text-center">
															<button
																type="button"
																title="Ангийн бүрэн статистик татах — асуулт бүрээр, тэнцэлт, сурагч бүр"
																aria-label={`Бүрэн статистик татах: ${row.examTitle}`}
																onClick={(e) => {
																	e.stopPropagation();
																	downloadFullExamStatisticsXls(cls.name, row);
																}}
																className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#c8d6ea] bg-white text-[#4f9dff] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff] focus-visible:outline focus-visible:ring-4 focus-visible:ring-[#4f9dff]/20"
															>
																<Download
																	className="h-4 w-4 shrink-0"
																	aria-hidden
																/>
															</button>
														</td>
													</tr>
													{open ? (
														<tr className="border-b border-[#e2e8f0] bg-[#f1f5f9]/40">
															<td colSpan={6} className="px-3 py-5 sm:px-5 sm:py-6">
																<div className="rounded-2xl border border-[#e2e8f0] bg-gradient-to-b from-white via-[#fafbfd] to-[#f4f7fc] p-4 shadow-[0_4px_32px_rgba(15,23,42,0.06)] sm:p-6 md:p-8">
																	<div className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
																		<PastExamClassGradeChart row={row} />
																		<PastExamMostFailedInsight row={row} />
																	</div>

																	<div className="mt-8 border-t border-[#e2e8f0] pt-8">
																		<div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
																			<div>
																				<h4 className="text-lg font-extrabold tracking-tight text-[#0f172a] sm:text-xl">
																					Сурагч бүрийн оноо
																				</h4>
																				<p className="mt-1 max-w-prose text-[0.875rem] leading-relaxed text-[#64748b]">
																					Мөр дарахад сурагчийн асуулт бүрийн дэлгэрэнгүй
																					гарна. Дээд оноо:{" "}
																					<span className="font-semibold tabular-nums text-[#334261]">
																						{row.maxScore}
																					</span>
																					.
																				</p>
																			</div>
																		</div>
																		{row.studentScores.length === 0 ? (
																			<p className="rounded-xl border border-dashed border-[#cbd5e1] bg-white/80 px-4 py-8 text-center text-[0.9375rem] text-[#64748b]">
																				Энэ ангид сурагч алга.
																			</p>
																		) : (
																			<div className="max-h-[min(28rem,55vh)] overflow-auto rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
																				<table className="w-full min-w-[320px] text-left text-[0.9375rem]">
																					<thead className="sticky top-0 z-10 border-b border-[#e2e8f0] bg-[#f8fafc] shadow-[0_1px_0_#e2e8f0]">
																						<tr>
																							<th className="px-4 py-3.5 font-semibold text-[#475569] sm:px-5">
																								Овог, нэр
																							</th>
																							<th className="px-4 py-3.5 text-right font-semibold text-[#475569] sm:px-5">
																								Оноо
																							</th>
																							<th className="w-[1%] whitespace-nowrap px-4 py-3.5 text-right font-semibold text-[#475569] sm:px-5">
																								Татах
																							</th>
																						</tr>
																					</thead>
																					<tbody className="divide-y divide-[#f1f5f9]">
																						{sortPastExamStudents(
																							row.studentScores,
																						).map((s) => (
																							<tr
																								key={s.studentId}
																								role="button"
																								tabIndex={0}
																								aria-expanded={
																									examStudentPopoverResolved
																										?.exam.id === row.id &&
																									examStudentPopoverResolved
																										?.student
																										.studentId ===
																										s.studentId
																								}
																								aria-label={`${s.lastName} ${s.firstName} — шалгалтын статистик`}
																								onKeyDown={(e) => {
																									if (
																										e.key !== "Enter" &&
																										e.key !== " "
																									) {
																										return;
																									}
																									e.preventDefault();
																									e.stopPropagation();
																									setExamStudentPopover(
																										(cur) =>
																											cur?.examId ===
																												row.id &&
																											cur?.studentId ===
																												s.studentId
																												? null
																												: {
																														examId: row.id,
																														studentId:
																															s.studentId,
																													},
																									);
																								}}
																								onClick={(e) => {
																									if (
																										(
																											e.target as HTMLElement
																										).closest("button")
																									) {
																										return;
																									}
																									e.stopPropagation();
																									setExamStudentPopover(
																										(cur) =>
																											cur?.examId ===
																												row.id &&
																											cur?.studentId ===
																												s.studentId
																												? null
																												: {
																														examId: row.id,
																														studentId:
																															s.studentId,
																													},
																									);
																								}}
																								className={`cursor-pointer transition-colors hover:bg-[#f0f7ff] ${
																									examStudentPopoverResolved
																										?.exam.id === row.id &&
																									examStudentPopoverResolved
																										?.student
																										.studentId ===
																										s.studentId
																										? "bg-[#e8f2ff]"
																										: ""
																								}`}
																							>
																								<td className="px-4 py-3.5 font-medium text-[#334261] sm:px-5 sm:py-4">
																									<span className="leading-snug">
																										{s.lastName}{" "}
																										{s.firstName}
																									</span>
																								</td>
																								<td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5 sm:py-4">
																									<span className="text-[1.0625rem] font-bold tabular-nums text-[#0f172a]">
																										{s.score}
																									</span>
																									<span className="ml-1 text-[0.875rem] font-normal tabular-nums text-[#94a3b8]">
																										/ {row.maxScore}
																									</span>
																								</td>
																								<td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5 sm:py-4">
																									<button
																										type="button"
																										className="inline-flex items-center justify-center rounded-xl border border-[#c8d6ea] bg-white p-2.5 text-[#4f9dff] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff]"
																										title="Excel татах"
																										aria-label={`Excel татах — ${s.lastName} ${s.firstName}`}
																										onClick={(e) => {
																											e.stopPropagation();
																											downloadSingleStudentPastExamXls(
																												cls.name,
																												row,
																												s,
																											);
																										}}
																									>
																										<Download
																											className="h-4 w-4 shrink-0"
																											aria-hidden
																										/>
																									</button>
																								</td>
																							</tr>
																						))}
																					</tbody>
																				</table>
																			</div>
																		)}
																	</div>
																</div>
															</td>
														</tr>
													) : null}
												</Fragment>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}
			</div>

			{examStudentPopoverResolved ? (
				<PastExamStudentStatPopover
					classLabel={cls.name}
					exam={examStudentPopoverResolved.exam}
					student={examStudentPopoverResolved.student}
					onClose={() => setExamStudentPopover(null)}
				/>
			) : null}
		</section>
	);
}
