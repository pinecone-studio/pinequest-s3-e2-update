type ExamHeaderProps = {
  title: string;
  subtitle: string;
  timerText: string;
};

export function ExamHeader({ title, subtitle, timerText }: ExamHeaderProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[520px_1fr] xl:items-center">
      <div className="inline-flex w-full max-w-[409px] items-center justify-between rounded-[22px] border border-[#B8DCFF]  px-5 py-4">
        <p className="text-[22px] font-medium text-[#122459]">
          Үлдсэн хугацаа
        </p>
        <p className="text-[52px] font-medium leading-none tracking-[-0.04em] text-[#122459]">
          {timerText}
        </p>
      </div>

      <div className="flex flex-col items-center text-center xl:items-end xl:text-right">
        <h1 className="text-[20px] font-medium leading-[120%] tracking-[0.1em] text-[#122459]">
          {title}
        </h1>
        <p className="mt-1 text-[16px] font-medium leading-[120%] tracking-[0.04em] text-[#8a8a8a]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
