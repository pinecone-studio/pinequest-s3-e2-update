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
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { getPastExamsForClass } from "@/app/lib/class-past-exams-mock";
import { store } from "@/app/lib/store";
import { TEACHER_DEMO_CLASS_ID } from "@/app/lib/teacher-demo-class";
import type { Student } from "@/app/lib/types";
import ReviewScreen from "./review-screen";
import { useTeacher } from "../teacher-shell";

type ClassView = "students" | "stats";

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

function downloadStudentListXls(className: string, students: Student[]) {
	const rows = students
		.map(
			(s, i) =>
				`<tr><td>${i + 1}</td><td>${escapeHtml(`${s.firstName} ${s.lastName}`)}</td></tr>`,
		)
		.join("");
	const table = `
    <table border="1">
      <tr><th colspan="2">Анги: ${escapeHtml(className)}</th></tr>
      <tr><th>№</th><th>Овог нэр</th></tr>
      ${rows}
    </table>`;
	triggerExcelDownload(`${sanitizeFilename(className)}-suragchid.xls`, table);
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

type PastExamRowData = ReturnType<typeof getPastExamsForClass>[number];

/** Нэг шалгалт + нэг сурагчийн бүтэн асуулт-хариулт-оноо */
function ExactExamStudentBreakdown({
	exam,
	studentScore,
}: {
	exam: PastExamRowData;
	studentScore: PastExamRowData["studentScores"][number];
}) {
	const pct =
		exam.maxScore > 0 ? (studentScore.score / exam.maxScore) * 100 : 0;
	return (
		<div className="space-y-5">
			<div className="rounded-xl border border-[#dbeafe] bg-[#f6faff] p-4">
				<p className="text-3 font-semibold text-[#64748b]">Нийт оноо</p>
				<p className="mt-1 text-5 font-extrabold text-[#1f2a44]">
					{studentScore.score}
					<span className="text-4 font-bold text-[#94a3b8]">
						{" "}
						/ {exam.maxScore}
					</span>{" "}
					<span className="text-3 font-semibold text-[#64748b]">
						({Math.round(pct)}%)
					</span>
				</p>
				<div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
					<div
						className={`h-full rounded-full ${studentScore.passed ? "bg-[#26a69a]" : "bg-amber-400"}`}
						style={{ width: `${Math.min(100, Math.round(pct))}%` }}
					/>
				</div>
			</div>
			<p className="text-3 font-bold text-[#334261]">
				Асуулт, сурагчийн хариулт, оноо
			</p>
			{studentScore.attempts.length === 0 ? (
				<p className="text-3 text-[#64748b]">
					Асуултын дэлгэрэнгүй одоогоор алга.
				</p>
			) : (
				<ol className="list-decimal space-y-4 pl-4 text-3 marker:font-semibold marker:text-[#64748b]">
					{studentScore.attempts.map((a) => (
						<li key={a.order} className="text-[#334261]">
							<p className="font-semibold leading-snug text-[#1f2a44]">
								{a.question}
							</p>
							<p className="mt-2 border-l-2 border-[#c8d6ea] pl-3 text-[#475569]">
								<span className="font-semibold text-[#64748b]">
									Сурагчийн хариулт:
								</span>{" "}
								{a.studentAnswer}
							</p>
							<p className="mt-2 font-bold text-[#4f9dff]">
								Оноо: {a.pointsEarned} / {a.pointsMax}
							</p>
						</li>
					))}
				</ol>
			)}
		</div>
	);
}

function downloadSingleStudentPastExamXls(
	className: string,
	exam: PastExamRowData,
	student: PastExamRowData["studentScores"][number],
) {
	const detailRows = student.attempts
		.map(
			(a) =>
				`<tr><td>${a.order}</td><td>${escapeHtml(a.question)}</td><td>${escapeHtml(a.studentAnswer)}</td><td>${a.pointsEarned}/${a.pointsMax}</td></tr>`,
		)
		.join("");
	const detailTable =
		detailRows.length === 0
			? ""
			: `
    <table border="1" style="margin-top:12px">
      <tr><th colspan="4">Асуулт, хариулт, оноо</th></tr>
      <tr><th>№</th><th>Асуулт</th><th>Сурагчийн хариулт</th><th>Оноо</th></tr>
      ${detailRows}
    </table>`;
	const table = `
    <table border="1">
      <tr><th colspan="2">Шалгалтын дүн — ${escapeHtml(className)}</th></tr>
      <tr><td>Огноо</td><td>${escapeHtml(exam.date)}</td></tr>
      <tr><td>Хичээл</td><td>${escapeHtml(exam.subject)}</td></tr>
      <tr><td>Шалгалт</td><td>${escapeHtml(exam.examTitle)}</td></tr>
      <tr><td>Овог, нэр</td><td>${escapeHtml(`${student.lastName} ${student.firstName}`)}</td></tr>
      <tr><td>Нийт оноо</td><td>${student.score} / ${exam.maxScore}</td></tr>
    </table>
    ${detailTable}`;
	const base = `${className}-${exam.date}-${student.lastName}_${student.firstName}`;
	triggerExcelDownload(`${sanitizeFilename(base)}-dun.xls`, table);
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

	const [activeView, setActiveView] = useState<ClassView>("students");
	const [historyQuery, setHistoryQuery] = useState("");
	const [expandedPastExamId, setExpandedPastExamId] = useState<string | null>(
		null,
	);
	const [statsGraphStudentId, setStatsGraphStudentId] = useState<string | null>(
		null,
	);
	const [statsGraphExamId, setStatsGraphExamId] = useState<string | null>(null);

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

	const statsGraphStudent = useMemo(
		() =>
			statsGraphStudentId
				? (students.find((s) => s.id === statsGraphStudentId) ?? null)
				: null,
		[students, statsGraphStudentId],
	);

	const statsExamDetailContext = useMemo(() => {
		if (!statsGraphStudentId || !statsGraphExamId) return null;
		const exam = pastExams.find((e) => e.id === statsGraphExamId);
		if (!exam) return null;
		const studentScore = exam.studentScores.find(
			(s) => s.studentId === statsGraphStudentId,
		);
		if (!studentScore) return null;
		return { exam, studentScore };
	}, [pastExams, statsGraphStudentId, statsGraphExamId]);

	const closeStatsExamPopover = useCallback(() => {
		setStatsGraphStudentId(null);
		setStatsGraphExamId(null);
	}, []);

	const classPath = `/teacher/class/${encodeURIComponent(classId)}`;

	useEffect(() => {
		if (activeView !== "stats") {
			setStatsGraphStudentId(null);
			setStatsGraphExamId(null);
		}
	}, [activeView]);

	useEffect(() => {
		if (activeView !== "stats" || !statsGraphStudentId || !statsGraphExamId)
			return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeStatsExamPopover();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		activeView,
		statsGraphStudentId,
		statsGraphExamId,
		closeStatsExamPopover,
	]);

	useEffect(() => {
		if (activeView !== "stats" || !statsGraphStudentId || !statsGraphExamId)
			return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [activeView, statsGraphStudentId, statsGraphExamId]);

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

	const isDemoClass = cls.id === TEACHER_DEMO_CLASS_ID;

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
								Сурагчид, өмнөх шалгалтын статистик.
								{isDemoClass ? " (Жишээ анги.)" : ""}
							</p>
						</div>
					</div>
				</div>

				<div
					className="flex flex-wrap gap-2 rounded-2xl border border-[#d9dee8] bg-white p-2 shadow-sm"
					role="tablist"
					aria-label="Ангийн хэсгүүд"
				>
					<button
						type="button"
						role="tab"
						aria-selected={activeView === "students"}
						onClick={() => setActiveView("students")}
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
						aria-selected={activeView === "stats"}
						onClick={() => setActiveView("stats")}
						className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[220px] ${
							activeView === "stats"
								? "bg-[#4f9dff] text-white shadow-sm"
								: "bg-transparent text-[#2f3c59] hover:bg-[#f6faff] hover:text-[#4f9dff]"
						}`}
					>
						<BarChart3
							className={`h-5 w-5 shrink-0 ${activeView === "stats" ? "text-white" : "text-[#4f9dff]"}`}
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
									«Үр дүн» дараад сурагчийн дэлгэрэнгүй хуудас руу орно.
								</p>
							</div>
							<button
								type="button"
								onClick={() => downloadStudentListXls(cls.name, students)}
								className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#4f9dff] px-4 py-2.5 text-3 font-semibold text-white shadow-sm transition hover:bg-[#3f8ff5] sm:text-4"
							>
								<Download className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
								Татах
							</button>
						</div>

						<div className="mt-6 overflow-x-auto rounded-xl border border-[#e2e8f0]">
							<table className="w-full min-w-[320px]">
								<thead>
									<tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
										<th className="px-4 py-3 text-left text-4 font-semibold text-[#64748b]">
											Нэр
										</th>
										<th className="px-4 py-3 text-right text-4 font-semibold text-[#64748b]">
											Дэлгэрэнгүй
										</th>
									</tr>
								</thead>
								<tbody>
									{students.map((student) => (
										<tr
											key={student.id}
											className="border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f6faff]"
										>
											<td className="px-4 py-3 text-4 font-semibold text-[#1f2a44]">
												{student.firstName} {student.lastName}
											</td>
											<td className="px-4 py-3 text-right">
												<button
													type="button"
													onClick={() =>
														router.push(
															`${classPath}?student=${encodeURIComponent(student.studentNumber)}`,
														)
													}
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
								Шалгалтыг дэлгээд сурагчийн мөр дарахад зөвхөн тэр шалгалтын
								асуулт, тухайн сурагчийн хариулт, оноо цонхонд гарна. Хүснэгтэд
								хайлт хийнэ.
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
								onChange={(e) => setHistoryQuery(e.target.value)}
								placeholder="Хайх: хичээл, шалгалт, огноо, сурагч…"
								className="w-full rounded-xl border border-[#d9dee8] bg-[#fafbfd] py-3 pl-11 pr-4 text-4 text-[#1f2a44] shadow-inner outline-none transition placeholder:text-[#94a3b8] focus:border-[#4f9dff] focus:bg-white focus:ring-4 focus:ring-[#4f9dff]/15"
								aria-label="Өмнөх шалгалт хайх"
							/>
						</div>

						<p className="mt-4 text-3 text-[#94a3b8]">
							Дэлгэрэнгүй харахын тулд нэг шалгалтыг дэлгээд сурагчийн мөр дарна
							уу.
						</p>

						{filteredPastExams.length === 0 ? (
							<div className="mt-6 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-10 text-center text-4 text-[#64748b]">
								{historyQuery.trim()
									? "Хайлтад тохирох шалгалт олдсонгүй."
									: "Энэ ангийн өмнөх шалгалтын мэдээлэл одоогоор алга."}
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
															setExpandedPastExamId((id) =>
																id === row.id ? null : row.id,
															)
														}
														onKeyDown={(ev) => {
															if (ev.key !== "Enter" && ev.key !== " ") return;
															ev.preventDefault();
															setExpandedPastExamId((id) =>
																id === row.id ? null : row.id,
															);
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
																						onClick={() => {
																							setStatsGraphStudentId(
																								s.studentId,
																							);
																							setStatsGraphExamId(row.id);
																						}}
																						onKeyDown={(ev) => {
																							if (
																								ev.key !== "Enter" &&
																								ev.key !== " "
																							)
																								return;
																							ev.preventDefault();
																							setStatsGraphStudentId(
																								s.studentId,
																							);
																							setStatsGraphExamId(row.id);
																						}}
																						className={`cursor-pointer border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f0f7ff] ${
																							statsGraphStudentId ===
																								s.studentId &&
																							statsGraphExamId === row.id
																								? "bg-[#edf4ff]/90 ring-1 ring-inset ring-[#4f9dff]/30"
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
																								onClick={(e) => {
																									e.stopPropagation();
																									downloadSingleStudentPastExamXls(
																										cls.name,
																										row,
																										s,
																									);
																								}}
																								className="inline-flex items-center gap-1.5 rounded-lg border border-[#c8d6ea] bg-white px-2.5 py-1.5 text-3 font-semibold text-[#4f9dff] transition hover:bg-[#f6faff] hover:border-[#4f9dff]"
																							>
																								<Download className="h-3.5 w-3.5 shrink-0" />
																								Татах
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

			{activeView === "stats" && statsGraphStudent && statsExamDetailContext ? (
				<div
					className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
					role="dialog"
					aria-modal="true"
					aria-labelledby="exam-student-detail-title"
				>
					<button
						type="button"
						className="absolute inset-0 bg-[#1f2a44]/45 backdrop-blur-[1px]"
						aria-label="Хаах"
						onClick={closeStatsExamPopover}
					/>
					<div className="relative z-10 flex max-h-[min(90vh,860px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#d9dee8] bg-white shadow-2xl">
						<div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#e8ecf2] px-5 py-4">
							<div className="min-w-0">
								<h3
									id="exam-student-detail-title"
									className="text-4 font-extrabold leading-snug text-[#1f2a44] sm:text-5"
								>
									{statsExamDetailContext.exam.examTitle}
								</h3>
								<p className="mt-1 text-3 text-[#64748b]">
									{statsExamDetailContext.exam.date} ·{" "}
									{statsExamDetailContext.exam.subject}
								</p>
								<p className="mt-2 text-4 font-bold text-[#334261]">
									{statsGraphStudent.lastName} {statsGraphStudent.firstName}
								</p>
							</div>
							<button
								type="button"
								onClick={closeStatsExamPopover}
								className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] transition hover:border-[#4f9dff] hover:bg-white hover:text-[#4f9dff]"
								aria-label="Хаах"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
							<ExactExamStudentBreakdown
								exam={statsExamDetailContext.exam}
								studentScore={statsExamDetailContext.studentScore}
							/>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
