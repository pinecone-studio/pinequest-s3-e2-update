import Image from "next/image";
import Link from "next/link";
import { HomeSchoolEntry } from "@/app/components/home-school-entry";

type SearchParams = { error?: string | string[] };

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = searchParams ? await searchParams : {};
  const raw = sp.error;
  const loginError =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;

  return (
    <main className="min-h-screen bg-[#F5F5F5] text-[#1f242b]">
      <div className="mx-auto min-h-screen w-full max-w-[94.5rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-8">
        {loginError === "login" ? (
          <p className="mb-4 inline-flex rounded-xl border border-[#f3c2c2] bg-[#fff1f1] px-4 py-2 text-2 font-medium text-[#8a1f1f]">
            Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.
          </p>
        ) : null}
        {loginError === "auth" ? (
          <p className="mb-4 inline-flex rounded-xl border border-[#f2d9ab] bg-[#fff7e8] px-4 py-2 text-2 font-medium text-[#7b4f00]">
            Үргэлжлүүлэхийн тулд эхлээд нэвтэрнэ үү.
          </p>
        ) : null}

        <section className="grid min-h-0 items-start gap-3 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-10 mt-24">
          <div className="max-w-xl lg:max-w-190">
            <header className="inline-flex items-center justify-center gap-2 sm:justify-start">
              <Image
                src="/Bee.png"
                alt="Bee logo"
                width={50}
                height={50}
                priority
                className="h-10 w-10 object-contain"
              />
              <p className=" text-[22px] font-black tracking-tight text-[#11161d]">
                UPDATE
              </p>
            </header>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-12 sm:gap-4">
              <div className="flex items-center -space-x-3">
                {["/angarag.jpg", "/sor.jpg", "/purwe.jpg", "/ogo.jpg"].map(
                  (src, idx) => (
                    <span
                      key={src}
                      className="h-12 w-12 rounded-full border-2 border-[#F5F5F5] bg-cover bg-center shadow-sm"
                      style={{
                        backgroundImage: `url('${src}')`,
                        backgroundPosition: "center",
                        zIndex: 10 - idx,
                      }}
                    />
                  ),
                )}
              </div>
              <p className="text-[16px] font-medium text-[#122459]">
                10,000+ сурагч, багш ашиглаж байна
              </p>
            </div>

            <h1 className="mt-8 text-[47px] font-semibold  leading-[140%] tracking-tight text-[#122459] sm:mt-10 sm:text-4xl lg:text-[42px] let ">
              UPDATE Шалгалтын
              <br />
              Нэгдсэн Платформ
            </h1>
            <p className="mt-4 max-w-xl text-[20px] font-medium leading-relaxed text-[#122459] sm:mt-6">
              Шалгалт бэлтгэх, авах, үнэлэх бүх процессыг илүү ойлгомжтой,
              хурдан, найдвартай болгоно.
            </p>

            <article className="mt-12 w-full max-w-lg rounded-[14px] border border-[#D7ECFF] bg-[#D7ECFF] p-4  transition hover:border-[#D7ECFF]  sm:mt-14 sm:p-6 lg:max-w-125 lg:min-h-60">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
                <Image
                  src="/gana.jpg"
                  alt="Teacher testimonial"
                  width={90}
                  height={90}
                  className="h-19 w-19 rounded-xl object-cover"
                />
                <div>
                  <p className="text-[24px] font-semibold leading-tight text-[#481C00]">
                    Багш: С.Гантүшиг
                  </p>
                  <p className="mt-1 font-medium text-[20px] text-[#122459]">
                    16-р сургууль
                  </p>
                  <div className="mt-3 h-px max-w-xs bg-[#c8c4a8] sm:w-78" />
                </div>
              </div>
              <p className="mt-4 text-[18px] leading-snug text-[#122459] font-medium">
                Шалгалт авах процесс ойлгомжтой болсон.
                <br />
                Цаг хэмнэж, сурагчдаа үр дүнтэй хянах боломж бүрдсэн.
                <br />
              </p>
            </article>
          </div>

          <div className="mt-2 w-full lg:-ml-45 lg:flex lg:min-h-full lg:flex-col lg:justify-between">
            <div className="flex justify-center px-2 lg:hidden">
              <Image
                src="/path.png"
                alt="Path"
                width={780}
                height={420}
                priority
                className="h-auto max-h-52 w-full max-w-lg object-contain sm:max-h-64"
              />
            </div>
            <div className="relative mx-auto hidden h-90 w-140 max-w-full lg:mx-0 lg:mt-2 lg:block">
              <Image
                src="/path.png"
                alt="Path"
                width={780}
                height={420}
                priority
                className="absolute left-0 top-28 h-auto w-155 object-contain object-left"
              />
              <Image
                src="/ThisWay.png"
                alt="This way text"
                width={460}
                height={260}
                priority
                className="absolute left-105 top-47 h-auto w-57 object-contain"
              />
              <Image
                src="/Herobee.png"
                alt="Bee"
                width={120}
                height={120}
                priority
                className="absolute left-149 top-25 h-23 w-23 object-contain"
              />
            </div>

            <div className="mt-2 inline-flex flex-col items-center sm:flex-row sm:items-end sm:gap-2 lg:-mt-2 lg:pl-12">
              <div className="relative h-30 shrink-0 pl-[5.4rem] pt-[0.35rem] sm:h-30 sm:pl-[5.9rem] sm:pt-[0.2rem]">
                <Image
                  src="/bugsteibee.png"
                  alt="Bee begin here"
                  width={120}
                  height={120}
                  priority
                  className="absolute bottom-0 left-0 h-32 w-32 object-contain sm:h-30 sm:w-30"
                />
                <p className="relative z-10 whitespace-nowrap text-[16px] font-black leading-[0.95] tracking-tight text-[#3a2614]">
                  BEE-GIN
                  <br />
                  HERE
                </p>
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                <HomeSchoolEntry />
                <Link
                  href="/teacher"
                  className="inline-flex h-17.5 min-w-40 items-center justify-center rounded-xl border border-[#7DC8FF] bg-white px-6 text-[30px] font-medium text-[#122459] transition hover:bg-[#f7fbff]"
                >
                  Багш
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
