"use client";

import { Wrench } from "lucide-react";
import { NATIONAL_SCRIPT_SUBJECT } from "../_lib/constants";
import type { Question } from "../_lib/types";
import {
  DIFFICULTY_LABELS,
  hasTraditionalMongolianText,
  resolveQuestionTitle,
} from "../_lib/utils";
import { QuestionBankActivePanel } from "./bank/question-bank-active-panel";
import { QuestionBankBulkToolbar } from "./bank/question-bank-bulk-toolbar";
import { QuestionList } from "./question/question-list";

type QuestionBankFigmaResultsProps = {
  activeQuestionId: string | null;
  getQuestionHeartCount: (question: Question) => number;
  likedQuestionIds: string[];
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
  likedQuestionIds,
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
  const [activeCategory, setActiveCategory] = useState<"bank" | "management">(
    "bank",
  );

  return (
    <div className="space-y-[18px]">
      <section className="space-y-[20px] rounded-[10px] border border-[#ECECEC] bg-white px-[28px] pb-[28px] pt-[26px]">
        <div className="grid grid-cols-2 overflow-hidden rounded-[6px] bg-[#f3f3f3]">
          <button
            className={`h-[56px] text-[26px] font-medium uppercase tracking-[0.08em] ${
              activeCategory === "bank"
                ? "bg-[#e9e9e9] text-[#122459]"
                : "bg-white text-[#122459]"
            }`}
            onClick={() => setActiveCategory("bank")}
            type="button"
          >
            АСУУЛТЫН САН
          </button>
          <button
            className={`h-[56px] text-[26px] font-medium uppercase tracking-[0.08em] ${
              activeCategory === "management"
                ? "bg-[#e9e9e9] text-[#122459]"
                : "bg-white text-[#122459]"
            }`}
            onClick={() => setActiveCategory("management")}
            type="button"
          >
            АСУУЛТЫН УДИРДЛАГА
          </button>
        </div>

        {activeCategory === "bank" ? (
          <div className="grid grid-cols-[minmax(0,1.78fr)_381px] items-start gap-[22px]">
            <QuestionList
              activeQuestionId={activeQuestionId}
              getQuestionHeartCount={getQuestionHeartCount}
              likedQuestionIds={likedQuestionIds}
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
        ) : myQuestions.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[#404040] px-[20px] py-[42px] text-center">
            <p className="text-[24px] font-medium leading-[30px] text-[#122459]">
              Одоогоор таны үүсгэсэн асуулт алга байна.
            </p>
          </div>
        ) : (
          <div className="mt-[12px] flex items-stretch gap-[14px] overflow-x-auto pb-[4px]">
            {myQuestions.map((question) => {
              const isNationalScript =
                question.subject === NATIONAL_SCRIPT_SUBJECT;
              const shouldRenderPromptVertical =
                isNationalScript &&
                hasTraditionalMongolianText(question.content.prompt);

              return (
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
                    <Chip tone="outline">
                      {DIFFICULTY_LABELS[question.difficulty]}
                    </Chip>
                  </div>

                  <h3 className="mt-[14px] text-[16px] font-medium leading-[20px] text-[#323232]">
                    {resolveQuestionTitle(
                      question.title,
                      question.content.prompt,
                    ) || "Асуултын гарчиг"}
                  </h3>
                  <p
                    className={`mt-[10px] text-[14px] text-[#7B7B7B] ${
                      shouldRenderPromptVertical
                        ? "min-h-32 overflow-x-auto leading-8"
                        : "line-clamp-2 leading-[22px]"
                    }`}
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
                    {question.content.prompt}
                  </p>

                  {question.questionType === "multiple_choice" ? (
                    <div className="mt-[12px] space-y-[8px]">
                      {question.options.slice(0, 4).map((option, index) => (
                        <div
                          className={`rounded-[6px] border px-[16px] text-[12px] leading-[15px] ${
                            option.isCorrect
                              ? "border-[#7DC8FF] bg-[#75B8ED] text-[#122459]"
                              : "border-[#B8D9FF] bg-white text-[#122459]"
                          }`}
                          key={option.id}
                        >
                          <div
                            className={`flex ${
                              isNationalScript
                                ? "min-h-24 items-start gap-[12px] py-[10px]"
                                : "h-[38px] items-center"
                            }`}
                          >
                            <span className="shrink-0">{index + 1}.</span>
                            <span
                              className={
                                isNationalScript &&
                                hasTraditionalMongolianText(option.text)
                                  ? "overflow-x-auto leading-7"
                                  : ""
                              }
                              style={
                                isNationalScript &&
                                hasTraditionalMongolianText(option.text)
                                  ? {
                                      writingMode: "vertical-lr",
                                      textOrientation: "mixed",
                                      whiteSpace: "pre-wrap",
                                    }
                                  : undefined
                              }
                            >
                              {option.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-[12px]">
                    <div className="grid grid-cols-[1fr_auto] gap-x-[16px] gap-y-[8px] bg-[#DCEEFF] px-[16px] py-[14px]">
                      <MetaRow label="Сургууль" value="21" />
                      <MetaRow
                        label="Багш"
                        value={question.teacherName ?? "—"}
                      />
                      <MetaRow label="Анги" value={question.grade} />
                      <MetaRow label="Хичээл" value={question.subject} />
                      <MetaRow
                        label="Сэдэв"
                        value={question.subtopic?.trim() || question.topic}
                      />
                      <MetaRow label="Оноо" value={`${question.points}`} />
                      <MetaRow
                        label="Ашигласан тоо"
                        value={`${question.usageCount}`}
                      />
                      <MetaRow label="Шинэчилсэн" value={question.updatedAt} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex h-[26px] items-center rounded-[8px] border border-[#ECECEC] bg-white px-[16px] text-[12px] font-normal leading-[14px] text-[#0A0A0A]"
    >
      {children}
    </span>
  );
}
