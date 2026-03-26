"use client";

export function EmptyState({ onCreateQuestion }: { onCreateQuestion: () => void }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#c7d8ef] bg-[#f8fbff] p-10 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7d8ca5]">
          Илэрц олдсонгүй
        </p>
        <h3 className="mt-3 text-2xl font-bold text-[#183153]">Таны асуултын сан дараагийн чанартай асуултаа хүлээж байна.</h3>
        <p className="mt-2 text-sm leading-6 text-[#637690]">
          Шүүлтүүрээ өөрчлөх эсвэл шинэ асуулт үүсгээд дараагийн шалгалтууддаа дахин ашиглах
          контентоо бүрдүүлж эхлээрэй.
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
