type ExamHeaderProps = {
  title: string;
  subtitle: string;
  timerText: string;
};

export function ExamHeader({ title, subtitle, timerText }: ExamHeaderProps) {
  return (
    <section className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-6 xl:grid-cols-[minmax(0,520px)_1fr]">
      <div className="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-[18px] border border-[#B8DCFF] px-3 py-3 sm:rounded-[22px] sm:px-5 sm:py-4 lg:max-w-[409px]">
        <p className="shrink-0 text-sm font-medium text-[#122459] sm:text-lg lg:text-[22px]">
          Үлдсэн хугацаа
        </p>
        <p className="tabular-nums text-2xl font-medium leading-none tracking-[-0.04em] text-[#122459] sm:text-4xl md:text-5xl xl:text-[52px]">
          {timerText}
        </p>
      </div>

      <div className="flex min-w-0 flex-col items-center text-center lg:items-end lg:text-right">
        <h1 className="break-words text-base font-medium leading-snug tracking-[0.06em] text-[#122459] sm:text-lg sm:tracking-[0.1em] lg:text-[20px]">
          {title}
        </h1>
        <p className="mt-1 break-words text-sm font-medium leading-snug tracking-[0.03em] text-[#8a8a8a] sm:text-[15px] sm:tracking-[0.04em] lg:text-[16px]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
