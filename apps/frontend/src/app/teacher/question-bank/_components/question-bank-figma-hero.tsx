"use client";

type QuestionBankFigmaHeroProps = {
  onCreateQuestion: () => void;
  totalQuestions: number;
};

export function QuestionBankFigmaHero({
  onCreateQuestion,
  totalQuestions,
}: QuestionBankFigmaHeroProps) {
  return (
    <section className="flex w-full flex-col gap-4 sm:gap-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
      <div className="min-w-0 lg:justify-self-start">
        <h1 className="text-[17px] font-bold uppercase leading-snug tracking-[0.08em] text-[#122459] sm:text-[20px] sm:leading-[28px] sm:tracking-[0.1em] md:text-[23px]">
          БАГШИЙН АСУУЛТЫН САН
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-[18px] tracking-[0.06em] text-[#737373] sm:mt-[8px] sm:text-[14px] sm:tracking-[0.1em]">
          Нэг удаа бэлдээд, дахин ашигла.
        </p>
      </div>

      <div className="inline-flex h-[52px] w-fit min-w-0 shrink-0 items-center justify-center gap-2 self-start rounded-[12px] bg-[#D7ECFF] px-4 sm:h-[56px] sm:gap-[10px] sm:px-[18px] lg:self-center">
        <p className="text-[18px] font-medium leading-none tracking-[-0.02em] text-[#122459] sm:text-[20px]">
          {totalQuestions}
        </p>
        <p className="whitespace-nowrap text-[16px] font-medium uppercase leading-none tracking-[-0.02em] text-[#122459] sm:text-[20px]">
          АСУУЛТ
        </p>
      </div>

      <button
        className="inline-flex h-[50px] w-full min-w-0 shrink-0 items-center justify-center gap-2 rounded-[12px] bg-[#29A4FF] px-5 text-[15px] font-medium leading-snug tracking-[0.06em] text-white transition hover:bg-[#29A4FF] sm:h-[54px] sm:w-auto sm:px-[24px] sm:text-[18px] sm:leading-[22px] sm:tracking-[0.1em] lg:justify-self-end"
        onClick={onCreateQuestion}
        type="button"
      >
        Шинэ асуулт +
      </button>
    </section>
  );
}
