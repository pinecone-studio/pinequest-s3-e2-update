/** @format */

"use client";

import { QuestionBuilderForm } from "../builder/question-builder-form";
import { QuestionBankEntryPanel } from "../entry/question-bank-entry-panel";
import { QuestionBankFigmaControls } from "../question-bank-figma-controls";
import { QuestionBankFigmaHero } from "../question-bank-figma-hero";
import { QuestionBankFigmaResults } from "../question-bank-figma-results";
import { useQuestionBank } from "../../_hooks/use-question-bank";
import { useRouter } from "next/navigation";
import { QuestionBankPublishSuccessDialog } from "./question-bank-publish-success-dialog";

export function QuestionBankPage({
	initialSubjectId = "",
	initialGrade = "",
}: {
	initialSubjectId?: string;
	initialGrade?: string;
} = {}) {
	const router = useRouter();
	const {
		clearFilters,
		closeBuilder,
		currentFilters,
		deleteQuestion,
		entrySelection,
		activeQuestion,
		editingValues,
		filteredQuestions,
		gradeOptions,
		getQuestionHeartCount,
		hasEnteredBank,
		isBuilderOpen,
		lastValidationErrors,
		likedQuestionIds,
		myQuestions,
		openCreateBuilder,
		openBulkImport,
		openEditBuilder,
		publishSuccessDialogOpen,
		resetEntrySelection,
		sendQuestionsToExam,
		selectedQuestionIds,
		setPublishSuccessDialogOpen,
		subjectOptions,
		submitQuestion,
		summary,
		setActiveQuestionId,
		toastMessage,
		toggleQuestionSelection,
		toggleQuestionLike,
		topicOptions,
		updateEntrySelection,
		updateFilters,
		clearQuestionSelection,
		subjectItems,
		subjectsLoading,
	} = useQuestionBank(
		initialSubjectId && initialGrade
			? { initialSubjectId, initialGrade }
			: undefined,
	);

	const myQuestionsByNewest = [...myQuestions].sort(
		(left, right) =>
			new Date(right.updatedAt || right.createdAt).getTime() -
			new Date(left.updatedAt || left.createdAt).getTime(),
	);
	const resultQuestionsByNewest = [...filteredQuestions].sort(
		(left, right) =>
			new Date(right.updatedAt || right.createdAt).getTime() -
			new Date(left.updatedAt || left.createdAt).getTime(),
	);
	const visibleQuestions = resultQuestionsByNewest;
	const previewQuestion = activeQuestion ?? resultQuestionsByNewest[0] ?? null;
	const myQuestionCount = myQuestions.length;

	return (
		<div className="pb-8 sm:pb-[32px]">
			<div className="mx-auto max-w-[1184px] px-4 pt-3 sm:px-[18px] sm:pt-[14px]">
				{!hasEnteredBank ? (
					<QuestionBankEntryPanel
						entryGrade={entrySelection.grade}
						entrySubjectId={entrySelection.subjectId}
						subjects={subjectItems}
						subjectsLoading={subjectsLoading}
						gradeOptions={gradeOptions}
						onEnter={() =>
							router.push(
								`/teacher/question-bank/${encodeURIComponent(
									entrySelection.subjectId,
								)}/${encodeURIComponent(entrySelection.grade)}`,
							)
						}
						onGradeSelect={(value) => updateEntrySelection({ grade: value })}
						onSubjectSelect={(subjectId, name) =>
							updateEntrySelection({ subjectId, subject: name })
						}
					/>
				) : (
					<div className="space-y-[24px]">
						<QuestionBankFigmaHero
							onCreateQuestion={openCreateBuilder}
							totalQuestions={summary.selectedScopeCount}
						/>
						<QuestionBankFigmaControls
							currentFilters={currentFilters}
							entryGrade={entrySelection.grade}
							entrySubject={entrySelection.subject}
							onClearFilters={clearFilters}
							onOpenBulkImport={openBulkImport}
							onResetSelection={() => {
								resetEntrySelection();
								router.push("/teacher/question-bank");
							}}
							onUpdateFilters={updateFilters}
							topicOptions={topicOptions}
						/>

						{toastMessage ? (
							<div className="rounded-[10px] border border-[#e7ebf1] bg-white px-[12px] py-[8px] text-[11px] font-medium text-[#4b5563]">
								{toastMessage}
							</div>
						) : null}

						<QuestionBankFigmaResults
							activeQuestionId={activeQuestion?.id ?? null}
							getQuestionHeartCount={getQuestionHeartCount}
							likedQuestionIds={likedQuestionIds}
							myQuestionCount={myQuestionCount}
							myQuestions={myQuestionsByNewest}
							onAddToExam={(questionId) => sendQuestionsToExam([questionId])}
							onCreateQuestion={openCreateBuilder}
							onEditQuestion={openEditBuilder}
							onOpenQuestion={setActiveQuestionId}
							onToggleLike={toggleQuestionLike}
							onToggleSelection={toggleQuestionSelection}
							previewQuestion={previewQuestion}
							questions={visibleQuestions}
							selectedQuestionIds={selectedQuestionIds}
							selectedCount={selectedQuestionIds.length}
							onClearSelection={clearQuestionSelection}
							onSendSelectedToExam={() =>
								sendQuestionsToExam(selectedQuestionIds)
							}
						/>
					</div>
				)}
			</div>

			{isBuilderOpen ? (
				<QuestionBuilderForm
					initialValues={editingValues}
					key={editingValues?.id ?? "new-question"}
					onClose={closeBuilder}
					onDelete={deleteQuestion}
					onSubmit={submitQuestion}
					subjectOptions={subjectOptions}
					validationErrors={lastValidationErrors}
				/>
			) : null}

			<QuestionBankPublishSuccessDialog
				onClose={() => setPublishSuccessDialogOpen(false)}
				open={publishSuccessDialogOpen}
			/>
		</div>
	);
}
