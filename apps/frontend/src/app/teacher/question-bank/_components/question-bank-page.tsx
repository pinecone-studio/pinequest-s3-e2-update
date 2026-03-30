"use client";

import {
  CheckCircle2,
  ChevronsRightLeft,
  FileUp,
  Sparkles,
} from "lucide-react";
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
  } = useQuestionBank();

  return (
    <div className="bg-[#fafafa] pb-10">
      <div className="mx-auto max-w-[1184px] px-6 pt-[28px]">
        {!hasEnteredBank ? (
          <section className="min-h-[620px] pl-[88px] pt-[24px]">
            <div className="w-[297px]">
              <h1 className="text-[18px] font-medium uppercase leading-[120%] tracking-[0.1em] text-[#122459]">
                БАГШИЙН АСУУЛТЫН САН
              </h1>
              <p className="mt-[4px] text-[10px] font-normal leading-[120%] text-[#7f8796]">
                Нэг удаа бэлдээд, ДАХИН АШИГЛА.
              </p>
            </div>

            <div className="mt-[31px] flex items-start gap-[14px]">
              <div className="w-[30px] text-[52px] font-medium leading-[100%] tracking-[0.1em] text-[#122459]">
                {summary.systemCount}
              </div>
              <div className="pt-[4px]">
                <p className="h-[26px] text-[22px] font-medium uppercase leading-[120%] tracking-[0.1em] text-[#122459]">
                  БҮХ АСУУЛТ
                </p>
                <p className="mt-[1px] text-[8px] font-normal leading-[120%] text-[#7f8796]">
                  Шалгалтад дахин ашиглана
                </p>
              </div>
            </div>

            <section className="mt-[34px] flex h-[128px] w-[1184px] max-w-full flex-col gap-[18px] rounded-[12px] border border-[#e5e5e5] bg-[#f5f5f5] p-[20px] shadow-none">
              <h2 className="text-[18px] font-medium leading-[120%] text-[#3f3f46]">
                Сонголтын хэсэг
              </h2>

              <div className="flex flex-wrap items-center gap-[12px]">
                <EntrySelect
                  onValueChange={(value) =>
                    updateEntrySelection({ subject: value })
                  }
                  options={subjectOptions}
                  placeholder="Хичээл сонголт"
                  value={entrySelection.subject}
                />
                <EntrySelect
                  onValueChange={(value) =>
                    updateEntrySelection({ grade: value })
                  }
                  options={gradeOptions}
                  placeholder="Анги сонголт"
                  value={entrySelection.grade}
                />
                <button
                  className="inline-flex h-[46px] items-center justify-center rounded-[14px] border border-[#93c5fd] bg-[#eff6ff] px-[18px] text-[13px] font-medium leading-[120%] text-[#1e3a72] transition hover:bg-[#e6f0ff] disabled:cursor-not-allowed disabled:border-[#d7dee9] disabled:bg-[#f5f7fa] disabled:text-[#9aa7bc]"
                  disabled={!entrySelection.subject || !entrySelection.grade}
                  onClick={enterBank}
                  type="button"
                >
                  АСУУЛТ САНД НЭВТРЭХ
                </button>
              </div>
            </section>
          </section>
        ) : (
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#e7e9ee] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:px-6">
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
                      Одоогийн орчин: {entrySelection.subject} •{" "}
                      {entrySelection.grade}
                      {summary.selectedScopeCount !== null
                        ? ` • ${summary.selectedScopeCount} асуулт`
                        : ""}
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

            {toastMessage ? (
              <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#374151] shadow-sm">
                {toastMessage}
              </div>
            ) : null}

            {selectedQuestionIds.length > 0 ? (
              <section className="rounded-[24px] border border-[#d8e2f0] bg-[#f8fbff] px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#183153]">
                      {selectedQuestionIds.length} асуулт сонгогдлоо
                    </p>
                    <p className="text-sm text-[#6b7280]">
                      Сонгосон асуултуудаа нэг дор шалгалт руу нэмэх боломжтой.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white px-4 text-sm font-medium text-[#355caa] transition hover:border-[#bfd2f6] hover:bg-[#f8fbff]"
                      onClick={clearQuestionSelection}
                      type="button"
                    >
                      Сонголт цэвэрлэх
                    </button>
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
                      onClick={() => sendQuestionsToExam(selectedQuestionIds)}
                      type="button"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Сонгосон асуултуудыг шалгалтанд нэмэх
                    </button>
                  </div>
                </div>
              </section>
            ) : null}

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
                    onAddToExam={(questionId) =>
                      sendQuestionsToExam([questionId])
                    }
                    onCreateQuestion={openCreateBuilder}
                    onDeleteQuestion={deleteQuestion}
                    onEditQuestion={openEditBuilder}
                    onOpenQuestion={setActiveQuestionId}
                    onToggleQuestionSelection={toggleQuestionSelection}
                    onToggleLike={toggleQuestionLike}
                    questions={myQuestions}
                    selectedQuestionIds={selectedQuestionIds}
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
                  onAddToExam={(questionId) =>
                    sendQuestionsToExam([questionId])
                  }
                  onCreateQuestion={openCreateBuilder}
                  onDeleteQuestion={deleteQuestion}
                  onEditQuestion={openEditBuilder}
                  onOpenQuestion={setActiveQuestionId}
                  onToggleQuestionSelection={toggleQuestionSelection}
                  onToggleLike={toggleQuestionLike}
                  questions={filteredQuestions}
                  selectedQuestionIds={selectedQuestionIds}
                />
                <div className="xl:sticky xl:top-24 xl:self-start">
                  <QuestionPreviewPanel question={activeQuestion} />
                </div>
              </div>
            </div>
          </div>
        )}

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
                Асуулт системийн санд амжилттай нийтлэгдэж, бүх багшид
                харагдахаар боллоо.
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
    </div>
  );
}

function EntrySelect({
  value,
  onValueChange,
  options,
  placeholder,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="h-[46px] w-[152px] rounded-[12px] border-[#e5e5e5] bg-[#fcfcfb] px-[14px] text-[13px] font-normal leading-[120%] text-[#a1a1aa] shadow-none focus:border-[#d7dfe9] focus:ring-2 focus:ring-[#e8eef8] focus-visible:border-[#d7dfe9] focus-visible:ring-2 focus-visible:ring-[#e8eef8]">
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
  );
}
