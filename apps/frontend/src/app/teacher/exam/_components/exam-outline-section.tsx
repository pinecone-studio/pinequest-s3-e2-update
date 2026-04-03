/** @format */

"use client";

import { Check, Copy, Link2 } from "lucide-react";
import { useState } from "react";
import { NATIONAL_SCRIPT_SUBJECT } from "../../question-bank/_lib/constants";
import { hasTraditionalMongolianText } from "../../question-bank/_lib/utils";
import type { ExamQuestionDetail } from "../_lib/types";
import {
	DIFFICULTY_LABELS,
	GRADING_TYPE_LABELS,
	QUESTION_TYPE_LABELS,
	STATUS_LABELS,
} from "../../question-bank/_lib/utils";
import { UpIcon } from "@/app/_icons/upIcon";
import { DownIcon } from "@/app/_icons/downIcon";
import { TrashIcon } from "@/app/_icons/trashIcon";

export function ExamOutlineSection({
	examQuestionDetails,
	latestSavedExamId,
	requiresSchoolApproval,
	totalPoints,
	onMoveQuestion,
	onPersistExam,
	onRemoveExamQuestion,
}: {
	examQuestionDetails: ExamQuestionDetail[];
	latestSavedExamId: string | null;
	requiresSchoolApproval: boolean;
	totalPoints: number;
	onMoveQuestion: (examQuestionId: string, direction: "up" | "down") => void;
	onPersistExam: () => void;
	onRemoveExamQuestion: (examQuestionId: string) => void;
}) {
	const hasQuestions = examQuestionDetails.length > 0;
	const [linkCopied, setLinkCopied] = useState(false);

	const latestExamLink = latestSavedExamId
		? `/student/${latestSavedExamId}`
		: "";

	const handleCopyLatestLink = async () => {
		if (!latestSavedExamId || typeof window === "undefined") return;
		const absoluteLink = `${window.location.origin}${latestExamLink}`;
		try {
			await navigator.clipboard.writeText(absoluteLink);
			setLinkCopied(true);
			window.setTimeout(() => setLinkCopied(false), 1800);
		} catch {
			window.prompt("Шалгалтын линк:", absoluteLink);
		}
	};

	return (
		<section
			className={`mx-3 rounded-[12px] border p-4 shadow-sm sm:mx-4 sm:p-5 md:mx-5 ${
				hasQuestions
					? "border-[#d7e6fb] bg-[#EDF6FF]"
					: "border-[#e5e7eb] bg-[#FAFAFA]"
			}`}
		>
			<div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
				<div className="min-w-0">
					<div className="text-base font-medium uppercase tracking-[0.1em] text-[#122459] sm:text-[20px] sm:tracking-[0.14em]">
						Шалгалтын бүтэц
					</div>
					<p className="mt-1 text-sm font-normal text-[#737373] sm:text-[16px]">
						Сонгосон асуултууд
					</p>
				</div>
				<div className="shrink-0 text-left sm:text-right">
					<p className="text-lg font-medium text-[#122459] sm:text-[20px]">
						{examQuestionDetails.length} асуулт
					</p>
					{examQuestionDetails.length > 0 ? (
						<p className="text-sm text-[#5f7394]">{totalPoints} нийт оноо</p>
					) : null}
				</div>
			</div>

			<div className="mt-5">
				{!hasQuestions ? (
					<div className="h-29.75 rounded-[12px] border border-dashed border-[#404040] px-4 py-6 text-center sm:px-5 sm:py-8">
						<p className="text-base font-medium tracking-[0.04em] text-[#122459] sm:text-[20px]">
							Шалгалтад асуулт хараахан нэмэгдээгүй байна
						</p>
						<p className="mt-3 text-sm font-normal text-[#262626] sm:text-[16px]">
							Асуултын сангаас сонгоод энд нэмснээр шалгалтын эцсийн дарааллыг
							бүрдүүлнэ.
						</p>
					</div>
				) : null}

				{hasQuestions ? (
					<div className="-mx-1 overflow-x-auto px-1 pb-2">
						<div className="flex min-w-max gap-4">
							{examQuestionDetails.map((item, index) => (
								<article
									className="w-[calc((100vw-7rem)/3)] min-w-[320px] max-w-[380px] rounded-[24px] border border-[#cbdcf4] bg-white p-5 shadow-sm sm:w-[calc((100vw-8rem)/3)] sm:p-6"
									key={item.examQuestionId}
								>
									<div className="flex flex-wrap items-center gap-2.5">
										<span className="inline-flex min-w-10 items-center justify-center rounded-[10px] border border-[#52627d] px-3 py-2 text-sm font-semibold text-[#122459]">
											{index + 1}
										</span>
										<ExamBadge>{STATUS_LABELS[item.question.status]}</ExamBadge>
										<ExamBadge>
											{QUESTION_TYPE_LABELS[item.question.questionType]}
										</ExamBadge>
										<ExamBadge>
											{DIFFICULTY_LABELS[item.question.difficulty]}
										</ExamBadge>
										<ExamBadge>
											{GRADING_TYPE_LABELS[item.question.gradingType]}
										</ExamBadge>
									</div>

									<ExamQuestionPreview detail={item} />

									<div className="mt-5 flex items-center gap-2 whitespace-nowrap overflow-x-auto pb-1">
										<OutlineButton
											icon={<UpIcon />}
											label="Урд"
											onClick={() => onMoveQuestion(item.examQuestionId, "up")}
										/>
										<OutlineButton
											icon={<DownIcon />}
											label="Хойно"
											onClick={() =>
												onMoveQuestion(item.examQuestionId, "down")
											}
										/>
										<div className="inline-flex h-8 min-w-[86px] shrink-0 items-center justify-center gap-1.5 rounded-[14px] border border-[#bcc8d8] bg-white px-3">
											<span className="text-[13px] font-semibold text-[#1f2937]">
												{item.assignedPoints}
											</span>
											<span className="text-[13px] font-medium text-[#94a3b8]">
												оноо
											</span>
										</div>
										<button
											aria-label="Асуултыг хасах"
											className="inline-flex h-7 w-12 shrink-0 items-center justify-center rounded-xl border border-[#a7adb8] bg-white text-[#262626] transition hover:bg-[#f8fbff]"
											onClick={() => onRemoveExamQuestion(item.examQuestionId)}
											type="button"
										>
											<TrashIcon />
										</button>
									</div>
								</article>
							))}
						</div>
					</div>
				) : null}
			</div>

			{hasQuestions ? (
				<div className="mt-5 pt-4">
					<div className="flex justify-stretch sm:justify-end">
						<button
							className="inline-flex w-full items-center justify-center rounded-[12px] bg-[#29A4FF] px-6 py-3 text-[12px] font-medium text-[#EDF6FF] transition hover:bg-[#29A4FF] sm:w-auto"
							onClick={onPersistExam}
							type="button"
						>
							{requiresSchoolApproval
								? "Хадгалж, зөвшөөрөл хүсэх"
								: "Шалгалтад хадгалах"}
						</button>
					</div>
					{latestSavedExamId ? (
						<div className="mt-3 rounded-[12px] border border-[#cfe0fb] bg-white p-3">
							<p className="text-xs font-medium text-[#5f7394]">
								Шалгалтын линк
							</p>
							<div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<div className="min-w-0 rounded-[10px] border border-[#d7e6fb] bg-[#f8fbff] px-3 py-2">
									<p className="truncate text-xs font-medium text-[#183153]">
										{latestExamLink}
									</p>
								</div>
								<button
									className="inline-flex h-9 items-center justify-center gap-2 rounded-[10px] border border-[#a7adb8] bg-white px-3 text-xs font-medium text-[#444] transition hover:bg-[#f8fbff]"
									onClick={handleCopyLatestLink}
									type="button"
								>
									{linkCopied ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
									{linkCopied ? "Хуулсан" : "Линк хуулах"}
								</button>
							</div>
							<a
								className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#2f66b9] hover:underline"
								href={latestExamLink}
								rel="noreferrer"
								target="_blank"
							>
								<Link2 className="h-3.5 w-3.5" />
								Нээж шалгах
							</a>
						</div>
					) : null}
				</div>
			) : null}
		</section>
	);
}

function ExamQuestionPreview({ detail }: { detail: ExamQuestionDetail }) {
	const { question } = detail;
	const isNationalScript = question.subject === NATIONAL_SCRIPT_SUBJECT;
	const title = question.title.trim() || "Асуултын дэлгэрэнгүй";

	return (
		<div className="mt-6">
			<h3 className="text-[20px] font-semibold text-[#2d2d2d] sm:text-[22px]">
				{title}
			</h3>
			<p className="mt-4 text-[15px] leading-8 text-[#707070] whitespace-pre-line">
				{question.content.prompt}
			</p>

			{question.options.length > 0 ? (
				<div className="mt-6 space-y-4">
					{question.options.map((option, index) => {
						const renderVertical =
							isNationalScript && hasTraditionalMongolianText(option.text);

						return (
							<div
								className={`rounded-[12px] border px-5 py-2.5 text-[15px] ${
									option.isCorrect
										? "border-[#80bff2] bg-[#6aaae0] text-[#183b76]"
										: "border-[#e5e7eb] bg-white text-[#1f3b7a]"
								}`}
								key={option.id}
							>
								<div
									className={
										renderVertical
											? "min-h-24 overflow-x-auto leading-8"
											: "flex items-start gap-3"
									}
									style={
										renderVertical
											? {
													writingMode: "vertical-lr",
													textOrientation: "mixed",
													whiteSpace: "pre-wrap",
												}
											: undefined
									}
								>
									{!renderVertical ? (
										<span className="shrink-0 font-medium">{index + 1}.</span>
									) : null}
									<span className="whitespace-pre-line">{option.text}</span>
								</div>
							</div>
						);
					})}
				</div>
			) : null}
		</div>
	);
}

function OutlineButton({
	icon,
	label,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			className="inline-flex h-8 items-center gap-2 rounded-[12px] border border-[#a7adb8] bg-white px-3 text-[12px] font-medium text-[#444] transition hover:bg-[#f8fbff]"
			onClick={onClick}
			type="button"
		>
			{icon}
			{label}
		</button>
	);
}

function ExamBadge({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center rounded-lg border border-[#d7e0ea] bg-white px-4 py-2 text-[14px] font-medium leading-none text-[#355389]">
			{children}
		</span>
	);
}
