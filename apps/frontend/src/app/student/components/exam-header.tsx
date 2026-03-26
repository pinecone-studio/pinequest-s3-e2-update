import { Clock3 } from "lucide-react";

type ExamHeaderProps = {
  title: string;
  subtitle: string;
  timerText: string;
};

export function ExamHeader({ title, subtitle, timerText }: ExamHeaderProps) {
  return (
    <section className="rounded-3xl border border-[#dbe3f0] bg-white p-6 shadow-[0_12px_32px_rgba(27,39,80,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-6 font-extrabold text-[#1f2a44]">{title}</h1>
          <p className="mt-1 text-4 text-[#5f7090]">{subtitle}</p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full border border-[#d7e2f5] bg-[#f4f8ff] px-4 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dbeafe]">
            <Clock3 className="h-5 w-5 text-[#2563eb]" />
          </div>
          <div>
            <p className="text-4 font-extrabold text-[#1f2a44]">{timerText}</p>
            <p className="text-2 text-[#5f7090]">үлдсэн хугацаа</p>
          </div>
        </div>
      </div>
    </section>
  );
}
