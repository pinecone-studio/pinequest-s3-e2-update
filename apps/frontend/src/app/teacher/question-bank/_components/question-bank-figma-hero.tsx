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
    <section className="flex h-[82px] w-[1184px] items-center justify-between">
      <div className="flex h-[52px] w-[408px] shrink-0 flex-col justify-between">
        <h1 className="h-[24px] w-[408px] whitespace-nowrap text-[20px] font-medium uppercase leading-[24px] tracking-[0.1em] text-[#122459]">
          БАГШИЙН АСУУЛТЫН САН
        </h1>
        <p className="h-[17px] w-[284px] whitespace-nowrap text-[14px] font-medium leading-[17px] tracking-[0.1em] text-[#737373]">
          Нэг удаа бэлдээд, ДАХИН АШИГЛА.
        </p>
      </div>

      <div className="mr-[164px] flex h-[82px] w-[240px] shrink-0 items-center rounded-[12px] bg-[#D7ECFF] px-[20px] py-[15px]">
        <div className="flex w-full items-center justify-center gap-[18px]">
          <div className="min-w-[30px] text-[52px] font-medium leading-[52px] text-[#122459]">
            {totalQuestions}
          </div>
          <div className="flex items-center">
            <p className="whitespace-nowrap text-[22px] font-medium uppercase leading-[26px] text-[#122459]">
              БҮХ АСУУЛТ
            </p>
          </div>
        </div>
      </div>

      <button
        className="inline-flex h-[54px] w-[193px] shrink-0 items-center justify-center gap-[8px] whitespace-nowrap rounded-[12px] bg-[#29A4FF] pt-[16px] pr-[14px] pb-[16px] pl-[24px] text-[18px] font-medium leading-[22px] tracking-[0.1em] text-white transition hover:bg-[#29A4FF] mr-[38px]"
        onClick={onCreateQuestion}
        type="button"
      >
        Шинэ асуулт +
      </button>
    </section>
  );
}
