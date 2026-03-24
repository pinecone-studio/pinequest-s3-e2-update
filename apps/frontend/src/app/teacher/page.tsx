import { ArrowRight, Shield, Sparkles, Users, Zap } from "lucide-react";

export default function TeacherPage() {
  const features = [
    {
      title: "Олон төрлийн асуулт",
      desc: "Томьёо, зураг, видео болон холимог контент бүхий асуултууд",
      icon: Sparkles,
      iconClass: "bg-[#0ea5e9]",
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
        <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-[#d9dee8] bg-[#f9fbff] px-4 py-2 text-3 text-[#5e6a85]">
              <span className="mr-2 text-[#22c55e]">●</span> Монголын
              боловсролын шинэ түвшин
            </span>
            <h1 className="mt-6 text-[52px] font-extrabold leading-[1.05] text-[#1f2a44]">
              UPDATE
              <br />
              <span className="text-[#4f95ea]">боловсролын</span>
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
                className="inline-flex items-center gap-2 rounded-2xl bg-[#4f95ea] px-7 py-4 text-5 font-semibold text-white shadow-md transition hover:bg-[#3f89e4]"
              >
                Платформтой танилцах
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="rounded-2xl border border-[#d9dee8] bg-white px-7 py-4 text-5 font-semibold text-[#2f3c59] shadow-sm"
              >
                Дэмо үзэх
              </button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-6">
              <div>
                <p className="text-[46px] font-extrabold leading-none text-[#4f95ea]">
                  500+
                </p>
                <p className="mt-2 text-3 text-[#5b6883]">Сургууль</p>
              </div>
              <div>
                <p className="text-[46px] font-extrabold leading-none text-[#4f95ea]">
                  50K+
                </p>
                <p className="mt-2 text-3 text-[#5b6883]">Сурагч</p>
              </div>
              <div>
                <p className="text-[46px] font-extrabold leading-none text-[#4f95ea]">
                  99.9%
                </p>
                <p className="mt-2 text-3 text-[#5b6883]">Uptime</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-4 border-white bg-white p-2 shadow-lg">
            <img
              alt="UPDATE платформ"
              className="h-[360px] w-full rounded-2xl object-cover"
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=80"
            />
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
          <h2 className="text-[36px] font-extrabold leading-tight text-[#1f2a44]">
            Яагаад UPDATE сонгох вэ?
          </h2>
          <p className="mt-4 text-5 text-[#5b6883]">
            Боловсролын өнөөгийн шаардлагад нийцсэн, бүрэн цогц шийдэл
          </p>
        </div>
      </div>
    </section>
  );
}
