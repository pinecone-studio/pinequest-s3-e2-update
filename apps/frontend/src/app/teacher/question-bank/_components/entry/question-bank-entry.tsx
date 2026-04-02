/** @format */

"use client";
import { ArrowRight } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQuestionBank } from "../../_hooks/use-question-bank";
import { useRouter } from "next/navigation";

export function QuestionBankEntry({
	initialSubjectId = "",
	initialGrade = "",
}: {
	initialSubjectId?: string;
	initialGrade?: string;
} = {}) {
	const router = useRouter();

	const {
		entrySelection,
		gradeOptions,
		summary,
		subjectItems,
		subjectsLoading,
		toastMessage,
		updateEntrySelection,
	} = useQuestionBank(
		initialSubjectId && initialGrade
			? { initialSubjectId, initialGrade }
			: undefined,
	);

	const subjectSelectItems = subjectItems.map((subject) => ({
		key: subject.id,
		value: subject.id,
		label: subject.name,
	}));

	const gradeItems = gradeOptions.map((grade) => ({
		key: grade,
		value: grade,
		label: grade,
	}));

	const totalQuestions = summary.selectedScopeCount;

	const handleSubjectChange = (next: string) => {
		const subject = subjectItems.find((s) => s.id === next);
		if (subject) {
			updateEntrySelection({
				subjectId: subject.id,
				subject: subject.name,
			});
		}
	};

	const handleGradeChange = (next: string) => {
		updateEntrySelection({ grade: next });
	};

	return (
		<div className="bg-white pb-12">
			<div className="mx-auto max-w-[1184px] space-y-5 px-4 pt-5 sm:px-6 sm:pt-[28px]">
				<section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
					<div className="min-w-0 space-y-1">
						<p className="text-[17px] font-bold uppercase leading-snug tracking-[0.08em] text-[#122459] sm:text-[23px] sm:leading-[28px] sm:tracking-[0.1em]">
							БАГШИЙН АСУУЛТЫН САН
						</p>
						<p className="text-[13px] leading-[18px] tracking-[0.06em] text-[#737373] sm:text-[14px] sm:tracking-[0.1em]">
							Нэг удаа бэлдээд, дахин ашигла.
						</p>
					</div>

					<div className="inline-flex h-[72px] w-full min-w-0 shrink-0 items-center justify-center gap-3 rounded-[16px] bg-[#D7ECFF] px-5 sm:h-[76px] sm:w-auto sm:min-w-[220px] sm:gap-4 sm:px-4 md:min-w-[280px] md:px-8">
						<p className="text-[40px] font-medium leading-none text-[#122459] sm:text-[44px] md:text-[56px]">
							{totalQuestions}
						</p>
						<p className="whitespace-nowrap text-[14px] font-medium uppercase leading-tight tracking-[0.06em] text-[#122459] sm:text-[16px] sm:leading-[20px] sm:tracking-[0.08em]">
							БҮХ АСУУЛТ
						</p>
					</div>
				</section>

				<section className="rounded-2xl border border-[#e5e7eb] bg-[#FAFAFA] px-5 py-4 sm:px-6">
					<p className="text-sm font-semibold text-[#1f2a44]">
						Сонголтын хэсэг
					</p>
					<div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
						<Select
							onValueChange={handleSubjectChange}
							value={entrySelection.subjectId}
						>
							<SelectTrigger className="h-10 w-full rounded-2xl border-[#e5e7eb] bg-white text-xs text-[#111827] focus:border-[#9fbef5] focus:ring-2 focus:ring-[#9fbef5]/30 sm:w-[150px]">
								<SelectValue placeholder="Хичээл сонгох" />
							</SelectTrigger>
							<SelectContent
								className={
									subjectsLoading
										? "[&>div]:!h-auto [&>div]:min-h-[7rem]"
										: undefined
								}
							>
								{subjectsLoading ? (
									<div
										className="flex min-h-[7rem] items-center justify-center px-4 py-6"
										role="status"
										aria-live="polite"
										aria-label="Хичээлүүд ачааллаж байна"
									>
										<span
											className="size-5 shrink-0 animate-spin rounded-full border-2 border-[#cbd5e1] border-t-[#122459]"
											aria-hidden
										/>
									</div>
								) : (
									subjectSelectItems.map((item) => (
										<SelectItem key={item.key} value={item.value}>
											{item.label}
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>

						<Select
							onValueChange={handleGradeChange}
							value={entrySelection.grade}
						>
							<SelectTrigger className="h-10 w-full rounded-2xl border-[#e5e7eb] bg-white text-xs text-[#111827] focus:border-[#9fbef5] focus:ring-2 focus:ring-[#9fbef5]/30 sm:w-[130px]">
								<SelectValue placeholder="Анги сонгох" />
							</SelectTrigger>
							<SelectContent>
								{gradeItems.map((item) => (
									<SelectItem key={item.key} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<button
							className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-[#9fbef5] bg-[#EDF6FF] px-4 text-xs font-semibold text-[#1f2a44] transition hover:border-[#7aa8f0] hover:bg-[#e3f0ff] disabled:cursor-not-allowed disabled:border-[#d1d5db] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af] sm:w-auto"
							disabled={
								subjectsLoading ||
								!entrySelection.subjectId ||
								!entrySelection.grade
							}
							onClick={() =>
								router.push(
									`/teacher/question-bank/${encodeURIComponent(entrySelection.subjectId)}/${encodeURIComponent(entrySelection.grade)}`,
								)
							}
							type="button"
						>
							<ArrowRight className="mr-2 h-4 w-4" />
							АСУУЛТ САНД НЭВТРЭХ
						</button>
					</div>
				</section>

				{toastMessage ? (
					<div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#374151] shadow-sm">
						{toastMessage}
					</div>
				) : null}
			</div>
		</div>
	);
}
