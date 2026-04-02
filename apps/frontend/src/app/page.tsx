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

				<section className="mt-10 grid min-h-0 w-full min-w-0 grid-cols-1 items-start gap-6 sm:mt-14 sm:gap-8 lg:mt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-10">
					<div className="min-w-0 max-w-xl lg:max-w-190">
						<header className="flex items-center justify-center gap-2 sm:justify-start">
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

						<article className="mt-10 w-full max-w-lg rounded-[14px] border border-[#D7ECFF] bg-[#D7ECFF] p-4 transition hover:border-[#D7ECFF] sm:mt-12 sm:p-6 lg:mt-14 lg:max-w-125 lg:min-h-60">
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
									<div className="mx-auto mt-3 h-px max-w-xs bg-[#c8c4a8] sm:mx-0 sm:w-78" />
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

					<div className="mt-2 w-full min-w-0 lg:-ml-45 lg:flex lg:min-h-full lg:flex-col lg:justify-between">
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

						<div className="mt-6 flex w-full min-w-0 flex-col items-center gap-5 sm:mt-8 lg:flex-row lg:items-end lg:justify-center lg:gap-4 xl:-mt-2 xl:justify-start xl:gap-2 xl:pl-12">
							<div className="relative hidden h-28 w-fit max-w-full shrink-0 pl-[6.75rem] pt-1 xl:mx-0 xl:block xl:h-30 xl:pl-[5.9rem] xl:pt-[0.2rem]">
								<Image
									src="/bugsteibee.png"
									alt="Bee begin here"
									width={120}
									height={120}
									priority
									className="absolute bottom-0 left-0 h-24 w-24 object-contain xl:h-30 xl:w-30"
								/>
								<p className="relative z-10 text-sm font-black leading-[0.95] tracking-tight text-[#3a2614] xl:text-base">
									BEE-GIN
									<br />
									HERE
								</p>
							</div>

							<div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-stretch sm:justify-center lg:items-end">
								<HomeSchoolEntry />
								<Link
									href="/teacher"
									className="inline-flex h-14 w-full min-w-0 items-center justify-center rounded-xl border border-[#7DC8FF] bg-white px-5 text-2xl font-medium text-[#122459] transition hover:bg-[#f7fbff] sm:h-17.5 sm:w-auto sm:min-w-40 sm:px-6 sm:text-[30px]"
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
