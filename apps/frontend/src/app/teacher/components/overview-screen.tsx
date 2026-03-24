export default function OverviewScreen() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-8">
      <section className="rounded-2xl border border-[#d9dee8] bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d7ebff] text-8 text-[#4ea4f1]" type="button">
              ‹
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5eaef4] text-8 font-bold text-white">
              Б
            </div>
            <div>
              <p className="text-8 font-extrabold">Батбаяр Доржсүрэн</p>
              <p className="text-4 text-[#44506a]">batbayar@school.mn</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="text-8 font-bold">1/6</span>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d7ebff] text-8 text-[#4ea4f1]" type="button">
              ›
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#d9dee8] bg-white p-6">
          <p className="mb-4 text-8 font-bold">Асуулт: 1</p>
          <p className="text-8 font-medium leading-relaxed">
            Монгол Улсын Үндсэн хуулийн гол зарчмуудыг тайлбарлаж, өнөөгийн
            нийгэмд хэрхэн хэрэгжиж байгааг жишээ дээр тодруулна уу?
          </p>
          <div className="mt-6 flex items-center gap-4 text-4">
            <span className="rounded-full bg-[#fff3c8] px-3 py-1 font-semibold text-[#7a6420]">
              Нээлттэй хариулт
            </span>
            <span className="font-bold">Оноо: 20</span>
          </div>
        </article>

        <div className="lg:pl-2">
          <button className="w-full rounded-2xl bg-[#4ca3f0] px-6 py-6 text-8 font-bold text-white transition hover:bg-[#3996ea]" type="button">
            AI-аар шалгах
          </button>
        </div>
      </section>

      <section className="max-w-3xl rounded-2xl border border-[#d9dee8] bg-white p-6">
        <p className="mb-4 text-8 font-bold">Сурагчийн хариулт</p>
        <div className="rounded-2xl bg-[#eaf1f8] p-5 text-4 leading-relaxed text-[#2d3a56]">
          Монгол Улсын Үндсэн хууль нь 1992 онд батлагдсан бөгөөд манай улсын хамгийн
          дээд хууль юм. Үндсэн хуулийн гол зарчмуудад ардчилал, хүний эрх, үндэсний
          тогтвортой байдал, хууль дээдлэх ёс зэрэг багтдаг. Өнөөдөр эдгээр зарчмууд
          манай нийгэмд олон талаар хэрэгжиж байна.
        </div>
        <p className="mt-4 text-4 text-[#61749a]">Илгээсэн: 3/20/2026, 6:30:00 PM</p>
      </section>

      <button className="w-full max-w-3xl rounded-2xl border border-[#d9dee8] bg-white py-5 text-8 font-medium text-[#2f3c59] transition hover:bg-[#f7f9fc]" type="button">
        Сурагчийн харагдац
      </button>
    </main>
  );
}
