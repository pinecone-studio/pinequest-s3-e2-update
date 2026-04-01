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
    <section className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-6">
      <div className="min-w-0 justify-self-start">
        <h1 className="whitespace-nowrap text-[23px] font-bold uppercase leading-[28px] tracking-[0.1em] text-[#122459]">
          БАГШИЙН АСУУЛТЫН САН
        </h1>
        <p className="mt-[8px] whitespace-nowrap text-[14px] leading-[18px] tracking-[0.1em] text-[#737373]">
          Нэг удаа бэлдээд, дахин ашигла.
        </p>
      </div>

      <div className="inline-flex h-[56px] w-[149px] items-center justify-center gap-[10px] rounded-[12px] bg-[#D7ECFF] px-[18px]">
        <p className="text-[20px] font-medium leading-none tracking-[-0.02em] text-[#122459]">
          {totalQuestions}
        </p>
        <p className="whitespace-nowrap text-[20px] font-medium uppercase leading-none tracking-[-0.02em] text-[#122459]">
          АСУУЛТ
        </p>
      </div>

      <button
        className="inline-flex h-[54px] w-[193px] shrink-0 items-center justify-center gap-[8px] justify-self-end whitespace-nowrap rounded-[12px] bg-[#29A4FF] px-[24px] text-[18px] font-medium leading-[22px] tracking-[0.1em] text-white transition hover:bg-[#29A4FF]"
        onClick={onCreateQuestion}
        type="button"
      >
        Шинэ асуулт +
      </button>
    </section>
  );
}
