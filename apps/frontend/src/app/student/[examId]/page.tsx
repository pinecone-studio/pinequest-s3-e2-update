/** @format */

"use client";
import {
	GET_EXAM_BY_ID,
	GET_EXAM_QUESTION_ITEMS,
} from "@/graphql/typeDefs/queries";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ExamType = {
	id: string;
	grade: number;
	subjectId: string;
	topic: string;
	title: string;
	date: string;
	location: string;
	duration: string;
	variation: string;
	testIds: string[];
	openExerciseIds: string[];
	notes: string;
	score: number;
	usageCount: number;
	isActive: number;
	needpermission: number;
	schoolId: string;
	teacherId: string;
	createdAt: string;
	updatedAt: string;
};

type TestType = {
	id: string;
	grade: number;
	subjectId: string;
	question: string;
	answers: string[];
	rightAnswer: string;
	imageUrl: string | null;
	difficulty: string;
	score: number;
	usageCount: number;
	notes: string | null;
	teacherId: string;
	createdAt: string;
	updatedAt: string;
};

type OpenExerciesType = {
	id: string;
	subjectId: string;
	grade: number;
	topic: string | null;
	title: string | null;
	question: string | null;
	answer: string | null;
	imageUrl: string | null;
	difficulty: string | null;
	score: number;
	notes: string | null;
	teacherId: string | null;
	createdAt: string;
	updatedAt: string;
};

type ExamUiMcq = {
	kind: "mcq";
	sourceId: string;
	text: string;
	choices: string[];
};

type ExamUiOpen = {
	kind: "open";
	sourceId: string;
	title: string | null;
	text: string;
};

type ExamUiQuestion = ExamUiMcq | ExamUiOpen;

const CHOICE_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function choiceLabel(idx: number): string {
	return CHOICE_LABELS[idx] ?? String(idx + 1);
}

export default function StudentPage() {
	const params = useParams();
	const examId = params.examId as string;

	const [step, setStep] = useState<"info" | "exam" | "done">("info");
	const [current, setCurrent] = useState(1);
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [flagged, setFlagged] = useState<Record<number, boolean>>({});
	const [showConfirm, setShowConfirm] = useState(false);

	const { data: examData, loading: examLoading } = useQuery<{
		getExamById: ExamType | null;
	}>(GET_EXAM_BY_ID, {
		variables: { examId },
		skip: !examId,
	});
	const exam = examData?.getExamById;

	const testIds = exam?.testIds ?? [];
	const openExerciseIds = exam?.openExerciseIds ?? [];

	const { data: itemsData, loading: itemsLoading } = useQuery<{
		getTestsByIds: TestType[];
		getOpenExerciesByIds: OpenExerciesType[];
	}>(GET_EXAM_QUESTION_ITEMS, {
		variables: { testIds, openExerciseIds },
		skip: !exam,
	});

	const questions = useMemo((): ExamUiQuestion[] => {
		if (!exam || !itemsData) return [];
		const tests = itemsData.getTestsByIds ?? [];
		const openItems = itemsData.getOpenExerciesByIds ?? [];
		const testById = new Map(tests.map((t) => [t.id, t]));
		const openById = new Map(openItems.map((o) => [o.id, o]));
		const out: ExamUiQuestion[] = [];
		for (const id of exam.testIds ?? []) {
			const t = testById.get(id);
			if (!t) continue;
			const choices = Array.isArray(t.answers)
				? t.answers.filter((a) => typeof a === "string" && a.length > 0)
				: [];
			if (choices.length === 0) continue;
			out.push({
				kind: "mcq",
				sourceId: t.id,
				text: t.question,
				choices,
			});
		}
		for (const id of exam.openExerciseIds ?? []) {
			const o = openById.get(id);
			if (!o) continue;
			const text =
				(o.question && o.question.trim()) ||
				(o.title && o.title.trim()) ||
				"Задгай асуулт";
			out.push({
				kind: "open",
				sourceId: o.id,
				title: o.title,
				text,
			});
		}
		return out;
	}, [exam, itemsData]);

	const total = questions.length;
	const activeIndex = total > 0 ? Math.min(Math.max(1, current), total) : 1;

	useEffect(() => {
		if (step !== "exam") return;

		const blockShortcuts = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			if ((e.ctrlKey || e.metaKey) && ["c", "x", "v"].includes(key)) {
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		};

		const preventContextMenu = (e: MouseEvent) => e.preventDefault();
		const preventClipboard = (e: ClipboardEvent) => e.preventDefault();

		document.addEventListener("keydown", blockShortcuts, true);
		document.addEventListener("contextmenu", preventContextMenu, true);
		document.addEventListener("copy", preventClipboard, true);
		document.addEventListener("cut", preventClipboard, true);
		document.addEventListener("paste", preventClipboard, true);

		return () => {
			document.removeEventListener("keydown", blockShortcuts, true);
			document.removeEventListener("contextmenu", preventContextMenu, true);
			document.removeEventListener("copy", preventClipboard, true);
			document.removeEventListener("cut", preventClipboard, true);
			document.removeEventListener("paste", preventClipboard, true);
		};
	}, [step]);

	const q = total > 0 ? questions[activeIndex - 1] : undefined;
	const answeredCount = useMemo(() => {
		let n = 0;
		for (let i = 1; i <= total; i++) {
			const v = answers[i];
			if (v != null && String(v).trim() !== "") n++;
		}
		return n;
	}, [answers, total]);

	const headerTitle = exam?.title?.trim() || exam?.topic?.trim() || "Шалгалт";
	const headerSubtitle = exam
		? `${exam.grade}-р анги${exam.subjectId ? ` · ID: ${exam.subjectId}` : ""}`
		: "";

	return (
		<main className="min-h-screen bg-[#f3f5f9] px-4 py-8 text-[#1f2a44]">
			<div className="mx-auto w-full max-w-4xl space-y-5">
				<section className="rounded-2xl border border-[#e0e4ec] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(20,30,60,0.08)]">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<p className="text-xl font-semibold">{headerTitle}</p>
							<p className="mt-1 text-sm text-[#6a7390]">
								{examLoading
									? "Ачааллаж байна…"
									: headerSubtitle || "2025-2026 оны хичээлийн жил"}
							</p>
						</div>
						<div className="flex items-center gap-2 rounded-full border border-[#e2e6ef] bg-[#f7f9fc] px-4 py-2 text-sm font-semibold text-[#39415c]">
							<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f2e9e5] text-[#a35f45]">
								⏱
							</span>
							<span className="text-xs font-medium text-[#7981a0]">
								үлдсэн хугацаа
							</span>
						</div>
					</div>
				</section>

				{itemsLoading && exam && (
					<p className="text-center text-sm text-[#5c6786]">
						Асуултуудыг ачааллаж байна…
					</p>
				)}

				{!examLoading && exam && !itemsLoading && total === 0 && (
					<section className="rounded-2xl border border-[#e0e4ec] bg-white p-8 text-center text-[#5c6786]">
						Энэ шалгалтад асуулт олдсонгүй. (testIds / openExerciseIds
						шалгаарай)
					</section>
				)}

				{q && step !== "done" && (
					<>
						<section className="rounded-2xl border border-[#e0e4ec] bg-white p-6 shadow-[0_10px_30px_rgba(20,30,60,0.06)]">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<p className="text-sm font-semibold text-[#2f3a57]">
									Явц: {activeIndex}/{total} асуулт
								</p>
								<p className="text-xs text-[#5c6786]">
									Progress:{" "}
									<span className="font-semibold text-[#2f3a57]">
										{answeredCount}
									</span>
									/{total} answered
								</p>
							</div>
						</section>
						<section className="rounded-2xl border border-[#e0e4ec] bg-white p-6 shadow-[0_10px_30px_rgba(20,30,60,0.06)]">
							<p className="text-sm font-semibold text-[#6a7390]">
								Асуулт {activeIndex}
								{q.kind === "open" ? " (задгай)" : ""}
							</p>
							<h2 className="mt-2 text-lg font-semibold">{q.text}</h2>
							{q.kind === "mcq" ? (
								<div className="mt-4 space-y-3">
									{q.choices.map((label, idx) => {
										const id = choiceLabel(idx);
										const isSelected = answers[activeIndex] === id;
										return (
											<button
												key={`${q.sourceId}-${id}`}
												className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${isSelected ? "border-[#7aa7ff] bg-[#f1f5ff] text-[#2f4c9a]" : "border-[#e4e7ef] bg-white text-[#3a4564] hover:border-[#c9d4ea]"}`}
												type="button"
												onClick={() =>
													setAnswers((p) => ({ ...p, [activeIndex]: id }))
												}
											>
												<span className="flex items-center gap-3">
													<span
														className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isSelected ? "bg-[#2f5bd1] text-white" : "bg-[#f2f4f8] text-[#4a5574]"}`}
													>
														{id}
													</span>
													{label}
												</span>
												{isSelected && (
													<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2f5bd1] text-xs font-bold text-white">
														✓
													</span>
												)}
											</button>
										);
									})}
								</div>
							) : (
								<div className="mt-4">
									<textarea
										className="min-h-[140px] w-full rounded-xl border border-[#e4e7ef] bg-white px-4 py-3 text-sm text-[#1f2a44] outline-none focus:border-[#7aa7ff]"
										placeholder="Хариултаа энд бичнэ үү"
										value={answers[activeIndex] ?? ""}
										onChange={(e) =>
											setAnswers((p) => ({
												...p,
												[activeIndex]: e.target.value,
											}))
										}
									/>
								</div>
							)}
							<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
								<button
									className="rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]"
									type="button"
									onClick={() => setCurrent((c) => Math.max(1, c - 1))}
								>
									← Өмнөх
								</button>
								<div className="flex items-center gap-3">
									<button
										className="rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]"
										type="button"
										onClick={() =>
											setFlagged((p) => ({
												...p,
												[activeIndex]: !p[activeIndex],
											}))
										}
									>
										Flag хийх
									</button>
									<button
										className="rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
										type="button"
										onClick={() => setCurrent((c) => Math.min(total, c + 1))}
									>
										Дараах →
									</button>
								</div>
							</div>
							<div className="mt-5 flex items-center justify-end">
								<button
									className="rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
									type="button"
									onClick={() => setShowConfirm(true)}
								>
									Дуусгах
								</button>
							</div>
						</section>
						<section className="rounded-2xl border border-[#e0e4ec] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(20,30,60,0.06)]">
							<div className="flex flex-wrap items-center justify-between gap-4">
								<h3 className="text-sm font-semibold text-[#2f3a57]">
									Асуултууд
								</h3>
								<div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5c6786]">
									<span className="flex items-center gap-2">
										<span className="h-2 w-2 rounded-full bg-[#1f4ed8]" />
										Одоогийн
									</span>
									<span className="flex items-center gap-2">
										<span className="h-2 w-2 rounded-full bg-[#22c55e]" />
										Хариулсан
									</span>
									<span className="flex items-center gap-2">
										<span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
										Flagged
									</span>
									<span className="flex items-center gap-2">
										<span className="h-2 w-2 rounded-full bg-[#cbd5e1]" />
										Хариулаагүй
									</span>
								</div>
							</div>
							<div className="mt-4 grid grid-cols-6 gap-4 sm:grid-cols-10">
								{questions.map((item, idx) => {
									const num = idx + 1;
									const isCurrent = num === activeIndex;
									const isAnswered =
										answers[num] != null && String(answers[num]).trim() !== "";
									const isFlagged = flagged[num];
									return (
										<button
											key={`${item.kind}-${item.sourceId}`}
											type="button"
											onClick={() => setCurrent(num)}
											className={`flex h-15 w-15 items-center justify-center rounded-lg border text-sm font-semibold ${isCurrent ? "border-[#1f4ed8] bg-[#1f4ed8] text-white" : isFlagged ? "border-[#f59e0b] bg-[#fff7ed] text-[#b45309]" : isAnswered ? "border-[#22c55e] bg-[#ecfdf3] text-[#15803d]" : "border-[#e2e6ef] bg-white text-[#55607d]"}`}
										>
											{num}
										</button>
									);
								})}
							</div>
							<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
								<p className="text-sm text-[#5c6786]">
									Progress:{" "}
									<span className="font-semibold text-[#2f3a57]">
										{answeredCount}
									</span>
									/{total} answered
								</p>
								<button
									className="rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
									type="button"
									onClick={() => setShowConfirm(true)}
								>
									Finish exam
								</button>
							</div>
						</section>
					</>
				)}

				{step === "done" && (
					<section className="rounded-2xl border border-[#e0e4ec] bg-white px-6 py-10 text-center shadow-[0_10px_30px_rgba(20,30,60,0.08)]">
						<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfdf3] text-xl font-bold text-[#16a34a]">
							✓
						</div>
						<h2 className="mt-3 text-2xl font-semibold">
							Шалгалт амжилттай дууслаа
						</h2>
						<p className="mt-2 text-sm text-[#5c6786]">
							Таны хариултууд амжилттай илгээгдлээ.
						</p>
						<button
							className="mt-6 rounded-lg bg-[#1f4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
							type="button"
							onClick={() => setStep("info")}
						>
							Буцах
						</button>
					</section>
				)}
			</div>
			{showConfirm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
						<div className="flex items-start gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff] text-[#1f4ed8]">
								!
							</span>
							<div>
								<h4 className="text-lg font-semibold">Дуусгахад итгэлтэй?</h4>
								<p className="mt-1 text-sm text-[#5c6786]">
									Дуусгасны дараа хариултаа дахин засах боломжгүй.
								</p>
							</div>
						</div>
						<div className="mt-6 flex items-center justify-end gap-3">
							<button
								className="rounded-lg border border-[#e2e6ef] bg-white px-4 py-2 text-sm font-semibold text-[#39415c] hover:bg-[#f7f9fc]"
								type="button"
								onClick={() => setShowConfirm(false)}
							>
								Болих
							</button>
							<button
								className="rounded-lg bg-[#1f4ed8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a42b6]"
								type="button"
								onClick={() => {
									setShowConfirm(false);
									setStep("done");
								}}
							>
								Тийм, дуусгах
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
