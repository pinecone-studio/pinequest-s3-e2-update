/** @format */

"use client";
/* eslint-disable @next/next/no-img-element */

import { NATIONAL_SCRIPT_SUBJECT } from "../../_lib/constants";
import type { Question, QuestionDifficulty } from "../../_lib/types";
import {
	getPromptDisplayParts,
	hasTraditionalMongolianText,
	resolveQuestionTitle,
} from "../../_lib/utils";

const difficultyLabelMap: Record<QuestionDifficulty, string> = {
	easy: "Хялбар",
	medium: "Дунд зэрэг",
	hard: "Хэцүү",
};

type QuestionBankActivePanelProps = {
	question: Question | null;
};

export function QuestionBankActivePanel({
	question,
}: QuestionBankActivePanelProps) {
	if (!question) {
		return (
			<section className="min-h-[240px] w-full max-w-full rounded-[10px] border border-[#9ED0FF] bg-white px-[18px] py-[18px] lg:min-h-[510px] lg:max-w-[381px]" />
		);
	}

	const metaItems = [
		["Сургууль", "21"],
		["Багш", question.teacherName ?? "Ц.Цэвээнжав"],
		["Анги", question.grade],
		["Хичээл", question.subject],
		["Сэдэв", question.subtopic?.trim() || question.topic],
		["Оноо", `${question.points}`],
		["Ашигласан тоо", `${question.usageCount}`],
		["Шинэчлэсэн", question.updatedAt],
	];
	const promptParts = getPromptDisplayParts(question.content.prompt);
	const resolvedTitle =
		resolveQuestionTitle(question.title, question.content.prompt) ||
		"Зурагтай асуулт";
	const shouldRenderPromptVertical =
		question.subject === NATIONAL_SCRIPT_SUBJECT &&
		hasTraditionalMongolianText(question.content.prompt);

	return (
		<section className="min-h-[320px] w-full max-w-full rounded-[10px] border border-[#9ED0FF] bg-white px-[18px] py-[18px] lg:min-h-[510px] lg:max-w-[381px]">
			<p className="text-[12px] font-normal uppercase leading-[15px] text-[#7B7B7B]">
				АСУУЛТЫН ДЭЛГЭРЭНГҮЙ
			</p>

			<div className="mt-[12px] flex flex-wrap gap-x-[10px] gap-y-[10px]">
				<TinyChip>
					{question.questionType === "multiple_choice"
						? "Сонгох асуулт"
						: "Задгай"}
				</TinyChip>
				<TinyChip>
					{question.gradingType === "auto" ? "Автомат үнэлгээ" : "Гар үнэлгээ"}
				</TinyChip>
				<TinyChip>{difficultyLabelMap[question.difficulty]}</TinyChip>
			</div>

			<h3 className="mt-[22px] text-[18px] font-semibold leading-[22px] text-[#323232]">
				{resolvedTitle}
			</h3>
			<div className="mt-[16px] space-y-[8px] text-[14px] leading-[20px] text-[#0A0A0A]">
				{promptParts.map((part, index) =>
					part.type === "text" ? (
						<p
							key={`${part.type}-${index}`}
							className={
								shouldRenderPromptVertical
									? "min-h-20 overflow-x-auto leading-8"
									: "whitespace-pre-line"
							}
							style={
								shouldRenderPromptVertical
									? {
											writingMode: "vertical-lr",
											textOrientation: "mixed",
											whiteSpace: "pre-wrap",
										}
									: undefined
							}
						>
							{part.value}
						</p>
					) : question.imageUrl ? (
						<div
							key={`${part.type}-${index}`}
							className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[10px] border border-[#dce5f2]"
						>
							<img
								alt={resolvedTitle}
								className="h-[128px] w-full object-cover"
								src={question.imageUrl}
							/>
						</div>
					) : null,
				)}
			</div>

			<div className="mt-[14px] space-y-[8px]">
				{question.options.slice(0, 4).map((option, index) => (
					<div
						key={option.id}
						className={`flex rounded-[3px] border px-[12px] py-[8px] text-[12px] leading-[15px] ${
							option.isCorrect
								? "border-[#7DC8FF] bg-[#75B8ED] text-[#122459]"
								: "border-[#ECECEC] bg-white text-[#122459]"
						}`}
					>
						<span className="mr-[10px] shrink-0 text-[11px]">{index + 1}.</span>
						<span
							className={
								hasTraditionalMongolianText(option.text)
									? "min-h-20 overflow-x-auto text-[11px] leading-8"
									: "truncate text-[11px]"
							}
							style={
								hasTraditionalMongolianText(option.text)
									? {
											writingMode: "vertical-lr",
											textOrientation: "mixed",
											whiteSpace: "pre-wrap",
										}
									: undefined
							}
						>
							{stripLeadingNumber(option.text)}
						</span>
					</div>
				))}
			</div>

			<div className="mt-[14px] grid grid-cols-[1fr_auto] gap-x-[18px] gap-y-[10px] bg-white px-[12px] py-[12px]">
				{metaItems.map(([label, value]) => (
					<div key={label} className="contents">
						<span className="text-[12px] leading-[15px] text-[#262626]">
							{label}
						</span>
						<span className="text-[12px] leading-[15px] text-[#262626]">
							{value}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}

function TinyChip({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex min-h-[30px] items-center rounded-[12px] border border-[#d4d4d8] bg-transparent px-[14px] text-[14px] font-medium leading-[20px] text-[#2d2d2d]">
			{children}
		</span>
	);
}

function stripLeadingNumber(value: string) {
	return value.replace(/^\s*\d+\.\s*/, "");
}
