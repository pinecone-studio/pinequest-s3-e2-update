"use client";

type QuestionHeaderProps = {
  total: number;
  published: number;
  draft: number;
  manual: number;
  onCreateQuestion: () => void;
};

export function QuestionHeader({
  total,
  published,
  draft,
  manual,
  onCreateQuestion,
}: QuestionHeaderProps) {
  const stats = [
    {
      label: "Нийт асуулт",
      value: total,
      hint: "Олон шалгалтад дахин ашиглана",
    },
    { label: "Нийтэлсэн", value: published, hint: "Шалгалтад нэмэхэд бэлэн" },
    {
      label: "Ноорог",
      value: draft,
      hint: "Ашиглахаас өмнө хянах шаардлагатай",
    },
    {
      label: "Гараар үнэлэх",
      value: manual,
      hint: "Багшийн үнэлгээ шаардлагатай",
    },
  ];

  return (
    <section className="rounded-[28px] border border-[#d8e6fb] bg-[linear-gradient(135deg,#ffffff_0%,#eef6ff_58%,#f7fbff_100%)] p-6 shadow-[0_16px_40px_rgba(79,157,255,0.12)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex rounded-full border border-[#bfd8ff] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#4f6b96]">
            Багшийн асуултын сан
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#183153] sm:text-2xl">
              Нэг удаа үүсгээд, олон дахин ашигла.
            </h1>
          </div>
        </div>

        <button
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#1f6feb] px-5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(31,111,235,0.24)] transition hover:bg-[#195fcc]"
          onClick={onCreateQuestion}
          type="button"
        >
          Асуулт үүсгэх
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm"
            key={item.label}
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7b8ba5]">
              {item.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-[#183153]">
              {item.value}
            </p>
            <p className="mt-1 text-sm text-[#6d7f9c]">{item.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
