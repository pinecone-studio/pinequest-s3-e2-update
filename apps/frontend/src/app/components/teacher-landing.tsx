import { ArrowRight, Shield, Sparkles, Users, Zap } from "lucide-react";
import { TeacherLoginCard } from "./teacher-login-card";
const SECOND_IMG =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80";

type Props = {
  loginError?: string;
};

export function TeacherLanding({ loginError }: Props) {
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
    <section className="px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-[#d9dee8] bg-teal-50 px-3 py-2 text-[#5e6a85]">
              <span className="mr-2 text-[#22c55e]">●</span> Монголын
              боловсролын шинэ түвшин
            </span>
            <h1 className="mt-6 text-[32px] font-extrabold leading-[1.05] text-[#1f2a44]">
              UPDATE
              <br />
              <span className="text-teal-600">боловсролын</span>
              <br />
              нэгдсэн платформ
            </h1>
            <p className="mt-6 max-w-xl text-3 leading-relaxed text-[#50607f]">
              Сургуулийн өдөр тутмын бүх үйл ажиллагааг автоматжуулж, хялбар
              хэрэглээ бүхий технологийн дэвшилтэт шийдлээр дамжуулан багш, эцэг
              эх, сурагчдыг холбох цогц систем.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-2 text-5 font-semibold text-white shadow-md transition hover:bg-teal-700"
              >
                Платформтой танилцах
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-2 text-5 font-semibold text-[#2f3c59] shadow-sm"
              >
                Дэмо үзэх
              </button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-6">
              <div>
                <p className="text-[26px] font-extrabold leading-none text-teal-600">
                  500+
                </p>
                <p className="mt-2 text-3 text-[#5b6883]">Сургууль</p>
              </div>
              <div>
                <p className="text-[26px] font-extrabold leading-none text-teal-600">
                  50K+
                </p>
                <p className="mt-2 text-3 text-[#5b6883]">Сурагч</p>
              </div>
              <div>
                <p className="text-[26px] font-extrabold leading-none text-teal-600">
                  99.9%
                </p>
                <p className="mt-2 text-3 text-[#5b6883]">Uptime</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border-4 border-white bg-white p-2 shadow-lg">
            <img
              alt="Багийн хамтын ажиллагаа"
              className="h-[420px] w-full rounded-2xl object-cover"
              src={SECOND_IMG}
            />
            </div>
            <TeacherLoginCard error={loginError} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#d9dee8]"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white ${item.iconClass}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-5 font-extrabold text-[#1f2a44]">
                  {item.title}
                </p>
                <p className="mt-2 text-3 leading-relaxed text-[#5b6883]">
                  {item.desc}
                </p>
              </article>
            );
          })}
        </div>

        <div className="py-12 text-center">
          <h2 className="text-[30px] font-extrabold leading-tight text-[#1f2a44]">
            Яагаад UPDATE сонгох вэ?
          </h2>
          <p className=" text-5 text-[#5b6883]">
            Боловсролын өнөөгийн шаардлагад нийцсэн, бүрэн цогц шийдэл
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 xl:grid-cols-2">
          <div className="space-y-3">
            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#d9dee8]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-[32px] font-extrabold text-teal-600">
                  1
                </div>
                <div>
                  <p className="text-5 font-extrabold text-[#1f2a44]">
                    Олон төрлийн асуулт
                  </p>
                  <p className="mt-2 text-3 leading-relaxed text-[#5b6883]">
                    Томьёо, зураг, видео болон холимог контент бүхий асуултуудыг
                    дэмждэг уян хатан асуултын систем.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#d9dee8]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff5de] text-[32px] font-extrabold text-[#f59e0b]">
                  2
                </div>
                <div>
                  <p className="text-5 font-extrabold text-[#1f2a44]">
                    Ухаалаг дүн шинжилгээ
                  </p>
                  <p className="mt-2 text-3 leading-relaxed text-[#5b6883]">
                    AI технологи ашигласан автомат шалгалт, багшийн хяналт болон
                    дүн шинжилгээний систем.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#d9dee8]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f8ee] text-[32px] font-extrabold text-[#22c55e]">
                  3
                </div>
                <div>
                  <p className="text-5 font-extrabold text-[#1f2a44]">
                    Найдвартай үйлчилгээ
                  </p>
                  <p className="mt-2 text-3 leading-relaxed text-[#5b6883]">
                    Хэдэн мянган хэрэглэгчийг нэгэн зэрэг дэмждэг, тогтвортой,
                    аюулгүй платформ.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="rounded-3xl border-4 border-white bg-white p-2 shadow-lg">
            <img
              alt="Багийн хамтын ажиллагаа"
              className="h-[420px] w-full rounded-2xl object-cover"
              src={SECOND_IMG}
            />
          </div>
        </div>

        <footer className="mt-4 rounded-3xl px-8 py-10 text-white border">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <p className="text-5 font-extrabold text-gray-500">UPDATE</p>
              <p className="mt-3 text-3 text-[#787d87]">
                Боловсролын нэгдсэн платформ. Сургууль, багш, сурагч, эцэг эхийг
                нэг орчинд холбосон цогц шийдэл.
              </p>
            </div>
            <div>
              <p className="text-5 font-bold text-gray-500">Холбоо барих</p>
              <ul className="mt-3 space-y-2 text-3 text-[#787d87]">
                <li>И-мэйл: info@update.mn</li>
                <li>Утас: +976 7000-0000</li>
                <li>Хаяг: Улаанбаатар, Монгол Улс</li>
              </ul>
            </div>
            <div>
              <p className="text-5 font-bold text-gray-500">Холбоос</p>
              <ul className="mt-3 space-y-2 text-3 text-[#787d87]">
                <li>Үйлчилгээний нөхцөл</li>
                <li>Нууцлалын бодлого</li>
                <li>Тусламж ба дэмжлэг</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/15 pt-4 text-3 text-[#787d87]">
            © 2026 UPDATE. Бүх эрх хуулиар хамгаалагдсан.
          </div>
        </footer>
      </div>
    </section>
  );
}
