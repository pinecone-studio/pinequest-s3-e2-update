/** @format */

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
		<main className="min-h-screen overflow-x-clip bg-[#F5F5F5] text-[#1f242b]">
			<div className="mx-auto min-h-screen w-full min-w-0 max-w-[94.5rem] px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-8">
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

        <section className="mt-8 grid min-h-0 items-start gap-6 sm:mt-12 sm:gap-8 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-10">
          <div className="max-w-xl min-w-0 lg:max-w-[47.5rem]">
            <header className="inline-flex w-full items-center justify-center gap-2 sm:justify-start">
              <Image
                src="/Bee.png"
                alt="Bee logo"
                width={50}
                height={50}
                priority
                className="hidden h-10 w-10 object-contain lg:block"
              />
              <p className="text-[22px] font-black tracking-tight text-[#11161d]">
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
							<p className="max-w-[20rem] text-balance text-sm font-medium leading-snug text-[#122459] sm:max-w-none sm:text-base">
								10,000+ сурагч, багш ашиглаж байна
							</p>
						</div>

						<h1 className="mt-6 text-balance text-[clamp(1.625rem,4.5vw,2.625rem)] font-semibold leading-[1.35] tracking-tight text-[#122459] sm:mt-8 lg:mt-10">
							UPDATE Шалгалтын
							<br />
							Нэгдсэн Платформ
						</h1>
						<p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-[#122459] sm:mt-5 sm:text-lg lg:text-xl">
							Шалгалт бэлтгэх, авах, үнэлэх бүх процессыг илүү ойлгомжтой,
							хурдан, найдвартай болгоно.
						</p>

						<article className="mt-10 w-full max-w-lg rounded-[14px] border border-[#D7ECFF] bg-[#D7ECFF] p-4 transition hover:border-[#D7ECFF] sm:mt-12 sm:p-6 lg:mt-14 lg:max-w-[31.25rem] lg:min-h-[15rem]">
							<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
								<Image
									src="/gana.jpg"
									alt="Teacher testimonial"
									width={90}
									height={90}
									className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20 md:h-[5.625rem] md:w-[5.625rem]"
								/>
								<div className="min-w-0 text-center sm:text-left">
									<p className="text-lg font-semibold leading-tight text-[#481C00] sm:text-xl md:text-2xl">
										Багш: С.Гантүшиг
									</p>
									<p className="mt-1 text-base font-medium text-[#122459] sm:text-lg">
										16-р сургууль
									</p>
									<div className="mx-auto mt-3 h-px max-w-xs bg-[#c8c4a8] sm:mx-0 sm:max-w-[19.5rem]" />
								</div>
							</div>
							<p className="mt-4 text-balance text-base leading-snug font-medium text-[#122459] sm:text-lg">
								Шалгалт авах процесс ойлгомжтой болсон.
								<br />
								Цаг хэмнэж, сурагчдаа үр дүнтэй хянах боломж бүрдсэн.
								<br />
							</p>
						</article>
					</div>

					<div className="mt-6 flex w-full min-w-0 flex-col lg:mt-2 lg:min-h-full lg:justify-between lg:pl-4 xl:pl-10">
						<div className="relative mx-auto mt-2 hidden aspect-[780/420] w-full max-w-[35rem] overflow-visible lg:mx-0 lg:mt-2 lg:block">
							<Image
								src="/path.png"
								alt=""
								width={780}
								height={420}
								priority
								className="absolute left-0 top-[7rem] h-auto w-[38.75rem] max-w-[112%] origin-top-left object-contain object-left lg:scale-[0.88] xl:scale-100"
							/>
							<Image
								src="/ThisWay.png"
								alt=""
								width={460}
								height={260}
								priority
								className="absolute left-[26.25rem] top-[11.75rem] h-auto w-[14.25rem] max-w-[40%] object-contain lg:scale-[0.88] xl:scale-100"
							/>
							<Image
								src="/Herobee.png"
								alt=""
								width={120}
								height={120}
								priority
								className="absolute left-[37.25rem] top-[6.25rem] h-[5.75rem] w-[5.75rem] max-w-[18%] object-contain lg:scale-[0.88] xl:scale-100"
							/>
						</div>

						<div className="mt-4 flex w-full max-w-full flex-col items-center gap-4 sm:mt-6 sm:flex-row sm:items-end sm:justify-center sm:gap-2 md:gap-3 lg:mt-2 lg:justify-start lg:gap-1">
							<div className="relative hidden h-28 shrink-0 items-start justify-center pl-[4.75rem] pt-1 sm:h-30 sm:pl-[5.9rem] sm:pt-0.5 lg:flex">
								<Image
									src="/bugsteibee.png"
									alt="Bee — begin here"
									width={120}
									height={120}
									priority
									className="absolute left-4 top-0 h-28 w-28 object-contain sm:left-6 sm:h-30 sm:w-30"
								/>
								<p className="relative z-10 mt-5 text-center text-[15px] font-black leading-[0.95] tracking-tight text-[#3a2614] sm:mt-6 sm:text-[16px] sm:whitespace-nowrap">
									BEE-GIN
									<br />
									HERE
								</p>
							</div>

							<div className="mb-2 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-center sm:gap-4 lg:w-auto lg:max-w-none lg:flex-nowrap lg:justify-start">
								<HomeSchoolEntry />
								<Link
									href="/teacher"
									className="inline-flex h-14 w-full min-w-0 shrink-0 items-center justify-center rounded-xl border border-[#7DC8FF] bg-white px-5 text-xl font-medium text-[#122459] transition hover:bg-[#f7fbff] sm:h-17.5 sm:w-auto sm:min-w-40 sm:px-6 sm:text-2xl lg:text-[30px]"
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
