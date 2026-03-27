"use client";

export function EmptyState({
  onCreateQuestion,
}: {
  onCreateQuestion: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#c7d8ef] bg-[#f8fbff] p-10 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7d8ca5]">
          Илэрц олдсонгүй
        </p>

        <p className="mt-2 text-xl leading-6 font-semibold text-[#6d7f98]">
          Шалгалтууддаа дахин ашиглах асуултаа бүрдүүлж эхлээрэй.
        </p>
        <button
          className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#1f6feb] px-5 text-sm font-semibold text-white transition hover:bg-[#195fcc]"
          onClick={onCreateQuestion}
          type="button"
        >
          Анхны асуултаа үүсгэх
        </button>
      </div>
    </div>
  );
}
