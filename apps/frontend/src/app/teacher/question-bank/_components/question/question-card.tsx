/** @format */

"use client";
/* eslint-disable @next/next/no-img-element */

import { Bookmark, Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { NATIONAL_SCRIPT_SUBJECT } from "../../_lib/constants";
import type { Question } from "../../_lib/types";
import {
	DIFFICULTY_LABELS,
	getPromptDisplayParts,
	hasTraditionalMongolianText,
	resolveQuestionTitle,
} from "../../_lib/utils";

type QuestionCardProps = {
	compactAction?: boolean;
	heartCount: number;
	isActive?: boolean;
	isLiked: boolean;
	isSelected?: boolean;
	question: Question;
	onAddToExam: () => void;
	onDelete?: () => void;
	onEdit?: () => void;
	onOpen?: () => void;
	onToggleSelect: () => void;
	onToggleLike: () => void;
};

export function QuestionCard({
	heartCount,
	isActive = false,
	isLiked,
	isSelected = false,
	question,
	onOpen,
	onToggleSelect,
	onToggleLike,
}: QuestionCardProps) {
	const promptParts = getPromptDisplayParts(question.content.prompt);
	const resolvedTitle =
		resolveQuestionTitle(question.title, question.content.prompt) ||
		"Зурагтай асуулт";
	const noteText =
		question.content.explanation?.trim() || question.content.guidance?.trim();
	const shouldRenderPromptVertical =
		question.subject === NATIONAL_SCRIPT_SUBJECT &&
		hasTraditionalMongolianText(question.content.prompt);

	return (
		<article
			className={cn(
				"group relative flex min-h-[248px] flex-col rounded-[10px] border px-4 pb-4 pt-5 sm:px-[28px] sm:pb-[20px] sm:pt-[24px]",
				isSelected || isActive
					? "border-[#7DC8FF] bg-white"
					: "border-[#ECECEC] bg-white",
			)}
		>
			<button
				aria-label="Select question"
				aria-pressed={isSelected}
				className={cn(
					"absolute right-[26px] top-[18px] inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[6px] border-[2px] transition-colors",
					isSelected
						? "border-[#404040] bg-white text-[#404040]"
						: "border-[#404040] bg-white text-transparent hover:bg-[#eef4ff]",
				)}
				onClick={onToggleSelect}
				type="button"
			>
				<Check className="h-[14px] w-[14px]" strokeWidth={3} />
			</button>

			<button
				className="w-full pr-[60px] text-left"
				onClick={onOpen}
				type="button"
			>
				<h3 className="line-clamp-2 text-[20px] font-semibold leading-[120%] tracking-[0.04em] text-[#323232]">
					{resolvedTitle}
				</h3>
				<div className="mt-[14px] space-y-[8px] text-[14px] leading-[20px] text-[#323232]">
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
								className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[10px] border border-[#dce5f2]"
							>
								<img
									alt={resolvedTitle}
									className="h-[120px] w-full object-cover"
									src={question.imageUrl}
								/>
							</div>
						) : null,
					)}
				</div>
			</button>

			<div className="mt-[18px] flex flex-wrap items-center gap-[10px]">
				<Tag>{question.grade}</Tag>
				<Tag>{question.subject}</Tag>
				<Tag>{question.subtopic?.trim() || question.topic}</Tag>
			</div>

			<div className="mt-[8px] flex flex-wrap items-center gap-[10px]">
				<Tag borderless>
					{question.questionType === "multiple_choice"
						? "Сонгох асуулт"
						: "Задгай"}
				</Tag>
				<Tag borderless>{DIFFICULTY_LABELS[question.difficulty]}</Tag>
				<Tag borderless>
					{question.gradingType === "auto" ? "Автомат үнэлгээ" : "Гар үнэлгээ"}
				</Tag>
			</div>

			{noteText ? (
				<p className="mt-[14px] line-clamp-2 text-[14px] font-normal leading-[140%] tracking-[0.04em] text-[#323232]">
					Тэмдэглэл: {noteText}
				</p>
			) : null}

			<p className="mt-[8px] text-[13px] font-normal leading-[140%] tracking-[0.04em] text-[#5f5f5f]">
				16-р сургууль · Багш: {question.teacherName ?? "О.Наранзул"}
			</p>

			<div className="mt-auto pt-[14px]">
				<div className="h-px w-full bg-[#E5E5E5]" />
			</div>

			<div className="mt-[12px] flex items-center justify-between text-[#7B7B7B]">
				<button
					className={cn(
						"inline-flex items-center gap-[8px] px-[12px] text-[16px] leading-[140%]",
						isLiked ? "text-[#e11d48]" : "text-[#7B7B7B]",
					)}
					onClick={onToggleLike}
					type="button"
				>
					<Heart
						className={cn(
							"h-[20px] w-[20px]",
							isLiked ? "fill-current text-[#e11d48]" : "text-[#525252]",
						)}
					/>
					<span className={cn(isLiked ? "text-[#e11d48]" : "text-[#525252]")}>
						{heartCount}
					</span>
				</button>

				<div className="inline-flex items-center gap-[8px] px-[12px] text-[16px] leading-[140%]">
					<Bookmark className="h-[20px] w-[20px] text-[#525252]" />
					<span className="text-[#525252]">
						{question.usageCount} удаа ашигласан
					</span>
				</div>
			</div>
		</article>
	);
}

function Tag({
	borderless = false,
	children,
}: {
	borderless?: boolean;
	children: React.ReactNode;
}) {
	return (
		<span
			className={cn(
				"inline-flex min-h-[30px] items-center rounded-[12px] px-[14px] text-[14px] font-medium leading-[20px] tracking-[0.01em] text-[#2d2d2d]",
				borderless
					? "border border-[#d4d4d8] bg-transparent"
					: "border border-[#d4d4d8] bg-transparent",
			)}
		>
			{children}
		</span>
	);
}
