"use client";

import { Wrench } from "lucide-react";
import type { Question } from "../_lib/types";
import { DIFFICULTY_LABELS } from "../_lib/utils";
import { QuestionBankActivePanel } from "./bank/question-bank-active-panel";
import { QuestionBankBulkToolbar } from "./bank/question-bank-bulk-toolbar";
import { QuestionList } from "./question/question-list";

type QuestionBankFigmaResultsProps = {
  activeQuestionId: string | null;
  getQuestionHeartCount: (question: Question) => number;
  myQuestionCount: number;
  myQuestions: Question[];
  onAddToExam: (questionId: string) => void;
  onCreateQuestion: () => void;
  onOpenQuestion: (questionId: string) => void;
  onToggleLike: (questionId: string) => void;
  onToggleSelection: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  previewQuestion: Question | null;
  questions: Question[];
  selectedQuestionIds: string[];
  selectedCount: number;
  onClearSelection: () => void;
  onSendSelectedToExam: () => void;
};

export function QuestionBankFigmaResults({
  activeQuestionId,
  getQuestionHeartCount,
  myQuestionCount,
  myQuestions,
  onAddToExam,
  onCreateQuestion,
  onOpenQuestion,
  onToggleLike,
  onToggleSelection,
  onEditQuestion,
  previewQuestion,
  questions,
  selectedQuestionIds,
  selectedCount,
  onClearSelection,
  onSendSelectedToExam,
}: QuestionBankFigmaResultsProps) {
  return (
    <div className="space-y-[18px]">
      <section className="rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] px-[20px] py-[20px]">
        <div className="flex items-start justify-between gap-[18px]">
          <div className="min-w-0">
            <h2 className="text-[24px] font-medium leading-[29px] tracking-[0.01em] text-[#122459]">
              Миний үүсгэсэн асуултууд
            </h2>
            <p className="mt-[4px] text-[14px] font-normal leading-[17px] text-[#737373]">
              Таны өөрөө нэмсэн, засварлах боломжтой асуултууд.
            </p>
          </div>
          <span className="shrink-0 pt-[1px] text-[24px] font-medium leading-[29px] text-[#122459]">
            {myQuestionCount} асуулт
          </span>
        </div>

        {myQuestions.length === 0 ? (
          <div className="mt-[12px] rounded-[12px] border border-dashed border-[#404040] px-[20px] py-[42px] text-center">
            <p className="text-[24px] font-medium leading-[30px] text-[#122459]">
              Одоогоор таны үүсгэсэн асуулт алга байна.
            </p>
          </div>
        ) : (
          <div className="mt-[12px] flex items-stretch gap-[14px] overflow-x-auto pb-[4px]">
            {myQuestions.map((question) => (
              <article
                className="basis-[calc((100%-28px)/3)] shrink-0 rounded-[12px] border border-[#7DC8FF] bg-[#FAFAFA] p-[16px]"
                key={question.id}
              >
                <div className="flex items-start justify-between gap-[10px]">
                  <p className="text-[13px] font-normal uppercase leading-[16px] text-[#7B7B7B]">
                    АСУУЛТЫН ДЭЛГЭРЭНГҮЙ
                  </p>
                  <button
                    className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-[#7DC8FF] text-[#122459] transition hover:bg-[#eaf4ff]"
                    onClick={() => onEditQuestion(question.id)}
                    type="button"
                  >
                    <Wrench className="h-[22px] w-[22px]" />
                  </button>
                </div>

                <div className="mt-[10px] flex flex-wrap gap-[6px]">
                  <Chip tone="filled">Нэгтгэсэн</Chip>
                  <Chip tone="outline">
                    {question.questionType === "multiple_choice"
                      ? "Сонгох асуулт"
                      : "Задгай"}
                  </Chip>
                  <Chip tone="outline">
                    {question.gradingType === "auto"
                      ? "Автомат үнэлгээ"
                      : "Гар үнэлгээ"}
                  </Chip>
                  <Chip tone="outline">{DIFFICULTY_LABELS[question.difficulty]}</Chip>
                </div>

                <h3 className="mt-[14px] text-[16px] font-medium leading-[20px] text-[#323232]">
                  {question.title || "Асуултын гарчиг"}
                </h3>
                <p className="mt-[10px] line-clamp-2 text-[14px] leading-[22px] text-[#7B7B7B]">
                  {question.content.prompt}
                </p>

                {question.questionType === "multiple_choice" ? (
                  <div className="mt-[12px] space-y-[8px]">
                    {question.options.slice(0, 4).map((option, index) => (
                      <div
                        className={`flex h-[38px] items-center rounded-[6px] border px-[16px] text-[12px] leading-[15px] ${
                          option.isCorrect
                            ? "border-[#7DC8FF] bg-[#75B8ED] text-[#122459]"
                            : "border-[#B8D9FF] bg-white text-[#122459]"
                        }`}
                        key={option.id}
                      >
                        <span className="mr-[12px] shrink-0">{index + 1}.</span>
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-[12px]">
                  <div className="grid grid-cols-[1fr_auto] gap-x-[16px] gap-y-[8px] bg-[#DCEEFF] px-[16px] py-[14px]">
                  <MetaRow label="Сургууль" value="21" />
                  <MetaRow label="Багш" value={question.teacherName ?? "—"} />
                  <MetaRow label="Анги" value={question.grade} />
                  <MetaRow label="Хичээл" value={question.subject} />
                  <MetaRow
                    label="Сэдэв"
                    value={question.subtopic?.trim() || question.topic}
                  />
                  <MetaRow label="Оноо" value={`${question.points}`} />
                  <MetaRow label="Ашигласан тоо" value={`${question.usageCount}`} />
                  <MetaRow label="Шинэчилсэн" value={question.updatedAt} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-[20px] rounded-[12px] border border-[#E5E5E5] bg-white px-[28px] pb-[28px] pt-[26px]">
        <h2 className="text-[26px] font-medium uppercase leading-[31px] tracking-[0.08em] text-[#122459]">
          АСУУЛТЫН САН
        </h2>

        <div className="grid grid-cols-[minmax(0,1.78fr)_381px] items-start gap-[22px]">
          <QuestionList
            activeQuestionId={activeQuestionId}
            getQuestionHeartCount={getQuestionHeartCount}
            likedQuestionIds={[]}
            onAddToExam={onAddToExam}
            onCreateQuestion={onCreateQuestion}
            onDeleteQuestion={() => {}}
            onEditQuestion={onEditQuestion}
            onOpenQuestion={onOpenQuestion}
            onToggleQuestionSelection={onToggleSelection}
            onToggleLike={onToggleLike}
            questions={questions}
            selectedQuestionIds={selectedQuestionIds}
          />
          <div className="space-y-[12px] pt-[4px]">
            <QuestionBankBulkToolbar
              count={selectedCount}
              onClear={onClearSelection}
              onSendToExam={onSendSelectedToExam}
            />
            <QuestionBankActivePanel question={previewQuestion} />
          </div>
        </div>
      </section>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="contents">
      <span className="text-[12px] leading-[15px] text-[#23407D]">{label}</span>
      <span className="text-[12px] leading-[15px] text-[#23407D]">{value}</span>
    </div>
  );
}

function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "filled" | "outline";
}) {
  return (
    <span
      className={`inline-flex h-[28px] items-center rounded-[8px] px-[16px] text-[12px] font-medium leading-[14px] ${
        tone === "filled"
          ? "bg-[#AED5FF] text-[#122459]"
          : "border border-[#AED5FF] bg-white text-[#122459]"
      }`}
    >
      {children}
    </span>
  );
}
