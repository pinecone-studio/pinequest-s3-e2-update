type ExamHeaderProps = {
  title: string;
  subtitle: string;
  timerText: string;
  rightSlot?: React.ReactNode;
};

export function ExamHeader({
  title,
  subtitle,
  timerText,
  rightSlot,
}: ExamHeaderProps) {
  return (
    <section className="grid gap-4 rounded-[14px] bg-[#EDF6FF] px-5 py-4 sm:gap-5 sm:px-5 sm:py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6 xl:grid-cols-[minmax(0,520px)_auto]">
      <div className="min-w-0 order-2 sm:order-1">
        <div className="w-full max-w-[360px]">
          <div className="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-[12px] border border-[#8d8d8d] bg-white px-3 py-2 sm:rounded-[14px] sm:px-4 sm:py-2.5">
            <p className="shrink-0 text-[13px] font-medium text-[#2d2d2d] sm:text-[16px]">
          Үлдсэн хугацаа
            </p>
            <p className="tabular-nums text-[20px] font-semibold leading-none tracking-[-0.02em] text-[#2b2b2b] sm:text-[28px]">
              {timerText}
            </p>
          </div>

          <div className="mt-3 min-w-0">
            <h1 className="break-words text-base font-semibold leading-snug text-[#162a68] sm:text-lg lg:text-[20px]">
              {title}
            </h1>
            <p className="mt-1 break-words text-sm font-medium leading-snug text-[#8a8a8a] sm:text-[15px] lg:text-[16px]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="order-1 flex w-full items-center justify-center sm:order-2 sm:w-auto lg:justify-end">
        {rightSlot}
      </div>
    </section>
  );
}
