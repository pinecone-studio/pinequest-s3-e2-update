/** @format */

"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useTeacher } from "../../teacher-shell";
import { PENDING_EXAM_TRANSFER_STORAGE_KEY } from "../../exam/_lib/constants";
import type { PendingExamTransfer } from "../../exam/_lib/types";
import {
	mapBackendOpenExerciesToQuestions,
	mapBackendTestsToQuestions,
	type BackendOpenExercies,
} from "./backend-question-mappers";
import type { BackendTest } from "./get-tests";
import {
	CREATE_OPEN_EXERCIES,
	CREATE_TESTS,
} from "@/graphql/typeDefs/mutations";
import {
	GET_ALL_SUBJECTS,
	GET_OPEN_EXERCIES_BY_SUBJECT_AND_GRADE,
	GET_TESTS_BY_SUBJECT_AND_GRADE,
} from "@/graphql/typeDefs/queries";
import {
	GRADE_OPTIONS,
	QUESTION_BANK_FILTER_DEFAULTS,
} from "../_lib/constants";
import type { Question, QuestionFilters } from "../_lib/types";
import {
	buildQuestionPayload,
	createQuestionBuilderValues,
	filterAndSortQuestions,
	mapQuestionToBuilderValues,
	validateQuestion,
} from "../_lib/utils";

type UseQuestionBankOptions = {
	initialSubjectId: string;
	initialGrade: string;
};

type CreateTestsResponse = {
	createTests: BackendTest & { teacherId: string };
};

type CreateOpenExerciesResponse = {
	createOpenExercies: BackendOpenExercies;
};

type GetAllSubjectResponse = {
	getAllSubject: { id: string; name: string }[];
};

type GetTestsBySubjectAndGradeResponse = {
	getTestsBySybjectAndGrade: (BackendTest & { teacherId: string })[];
};

type GetOpenExerciesBySubjectAndGradeResponse = {
	getOpenExerciesBySubjectAndGrade: BackendOpenExercies[];
};

function entryMatchesQuestion(
	question: Question,
	entrySubject: string,
	entryGrade: string,
): boolean {
	return question.subject === entrySubject && question.grade === entryGrade;
}

function parseGradeToInt(gradeLabel: string) {
	const n = Number.parseInt(gradeLabel, 10);
	return Number.isFinite(n) ? n : 0;
}

function isOwnedByTeacher(
	question: Question,
	teacherId: string,
	teacherName: string,
) {
	if (question.teacherId) return question.teacherId === teacherId;
	return question.teacherName === teacherName;
}

export function useQuestionBank(options?: UseQuestionBankOptions) {
	const router = useRouter();
	const teacher = useTeacher();
	const { data: subjectsData, loading: subjectsLoading } =
		useQuery<GetAllSubjectResponse>(GET_ALL_SUBJECTS);
	const [createTests] = useMutation<CreateTestsResponse>(CREATE_TESTS);
	const [createOpenExercies] =
		useMutation<CreateOpenExerciesResponse>(CREATE_OPEN_EXERCIES);

	const subjectItems = useMemo(
		() => subjectsData?.getAllSubject ?? [],
		[subjectsData?.getAllSubject],
	);

	const subjectNameById = useMemo(() => {
		const map = new Map<string, string>();
		for (const s of subjectItems) map.set(s.id, s.name);
		return map;
	}, [subjectItems]);

	const entryFromRoute = useMemo(() => {
		const subjectId = options?.initialSubjectId ?? "";
		const grade = options?.initialGrade ?? "";
		const subject = subjectNameById.get(subjectId) ?? "";
		return { subjectId, subject, grade };
	}, [options?.initialGrade, options?.initialSubjectId, subjectNameById]);

	const enteredFromRoute = Boolean(
		entryFromRoute.subjectId && entryFromRoute.grade,
	);

	const [localEntry, setLocalEntry] = useState({
		subjectId: "",
		subject: "",
		grade: "",
	});

	const entrySelection = enteredFromRoute ? entryFromRoute : localEntry;

	const hasEnteredBank = Boolean(
		entrySelection.subjectId && entrySelection.grade,
	);

	const entryGradeInt = useMemo(
		() => parseGradeToInt(entrySelection.grade),
		[entrySelection.grade],
	);
	const shouldFetchTests = Boolean(entrySelection.subjectId && entryGradeInt);
	const { data: testsData, refetch: refetchTests } =
		useQuery<GetTestsBySubjectAndGradeResponse>(
			GET_TESTS_BY_SUBJECT_AND_GRADE,
			{
				variables: {
					input: shouldFetchTests
						? { subjectId: entrySelection.subjectId, grade: entryGradeInt }
						: null,
				},
				skip: !shouldFetchTests,
			},
		);

	const { data: openExerciesData, refetch: refetchOpenExercies } =
		useQuery<GetOpenExerciesBySubjectAndGradeResponse>(
			GET_OPEN_EXERCIES_BY_SUBJECT_AND_GRADE,
			{
				variables: {
					input: shouldFetchTests
						? { subjectId: entrySelection.subjectId, grade: entryGradeInt }
						: null,
				},
				skip: !shouldFetchTests,
			},
		);

	const [currentFilters, setCurrentFilters] = useState<QuestionFilters>(
		QUESTION_BANK_FILTER_DEFAULTS,
	);
	const [removedIds, setRemovedIds] = useState(() => new Set<string>());
	const [upserts, setUpserts] = useState(() => new Map<string, Question>());
	const [likedQuestionIds, setLikedQuestionIds] = useState<string[]>([]);
	const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
	const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
	const [isBuilderOpen, setIsBuilderOpen] = useState(false);
	const [editingValues, setEditingValues] = useState<ReturnType<
		typeof mapQuestionToBuilderValues
	> | null>(null);
	const [lastValidationErrors, setLastValidationErrors] = useState<
		ReturnType<typeof validateQuestion> | undefined
	>(undefined);
	const [publishSuccessDialogOpen, setPublishSuccessDialogOpen] =
		useState(false);
	const [toastMessage, setToastMessage] = useState("");

	const showToast = useCallback((message: string) => {
		setToastMessage(message);
		window.setTimeout(() => setToastMessage(""), 2600);
	}, []);

	const remoteQuestions = useMemo(() => {
		const backendTests = mapBackendTestsToQuestions(
			testsData?.getTestsBySybjectAndGrade ?? [],
			subjectNameById,
		).map((q) => {
			const owner = testsData?.getTestsBySybjectAndGrade?.find(
				(row) => row.id === q.id,
			)?.teacherId;
			const isMine = Boolean(owner && owner === teacher.id);
			return {
				...q,
				source: owner ? "school" : "global",
				teacherId: owner ?? null,
				teacherName: isMine ? teacher.name : q.teacherName,
			} satisfies Question;
		});
		const backendOpenExercies = mapBackendOpenExerciesToQuestions(
			openExerciesData?.getOpenExerciesBySubjectAndGrade ?? [],
			subjectNameById,
		).map((q) => {
			const owner = openExerciesData?.getOpenExerciesBySubjectAndGrade?.find(
				(row) => row.id === q.id,
			)?.teacherId;
			const isMine = Boolean(owner && owner === teacher.id);
			return {
				...q,
				teacherId: owner ?? null,
				teacherName: isMine ? teacher.name : q.teacherName,
			} satisfies Question;
		});

		const combined = [...backendTests, ...backendOpenExercies];
		return combined;
	}, [
		testsData?.getTestsBySybjectAndGrade,
		openExerciesData?.getOpenExerciesBySubjectAndGrade,
		subjectNameById,
		teacher.id,
		teacher.name,
	]);

	const mergedQuestions = useMemo(() => {
		const byId = new Map<string, Question>();
		for (const q of remoteQuestions) {
			if (!removedIds.has(q.id)) {
				byId.set(q.id, upserts.get(q.id) ?? q);
			}
		}
		for (const [id, q] of upserts) {
			if (!removedIds.has(id) && !byId.has(id)) byId.set(id, q);
		}
		return Array.from(byId.values());
	}, [remoteQuestions, removedIds, upserts]);

	const scopedQuestions = useMemo(() => {
		if (!hasEnteredBank) return [];
		return mergedQuestions.filter((q) =>
			entryMatchesQuestion(q, entrySelection.subject, entrySelection.grade),
		);
	}, [
		mergedQuestions,
		entrySelection.grade,
		entrySelection.subject,
		hasEnteredBank,
	]);

	const myQuestions = useMemo(
		() =>
			scopedQuestions.filter((q) =>
				isOwnedByTeacher(q, teacher.id, teacher.name),
			),
		[scopedQuestions, teacher.id, teacher.name],
	);

	const filteredQuestions = useMemo(
		() => filterAndSortQuestions(scopedQuestions, currentFilters),
		[scopedQuestions, currentFilters],
	);

	const activeQuestion = useMemo(
		() =>
			activeQuestionId
				? (scopedQuestions.find((q) => q.id === activeQuestionId) ?? null)
				: null,
		[activeQuestionId, scopedQuestions],
	);

	const summary = useMemo(
		() => ({
			myQuestionCount: myQuestions.length,
			selectedScopeCount: scopedQuestions.length,
		}),
		[myQuestions.length, scopedQuestions.length],
	);

	const subjectOptions = useMemo(
		() => subjectItems.map((s) => s.name).sort(),
		[subjectItems],
	);
	const gradeOptions = GRADE_OPTIONS as unknown as string[];

	const topicOptions = useMemo(() => {
		const topics = new Set<string>();
		for (const q of scopedQuestions) {
			if (q.topic) topics.add(q.topic);
			if (q.subtopic?.trim()) topics.add(q.subtopic);
		}
		return Array.from(topics).sort();
	}, [scopedQuestions]);

	const updateEntrySelection = useCallback(
		(partial: Partial<typeof entrySelection>) => {
			setLocalEntry((current) => ({ ...current, ...partial }));
		},
		[],
	);

	const resetEntrySelection = useCallback(() => {
		setLocalEntry({ subjectId: "", subject: "", grade: "" });
	}, []);

	const updateFilters = useCallback((partial: Partial<QuestionFilters>) => {
		setCurrentFilters((current) => ({ ...current, ...partial }));
	}, []);

	const clearFilters = useCallback(() => {
		setCurrentFilters(QUESTION_BANK_FILTER_DEFAULTS);
	}, []);

	const getQuestionHeartCount = useCallback(
		(question: Question) =>
			question.usageCount + (likedQuestionIds.includes(question.id) ? 1 : 0),
		[likedQuestionIds],
	);

	const toggleQuestionLike = useCallback((questionId: string) => {
		setLikedQuestionIds((current) =>
			current.includes(questionId)
				? current.filter((id) => id !== questionId)
				: [...current, questionId],
		);
	}, []);

	const toggleQuestionSelection = useCallback((questionId: string) => {
		setSelectedQuestionIds((current) =>
			current.includes(questionId)
				? current.filter((id) => id !== questionId)
				: [...current, questionId],
		);
	}, []);

	const clearQuestionSelection = useCallback(() => {
		setSelectedQuestionIds([]);
	}, []);

	const openCreateBuilder = useCallback(() => {
		setLastValidationErrors(undefined);
		setEditingValues(
			createQuestionBuilderValues("multiple_choice", {
				grade: entrySelection.grade || undefined,
				subject:
					entrySelection.subject ||
					subjectNameById.get(entrySelection.subjectId) ||
					undefined,
			}),
		);
		setIsBuilderOpen(true);
	}, [
		entrySelection.grade,
		entrySelection.subject,
		entrySelection.subjectId,
		subjectNameById,
	]);

	const openEditBuilder = useCallback(
		(questionId: string) => {
			const q = mergedQuestions.find((item) => item.id === questionId);
			if (!q) return;
			setLastValidationErrors(undefined);
			setEditingValues(mapQuestionToBuilderValues(q));
			setIsBuilderOpen(true);
		},
		[mergedQuestions],
	);

	const closeBuilder = useCallback(() => {
		setIsBuilderOpen(false);
		setEditingValues(null);
		setLastValidationErrors(undefined);
	}, []);

	const deleteQuestion = useCallback(
		(questionId: string) => {
			const target = mergedQuestions.find((q) => q.id === questionId);
			if (target && !isOwnedByTeacher(target, teacher.id, teacher.name)) {
				showToast("Зөвхөн өөрийн үүсгэсэн асуултыг устгана.");
				return;
			}
			setRemovedIds((current) => new Set([...current, questionId]));
			setUpserts((current) => {
				const next = new Map(current);
				next.delete(questionId);
				return next;
			});
			setSelectedQuestionIds((current) =>
				current.filter((id) => id !== questionId),
			);
			setActiveQuestionId((current) =>
				current === questionId ? null : current,
			);
		},
		[mergedQuestions, showToast, teacher.id, teacher.name],
	);

	const submitQuestion = useCallback(
		async (values: Parameters<typeof buildQuestionPayload>[0]) => {
			const errors = validateQuestion(values);
			if (Object.keys(errors).length > 0) {
				setLastValidationErrors(errors);
				return false;
			}
			setLastValidationErrors(undefined);
			const existing = values.id
				? mergedQuestions.find((q) => q.id === values.id)
				: undefined;
			const built = buildQuestionPayload(values, existing);
			const payload: Question = {
				...built,
				source: "school",
				teacherName: teacher.name,
				teacherId: teacher.id,
				grade: entrySelection.grade || built.grade,
				subject: entrySelection.subject || built.subject,
			};

			// Editing flow: update the existing local row immediately so option/count
			// changes (e.g. 2 -> 4 choices) render on the same question card.
			if (existing) {
				setUpserts((current) => {
					const next = new Map(current);
					next.set(payload.id, payload);
					return next;
				});
				setRemovedIds((current) => {
					const next = new Set(current);
					next.delete(payload.id);
					return next;
				});
				setActiveQuestionId(payload.id);
				setPublishSuccessDialogOpen(true);
				setIsBuilderOpen(false);
				setEditingValues(null);
				return true;
			}

			try {
				const subjectId = entrySelection.subjectId;
				if (!subjectId) {
					showToast("Хичээлээ дахин сонгоод оролдоно уу.");
					return false;
				}
				const grade = parseGradeToInt(payload.grade);
				if (payload.questionType === "long_answer") {
					const result = await createOpenExercies({
						variables: {
							input: {
								grade,
								subjectId,
								topic: payload.topic || payload.subject,
								title: payload.title,
								question: payload.content.prompt,
								answer: payload.correctAnswer || null,
								imageUrl: payload.imageUrl || null,
								difficulty: payload.difficulty,
								score: payload.points,
								notes:
									payload.content.explanation ||
									payload.content.guidance ||
									null,
								teacherId: teacher.id,
							},
						},
					});

					const created = result.data?.createOpenExercies;
					if (created) {
						const [mapped] = mapBackendOpenExerciesToQuestions(
							[created],
							subjectNameById,
						);
						if (mapped) {
							setUpserts((current) => {
								const next = new Map(current);
								next.set(mapped.id, {
									...mapped,
									title: payload.title || mapped.title,
									topic: payload.topic || mapped.topic,
									subtopic: payload.subtopic || mapped.subtopic,
									source: "school",
									teacherName: teacher.name,
									teacherId: teacher.id,
								});
								return next;
							});
						}
					}

					if (shouldFetchTests) {
						// Keep list in sync with selected subject/grade.
						refetchOpenExercies();
					}
				} else {
					const answers =
						payload.questionType === "multiple_choice"
							? payload.options.map((o) => o.text)
							: payload.correctAnswer
								? [payload.correctAnswer]
								: [];

					const result = await createTests({
						variables: {
							input: {
								grade,
								subjectId,
								question: payload.content.prompt,
								answers,
								imageUrl: payload.imageUrl || "",
								rightAnswer: payload.correctAnswer || "",
								difficulty: payload.difficulty,
								score: payload.points,
								usageCount: 0,
								notes:
									payload.content.explanation || payload.content.guidance || "",
								teacherId: teacher.id,
							},
						},
					});

					const created = result.data?.createTests;
					if (created) {
						// Ensure UI updates immediately even before refetch paints.
						const [mapped] = mapBackendTestsToQuestions(
							[created as BackendTest],
							subjectNameById,
						);
						if (mapped) {
							setUpserts((current) => {
								const next = new Map(current);
								next.set(mapped.id, {
									...mapped,
									title: payload.title || mapped.title,
									topic: payload.topic || mapped.topic,
									subtopic: payload.subtopic || mapped.subtopic,
									source: "school",
									teacherName: teacher.name,
									teacherId: teacher.id,
								});
								return next;
							});
						}
					}

					if (shouldFetchTests) {
						// Keep list in sync with selected subject/grade.
						refetchTests();
					}
				}

				setPublishSuccessDialogOpen(true);
				setIsBuilderOpen(false);
				setEditingValues(null);
				return true;
			} catch {
				showToast("Асуулт хадгалахад алдаа гарлаа. Дахин оролдоно уу.");
				return false;
			}
		},
		[
			createTests,
			createOpenExercies,
			mergedQuestions,
			entrySelection.grade,
			entrySelection.subject,
			entrySelection.subjectId,
			teacher.name,
			teacher.id,
			refetchTests,
			refetchOpenExercies,
			shouldFetchTests,
			showToast,
			subjectNameById,
		],
	);

	const openBulkImport = useCallback(() => {
		showToast("Олон асуулт оруулах боломж удахгүй нээгдэнэ.");
	}, [showToast]);

	const sendQuestionsToExam = useCallback(
		(questionIds: string[]) => {
			if (questionIds.length === 0) {
				showToast("Дор хаяж нэг асуулт сонгоно уу.");
				return;
			}
			const questions = questionIds
				.map((id) => mergedQuestions.find((q) => q.id === id))
				.filter((q): q is Question => Boolean(q));

			setUpserts((current) => {
				const next = new Map(current);
				for (const question of questions) {
					const latest = next.get(question.id) ?? question;
					next.set(question.id, {
						...latest,
						usageCount: latest.usageCount + 1,
					});
				}
				return next;
			});

			const payload: PendingExamTransfer = {
				questionIds,
				questions,
				exam: {
					grade: entrySelection.grade,
					subject: entrySelection.subject,
					topic: questions[0]?.topic,
				},
			};
			try {
				window.sessionStorage.setItem(
					PENDING_EXAM_TRANSFER_STORAGE_KEY,
					JSON.stringify(payload),
				);
			} catch {
				showToast("Шалгалт руу дамжуулахад алдаа гарлаа.");
				return;
			}
			router.push("/teacher/exam");
		},
		[
			mergedQuestions,
			entrySelection.grade,
			entrySelection.subject,
			router,
			setUpserts,
			showToast,
		],
	);

	return {
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
		openBulkImport,
		openCreateBuilder,
		openEditBuilder,
		publishSuccessDialogOpen,
		resetEntrySelection,
		sendQuestionsToExam,
		selectedQuestionIds,
		setPublishSuccessDialogOpen,
		subjectItems,
		subjectsLoading,
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
	};
}
