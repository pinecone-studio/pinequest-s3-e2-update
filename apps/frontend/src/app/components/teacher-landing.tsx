import { CheckCircle2, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { authSignInHref } from "@/app/lib/auth-redirect";

type Props = {
  loginError?: string;
};

const milestones = [
  "Асуултын сан болон шалгалтын үндсэн бүтэц бэлэн болсон",
  "Багшийн орчинд шалгалт үүсгэх урсгал идэвхтэй хөгжүүлэлтэд байна",
  "Автомат үнэлгээ, тайлан, дүн шинжилгээ дараагийн шатанд орно",
];

const summaryCards = [
  {
    title: "Зорилго",
    description:
      "Шалгалт бэлтгэх, авах, үнэлэх бүх процессыг нэг орчинд төвлөрүүлэх",
    icon: Target,
    accent: "text-teal-600",
  },

  {
    title: "Үр дүн",
    description:
      "Нэвтэрсэн даруйд шууд ашиглаж болох ойлгомжтой exam module бүрдүүлж байна",
    icon: CheckCircle2,
    accent: "text-emerald-600",
  },
];

function AuthButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-2xl border border-[#d8e2ee] bg-white px-5 py-3 text-2 font-semibold text-[#1f2a44] shadow-sm transition hover:border-teal-300 hover:text-teal-700"
    >
      {label}
    </Link>
  );
}

export function TeacherLanding({ loginError }: Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f5fbf9]">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_58%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-end gap-4">
              <h1 className="text-[28px] font-extrabold leading-[1.08] tracking-tight text-[#202833] sm:text-[26px] lg:text-[32px]">
                UPDATE шалгалтын
                <br />
                нэгдсэн платформ
              </h1>
              <div className="relative h-20 w-20 shrink-0">
                <Image
                  alt="UPDATE logo"
                  className="object-contain"
                  fill
                  priority
                  src="/logo.png"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start px-5 py-4 lg:px-8 lg:py-6">
            <AuthButton label="Сургууль" href={authSignInHref("/school")} />
            <AuthButton label="Багш" href={authSignInHref("/teacher")} />
          </div>
        </div>
        {loginError === "login" ? (
          <p className="mt-6 max-w-xl rounded-2xl bg-red-50 px-4 py-3 text-2 text-red-700">
            Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.
          </p>
        ) : null}

        {loginError === "auth" ? (
          <p className="mt-6 max-w-xl rounded-2xl bg-amber-50 px-4 py-3 text-2 text-amber-900">
            Үргэлжлүүлэхийн тулд эхлээд нэвтэрнэ үү.
          </p>
        ) : null}

        <div className="mt-10 p-0">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
            <div className="grid gap-6">
              {summaryCards.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-[34px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
                  >
                    <Icon className={`h-8 w-8 ${item.accent}`} />
                    <p className="mt-8 text-2 font-semibold uppercase tracking-[0.26em] text-[#7c8aa5]">
                      {item.title}
                    </p>
                    <p className="mt-6 text-4 font-bold leading-9 text-[#183153]">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="rounded-[34px] border border-[#2357aa] bg-[#f5f8ff] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-2 font-semibold uppercase tracking-[0.2em] text-[#2563eb]">
                    Төслийн явц
                  </p>
                  <p className="mt-2 text-4 font-extrabold text-[#183153]">
                    Одоогийн хөгжүүлэлт
                  </p>
                  <p className="mt-6 max-w-3xl text-2 leading-8 text-[#5d7088]">
                    Exam module-ийн үндсэн хэрэглээ, шалгалттай холбоотой гол
                    урсгалуудыг шат дараатайгаар тогтвортой хөгжүүлж байна.
                  </p>
                </div>

                <div className="w-fit rounded-[24px] bg-[#dff4ee] px-5 py-3 text-4 font-bold text-teal-700">
                  Active
                </div>
              </div>

              <div className="mt-10 h-4 overflow-hidden rounded-full bg-[#d7e3f4]">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600" />
              </div>

              <div className="mt-10 grid gap-5">
                {milestones.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-[26px] bg-white px-5 py-5 shadow-sm ring-1 ring-[#e2e8f0]"
                  >
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
                    <p className="text-2 leading-8 text-[#4f627b]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
