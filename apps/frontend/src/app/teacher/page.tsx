import { ArrowRight, Shield, Sparkles, Users, Zap } from "lucide-react";

export default function TeacherPage() {
  const features = [
    {
      title: "Олон төрлийн асуулт",
      desc: "Томьёо, зураг, видео болон холимог контент бүхий асуултууд",
      icon: Sparkles,
      iconClass: "bg-teal-600",
    },
    {
      title: "Автомат дүн тооцоолох",
      desc: "AI-д суурилсан автомат шалгалт болон багшийн хяналт",
      icon: Zap,
      iconClass: "bg-[#d946ef]",
    },
    {
      title: "Олон хэрэглэгч",
      desc: "Багш, сурагч, эцэг эх, админ - бүгдэд нэгдсэн платформ",
      icon: Users,
      iconClass: "bg-[#22c55e]",
    },
    {
      title: "Найдвартай систем",
      desc: "Өндөр найдвартай, аюулгүй, тогтвортой ажиллагаа",
      icon: Shield,
      iconClass: "bg-[#f59e0b]",
    },
  ];

  return (
    <section className="min-h-screen px-6 py-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-[#d9dee8] bg-white p-6 shadow-sm">
            <span className="inline-flex items-center rounded-full border border-[#d9dee8] bg-teal-50 px-3 py-2 text-[#5e6a85]">
              <span className="mr-2 text-[#22c55e]">●</span> Монголын боловсролын шинэ
              түвшин
            </span>
            <h1 className="mt-4 text-7 font-extrabold leading-[1.05] text-[#1f2a44]">
              UPDATE <span className="text-teal-600">боловсролын</span> нэгдсэн платформ
            </h1>
            <p className="mt-3 text-3 leading-relaxed text-[#50607f]">
              Сургуулийн өдөр тутмын үйл ажиллагааг автоматжуулж, багш, сурагч, эцэг
              эхийг нэг цонхоор холбосон нэгдсэн систем.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-2 text-4 font-semibold text-white shadow-md transition hover:bg-teal-700"
              >
                Платформтой танилцах
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-2 text-4 font-semibold text-[#2f3c59] shadow-sm"
              >
                Дэмо үзэх
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <p className="text-6 font-extrabold leading-none text-teal-600">500+</p>
                <p className="mt-1 text-3 text-[#5b6883]">Сургууль</p>
              </div>
              <div>
                <p className="text-6 font-extrabold leading-none text-teal-600">50K+</p>
                <p className="mt-1 text-3 text-[#5b6883]">Сурагч</p>
              </div>
              <div>
                <p className="text-6 font-extrabold leading-none text-teal-600">99.9%</p>
                <p className="mt-1 text-3 text-[#5b6883]">Uptime</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#d9dee8]"
                >
                  <div
                    className={`mb-4 flex h-20 w-20 items-center justify-center rounded-[26px] text-white shadow-md ${item.iconClass}`}
                  >
                    <Icon className="h-10 w-10" />
                  </div>
                  <p className="text-7 font-extrabold text-[#1f2a44]">{item.title}</p>
                  <p className="mt-3 text-4 leading-relaxed text-[#4f5c75]">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>

        <section className="rounded-3xl border border-[#d9dee8] bg-[#eef3fa] p-6 md:p-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-8 font-extrabold text-[#1f2a44]">
              Яагаад UPDATE сонгох вэ?
            </h2>
            <p className="mt-2 text-4 text-[#536079]">
              Боловсролын өнөөгийн шаардлагад нийцсэн, бүрэн цогц шийдэл
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#d9dee8]">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#e7effa] text-8 font-extrabold text-[#4f9dff]">
                  1
                </div>
                <div>
                  <p className="text-7 font-extrabold text-[#1f2a44]">
                    Олон төрлийн асуулт
                  </p>
                  <p className="mt-2 text-4 leading-relaxed text-[#4f5c75]">
                    Томьёо, зураг, видео болон холимог контент бүхий асуултуудыг
                    дэмждэг уян хатан асуултын систем
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#d9dee8]">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#fff5de] text-8 font-extrabold text-[#f59e0b]">
                  2
                </div>
                <div>
                  <p className="text-7 font-extrabold text-[#1f2a44]">
                    Ухаалаг дүн шинжилгээ
                  </p>
                  <p className="mt-2 text-4 leading-relaxed text-[#4f5c75]">
                    AI технологи ашигласан автомат шалгалт, багшийн хяналт болон
                    дүн шинжилгээний систем
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#d9dee8]">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#e9f8ee] text-8 font-extrabold text-[#22c55e]">
                  3
                </div>
                <div>
                  <p className="text-7 font-extrabold text-[#1f2a44]">
                    Найдвартай үйлчилгээ
                  </p>
                  <p className="mt-2 text-4 leading-relaxed text-[#4f5c75]">
                    Хэдэн мянган хэрэглэгчийг нэгэн зэрэг дэмждэг, тогтвортой,
                    аюулгүй платформ
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <footer className="rounded-2xl border border-[#d9dee8] bg-white px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-5 font-extrabold text-[#1f2a44]">UPDATE</p>
              <p className="text-3 text-[#6b7891]">
                Боловсролын платформ | info@update.mn | +976 7000-0000
              </p>
            </div>
            <p className="text-3 text-[#6b7891]">
              © 2026 UPDATE. Бүх эрх хуулиар хамгаалагдсан.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
