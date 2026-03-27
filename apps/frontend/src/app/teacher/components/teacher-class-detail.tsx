/** @format */

"use client";

import {
	ArrowLeft,
	BarChart3,
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

function PastExamClassGradeChart({ row }: { row: PastExamRow }) {
	const buckets = useMemo(() => pastExamGradeBuckets(row), [row]);
	const total = row.studentScores.length;
	if (total === 0) return null;

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
		<div className="mb-6 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm sm:p-5">
			<h3 className="text-4 font-extrabold text-[#1f2a44]">
				Ангийн үнэлгээ (A–F)
			</h3>
			<p className="mt-1 text-3 leading-normal text-[#64748b]">
				Нийт онооны хувиар: A — 90%+; B — 80%+; C — 70%+; D — 60%+; F — 60%-аас
				доош.
			</p>

			<div
				className="mt-4 flex h-10 w-full overflow-hidden rounded-xl ring-1 ring-[#e2e8f0]"
				role="img"
				aria-label={`Үнэлгээний хуваарилалт. ${ariaSummary}`}
			>
				{segments.map((s) => (
					<div
						key={s.grade}
						style={{
							width: `${s.pct}%`,
							backgroundColor: s.fill,
							minWidth: s.count > 0 ? "4px" : undefined,
						}}
						className="min-h-[2.5rem] transition-[width] duration-300"
						title={`${s.grade}: ${s.count} (${Math.round(s.pct)}%)`}
					/>
				))}
			</div>

			<ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-3">
				{LETTER_GRADE_ORDER.map((grade) => {
					const n = buckets[grade];
					const p = total > 0 ? Math.round((n / total) * 100) : 0;
					const { fill, labelMn } = LETTER_GRADE_STYLES[grade];
					return (
						<li
							key={grade}
							className="flex min-w-[8.5rem] items-center gap-2 font-medium text-[#334261]"
						>
							<span
								className="h-3.5 w-3.5 shrink-0 rounded-sm shadow-sm ring-1 ring-black/5"
								style={{ backgroundColor: fill }}
								aria-hidden
							/>
							<span className="font-extrabold tabular-nums text-[#1f2a44]">
								{grade}
							</span>
							<span className="text-[#64748b]">
								{n}{" "}
								<span className="tabular-nums text-[#94a3b8]">({p}%)</span>
							</span>
							<span className="sr-only">{labelMn}</span>
						</li>
					);
				})}
			</ul>
		</div>
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
				className="fixed left-1/2 top-1/2 z-[100] w-[min(calc(100vw-24px),720px)] max-h-[min(92vh,880px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[#d9dee8] bg-white shadow-2xl outline-none"
				role="dialog"
				aria-modal="true"
				aria-labelledby="student-exam-stat-popover-title"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-3 border-b border-[#e8ecf2] bg-[#f8fafc] px-5 py-4 sm:px-6 sm:py-5">
					<div className="min-w-0">
						<p
							id="student-exam-stat-popover-title"
							className="text-xl font-extrabold tracking-tight text-[#1f2a44] sm:text-2xl"
						>
							{student.lastName} {student.firstName}
						</p>
						<p className="mt-1.5 truncate text-4 text-[#64748b]">{classLabel}</p>
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
				<div className="max-h-[min(82vh,780px)] overflow-y-auto px-5 py-4 text-4 sm:px-6 sm:py-5">
					<p className="text-4 font-semibold uppercase tracking-wide text-[#4f9dff]">
						Шалгалтын статистик
					</p>
					<dl className="mt-4 space-y-3 text-[#334261]">
						<div className="flex justify-between gap-6">
							<dt className="shrink-0 text-[#64748b]">Огноо</dt>
							<dd className="text-right text-4 font-semibold">{exam.date}</dd>
						</div>
						<div className="flex justify-between gap-6">
							<dt className="shrink-0 text-[#64748b]">Хичээл</dt>
							<dd className="text-right text-4 font-semibold">{exam.subject}</dd>
						</div>
						<div className="flex justify-between gap-6">
							<dt className="shrink-0 text-[#64748b]">Шалгалт</dt>
							<dd className="text-right text-4 font-semibold">{exam.examTitle}</dd>
						</div>
						<div className="flex justify-between gap-6">
							<dt className="shrink-0 text-[#64748b]">Оноо</dt>
							<dd className="text-right text-4 font-semibold">
								{student.score}
								<span className="font-normal text-[#94a3b8]">
									{" "}
									/ {exam.maxScore}
								</span>
							</dd>
						</div>
						<div className="flex justify-between gap-6">
							<dt className="shrink-0 text-[#64748b]">Тэнцсэн</dt>
							<dd
								className={
									student.passed
										? "text-right text-4 font-semibold text-[#2f66b9]"
										: "text-right text-4 font-semibold text-[#b91c1c]"
								}
							>
								{student.passed ? "Тийм" : "Үгүй"}
							</dd>
						</div>
					</dl>

					{student.attempts?.length ? (
						<div className="mt-6 border-t border-[#e8ecf2] pt-5">
							<p className="text-4 font-bold text-[#334261]">Асуулт бүрээр</p>
							<ul className="mt-3 space-y-3">
								{student.attempts.map((a) => (
									<li
										key={a.order}
										className="rounded-xl border border-[#e4eaf5] bg-[#f9fbff] px-4 py-3.5 sm:px-5 sm:py-4"
									>
										<p className="text-4 font-semibold leading-relaxed text-[#1f2a44]">
											{a.order}. {a.question}
										</p>
										<p className="mt-2 text-4 text-[#4a5875]">
											Хариулт:{" "}
											<span className="font-medium text-[#334261]">
												{a.studentAnswer}
											</span>
										</p>
										<p className="mt-2 text-4 font-semibold text-[#4f9dff]">
											Оноо: {a.pointsEarned} / {a.pointsMax}
										</p>
									</li>
								))}
							</ul>
						</div>
					) : null}
				</div>
			</div>
		</>
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

	const filteredPastExams = useMemo(() => {
		const q = historyQuery.trim().toLowerCase();
		if (!q) return pastExams;
		return pastExams.filter((e) => {
			if (
				e.subject.toLowerCase().includes(q) ||
				e.examTitle.toLowerCase().includes(q) ||
				e.date.toLowerCase().includes(q) ||
				`${e.avgScore}`.includes(q)
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
									Мөр дарахад сонгогдоно. «Үр дүн» товчоор дэлгэрэнгүй руу орно.
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
										<th className="px-8 py-3 text-right text-4 font-semibold text-[#64748b]">
											Дэлгэрэнгүй
										</th>
									</tr>
								</thead>
								<tbody>
									{students.map((student, index) => (
										<tr
											key={student.id}
											role="button"
											tabIndex={0}
											onClick={() => setSelectedId(student.id)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													setSelectedId(student.id);
												}
											}}
											className={`cursor-pointer border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f6faff] ${
												selectedId === student.id
													? "bg-[#edf4ff]/90 ring-1 ring-inset ring-[#4f9dff]/35"
													: ""
											}`}
										>
											<td className="px-4 py-3 text-[#1f2a44]">
												<div className="flex items-start gap-3">
													<span className="mt-0.5 w-8 shrink-0 text-4 font-semibold text-[#64748b]">
														{index + 1}.
													</span>
													<div>
														<p className="text-4 font-semibold text-[#1f2a44]">
															{student.firstName} {student.lastName}
														</p>
														<p className="mt-1 text-3 text-[#7b8aa3]">
															{student.studentNumber.toLowerCase()}@gmail.com
														</p>
													</div>
												</div>
											</td>
											<td className="px-8 py-3 text-right">
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														setSelectedId(student.id);
														router.push(
															`${classPath}?student=${encodeURIComponent(student.studentNumber)}`,
														);
													}}
													className="text-4 font-semibold text-[#4f9dff] transition-colors hover:text-[#3f8ff5] hover:underline"
												>
													Үр дүн
												</button>
											</td>
										</tr>
									))}
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
							<p className="mt-2 text-4 text-[#64748b]">
								Хичээл, шалгалт, огноо, дүн эсвэл сурагчийн нэрээр хайна уу.
								Шалгалтын мөр дарахад A–F үнэлгээний график болон сурагчдын жагсаалт
								гарна; сурагчийн мөр дарахад тухайн шалгалтын статистик цонх нээгдэнэ.
							</p>
						</div>

						<div className="relative mt-5">
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
								className="w-full rounded-xl border border-[#d9dee8] bg-[#fafbfd] py-3 pl-11 pr-4 text-4 text-[#1f2a44] shadow-inner outline-none transition placeholder:text-[#94a3b8] focus:border-[#4f9dff] focus:bg-white focus:ring-4 focus:ring-[#4f9dff]/15"
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
							<div className="mt-6 overflow-x-auto rounded-xl border border-[#e2e8f0]">
								<table className="w-full min-w-[560px]">
									<thead>
										<tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
											<th
												className="w-10 px-2 py-3 text-left text-4 font-semibold text-[#64748b]"
												aria-label="Дэлгэрэнгүй"
											/>
											<th className="px-4 py-3 text-left text-4 font-semibold text-[#64748b]">
												Огноо
											</th>
											<th className="px-4 py-3 text-left text-4 font-semibold text-[#64748b]">
												Хичээл
											</th>
											<th className="px-4 py-3 text-left text-4 font-semibold text-[#64748b]">
												Шалгалт
											</th>
											<th className="px-4 py-3 text-right text-4 font-semibold text-[#64748b]">
												Дундаж
											</th>
											<th className="px-4 py-3 text-right text-4 font-semibold text-[#64748b]">
												Тэнцсэн
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
														className="cursor-pointer border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f6faff]"
													>
														<td className="px-2 py-3 text-[#4f9dff]">
															{open ? (
																<ChevronUp className="h-5 w-5" aria-hidden />
															) : (
																<ChevronDown className="h-5 w-5" aria-hidden />
															)}
														</td>
														<td className="whitespace-nowrap px-4 py-3 text-4 font-semibold text-[#1f2a44]">
															{row.date}
														</td>
														<td className="px-4 py-3 text-4 text-[#334261]">
															{row.subject}
														</td>
														<td className="max-w-[220px] px-4 py-3 text-4 text-[#334261]">
															{row.examTitle}
														</td>
														<td className="whitespace-nowrap px-4 py-3 text-right text-4 font-semibold text-[#1f2a44]">
															{row.avgScore} / {row.maxScore}
														</td>
														<td className="whitespace-nowrap px-4 py-3 text-right text-4 text-[#4a5875]">
															{row.passed} / {row.total}
														</td>
													</tr>
													{open ? (
														<tr className="border-b border-[#e8ecf2] bg-[#fafbfd]">
															<td colSpan={6} className="px-4 py-4">
																<PastExamClassGradeChart row={row} />
																<p className="mb-3 text-3 font-bold text-[#334261]">
																	Сурагч бүрийн оноо (дээд {row.maxScore})
																</p>
																{row.studentScores.length === 0 ? (
																	<p className="text-4 text-[#64748b]">
																		Энэ ангид сурагч алга.
																	</p>
																) : (
																	<div className="overflow-x-auto rounded-lg border border-[#e2e8f0] bg-white">
																		<table className="w-full min-w-[320px] text-4">
																			<thead>
																				<tr className="border-b border-[#e2e8f0] bg-[#f1f5f9]">
																					<th className="px-3 py-2 text-left font-semibold text-[#64748b]">
																						Овог, нэр
																					</th>
																					<th className="px-3 py-2 text-right font-semibold text-[#64748b]">
																						Оноо
																					</th>
																					<th className="px-3 py-2 text-right font-semibold text-[#64748b]">
																						Татах
																					</th>
																				</tr>
																			</thead>
																			<tbody>
																				{sortPastExamStudents(
																					row.studentScores,
																				).map((s) => (
																					<tr
																						key={s.studentId}
																						role="button"
																						tabIndex={0}
																						aria-expanded={
																							examStudentPopoverResolved?.exam
																								.id === row.id &&
																							examStudentPopoverResolved
																								?.student.studentId ===
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
																							setExamStudentPopover((cur) =>
																								cur?.examId === row.id &&
																								cur?.studentId === s.studentId
																									? null
																									: {
																											examId: row.id,
																											studentId: s.studentId,
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
																							setExamStudentPopover((cur) =>
																								cur?.examId === row.id &&
																								cur?.studentId === s.studentId
																									? null
																									: {
																											examId: row.id,
																											studentId: s.studentId,
																										},
																							);
																						}}
																						className={`cursor-pointer border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f6faff] ${
																							examStudentPopoverResolved?.exam
																								.id === row.id &&
																							examStudentPopoverResolved
																								?.student.studentId ===
																								s.studentId
																								? "bg-[#edf4ff]/80"
																								: ""
																						}`}
																					>
																						<td className="px-3 py-2 text-[#334261]">
																							{s.lastName} {s.firstName}
																						</td>
																						<td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-[#1f2a44]">
																							{s.score}{" "}
																							<span className="font-normal text-[#94a3b8]">
																								/ {row.maxScore}
																							</span>
																						</td>
																						<td className="whitespace-nowrap px-3 py-2 text-right">
																							<button
																								type="button"
																								className="inline-flex items-center justify-center rounded-lg border border-[#c8d6ea] bg-white p-2 text-[#4f9dff] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff]"
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
