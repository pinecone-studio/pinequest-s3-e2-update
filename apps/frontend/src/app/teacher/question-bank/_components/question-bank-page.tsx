"use client";

import { ArrowRight, CheckCircle2, ChevronsRightLeft, FileUp, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionBuilderForm } from "./question-builder-form";
import { QuestionFilters } from "./question-filters";
import { QuestionList } from "./question-list";
import { QuestionPreviewPanel } from "./question-preview-panel";
import { useQuestionBank } from "../_hooks/use-question-bank";

export function QuestionBankPage() {
  const {
    clearFilters,
    closeBuilder,
    currentFilters,
    deleteQuestion,
    enterBank,
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
    setPublishSuccessDialogOpen,
    subjectOptions,
    submitQuestion,
    summary,
    setActiveQuestionId,
    toastMessage,
    toggleQuestionLike,
    topicOptions,
    updateEntrySelection,
    updateFilters,
  } = useQuestionBank();

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
        {!hasEnteredBank ? (
          <section className="rounded-[28px] border border-[#e7e9ee] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:px-6 xl:min-w-0 xl:flex-1">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#355caa]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
                  Системийн санд нэвтрэх
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                  Эхлээд хичээл болон ангиа сонгоод тухайн хүрээний асуултууд руу нэвтэрнэ.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <EntrySelect
                label="Хичээл"
                onValueChange={(value) => updateEntrySelection({ subject: value })}
                options={subjectOptions}
                placeholder="Хичээл сонгох"
                value={entrySelection.subject}
              />
              <EntrySelect
                label="Анги"
                onValueChange={(value) => updateEntrySelection({ grade: value })}
                options={gradeOptions}
                placeholder="Анги сонгох"
                value={entrySelection.grade}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                className="inline-flex h-11 items-center justify-center self-start rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:bg-[#d1d5db]"
                disabled={!entrySelection.subject || !entrySelection.grade}
                onClick={enterBank}
                type="button"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Системийн санд нэвтрэх
              </button>
              <p className="text-sm text-[#6b7280]">
                Сонгосон хичээл, ангид тохирох асуултуудыг шууд шүүж харуулна.
              </p>
            </div>
          </section>
        ) : (
          <section className="rounded-[28px] border border-[#e7e9ee] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:px-6 xl:min-w-0 xl:flex-1">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#355caa]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
                    Системийн сан
                  </h2>
                  <p className="text-sm leading-6 text-[#6b7280]">
                    Одоогийн орчин: {entrySelection.subject} • {entrySelection.grade}
                    {summary.selectedScopeCount !== null ? ` • ${summary.selectedScopeCount} асуулт` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white px-4 text-sm font-medium text-[#355caa] transition hover:border-[#bfd2f6] hover:bg-[#f8fbff]"
                  onClick={resetEntrySelection}
                  type="button"
                >
                  <ChevronsRightLeft className="mr-2 h-4 w-4" />
                  Сонголт солих
                </button>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white px-4 text-sm font-medium text-[#355caa] transition hover:border-[#bfd2f6] hover:bg-[#f8fbff]"
                  onClick={openBulkImport}
                  type="button"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Bulk import
                </button>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] active:translate-y-px"
                  onClick={openCreateBuilder}
                  type="button"
                >
                  + Асуулт нэмэх
                </button>
              </div>

              <div className="border-t border-[#edf1f5] pt-6">
                <QuestionFilters
                  embedded
                  filters={currentFilters}
                  gradeOptions={gradeOptions}
                  onChange={updateFilters}
                  onClear={clearFilters}
                  subjectOptions={subjectOptions}
                  topicOptions={topicOptions}
                />
              </div>
            </div>
          </section>
        )}
      </div>

      {toastMessage ? (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#374151] shadow-sm">
          {toastMessage}
        </div>
      ) : null}

      {hasEnteredBank ? (
        <>
          <section className="rounded-[28px] border border-[#e7e9ee] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
                  Миний хэсэг
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#111827]">
                  Миний үүсгэсэн асуултууд
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                  Таны өөрөө нэмсэн, засварлах боломжтой асуултууд.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-[#dbe4f0] bg-[#f8fbff] px-3 py-1.5 text-sm font-medium text-[#355caa]">
                {summary.myQuestionCount} асуулт
              </div>
            </div>

            <div className="mt-6">
              {myQuestions.length > 0 ? (
                <QuestionList
                  activeQuestionId={activeQuestion?.id ?? null}
                  getQuestionHeartCount={getQuestionHeartCount}
                  likedQuestionIds={likedQuestionIds}
                  onAddToExam={(questionId) => sendQuestionsToExam([questionId])}
                  onCreateQuestion={openCreateBuilder}
                  onDeleteQuestion={deleteQuestion}
                  onEditQuestion={openEditBuilder}
                  onOpenQuestion={setActiveQuestionId}
                  onToggleLike={toggleQuestionLike}
                  questions={myQuestions}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-[#dbe4f0] bg-[#fbfdff] px-5 py-8 text-sm text-[#6b7280]">
                  Одоогоор таны үүсгэсэн асуулт алга байна.
                </div>
              )}
            </div>
          </section>

          <div className="qb-fade-up">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
                  Системийн сан
                </p>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
                  Бүх асуултууд
                </h2>
              </div>
              <p className="text-sm text-[#6b7280]">
                Сонгосон хүрээний бүх багшийн асуултууд
              </p>
            </div>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
              <QuestionList
                activeQuestionId={activeQuestion?.id ?? null}
                getQuestionHeartCount={getQuestionHeartCount}
                likedQuestionIds={likedQuestionIds}
                onAddToExam={(questionId) => sendQuestionsToExam([questionId])}
                onCreateQuestion={openCreateBuilder}
                onDeleteQuestion={deleteQuestion}
                onEditQuestion={openEditBuilder}
                onOpenQuestion={setActiveQuestionId}
                onToggleLike={toggleQuestionLike}
                questions={filteredQuestions}
              />
              <div className="xl:sticky xl:top-24 xl:self-start">
                <QuestionPreviewPanel question={activeQuestion} />
              </div>
            </div>
          </div>
        </>
      ) : null}

      {isBuilderOpen ? (
        <QuestionBuilderForm
          initialValues={editingValues}
          key={editingValues?.id ?? "new-question"}
          onClose={closeBuilder}
          onSubmit={submitQuestion}
          subjectOptions={subjectOptions}
          validationErrors={lastValidationErrors}
        />
      ) : null}

      {publishSuccessDialogOpen ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#111827]/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[28px] border border-[#ebeef3] bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#111827]">
              Амжилттай нийтэллээ
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              Асуулт системийн санд амжилттай нийтлэгдэж, бүх багшид харагдахаар боллоо.
            </p>
            <button
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              onClick={() => setPublishSuccessDialogOpen(false)}
              type="button"
            >
              Ойлголоо
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EntrySelect({
  label,
  value,
  onValueChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
        {label}
      </span>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="h-12 rounded-xl border-[#e5e7eb] bg-[#fbfbfc] text-sm text-[#111827] focus:border-[#d1d5db] focus:ring-4 focus:ring-[#e5e7eb] focus-visible:border-[#d1d5db] focus-visible:ring-4 focus-visible:ring-[#e5e7eb]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
