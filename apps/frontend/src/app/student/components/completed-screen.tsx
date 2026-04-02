/** @format */

"use client";

import Image from "next/image";

export function CompletedScreen() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-3 py-8 text-[#1f2a44] sm:px-4 sm:py-10">
			<div className="exam-complete-card flex min-h-0 w-full max-w-lg flex-col items-center justify-center rounded-[20px] border border-[#cfe3f5] bg-[#edf6ff] px-4 py-10 text-center sm:rounded-[28px] sm:px-8 sm:py-12 md:min-h-[24rem] md:py-16">
				<div className="relative mx-auto mt-1 flex min-h-[11.5rem] w-full max-w-sm items-center justify-center sm:min-h-[13rem]">
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						<div className="exam-complete-bee-orbit relative h-0 w-0 will-change-transform">
							<div
								className="exam-complete-bee-carrier pointer-events-none absolute left-0 top-0"
								style={{
									transform:
										"translateX(var(--exam-bee-orbit-r, 0px)) translate(-50%, -50%)",
								}}
							>
								<div className="exam-complete-bee-upright">
									<Image
										src="/bugsteibee.png"
										alt="Success"
										width={230}
										height={180}
										priority
										className="block h-24 w-auto max-h-none max-w-[72vw] object-contain sm:h-[7.25rem] md:h-[142px]"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<h1 className="exam-complete-title mt-4 max-w-lg text-pretty text-xl font-medium leading-snug text-[#111111] sm:mt-6 sm:text-2xl md:text-[32px] md:leading-[1.25]">
					Шалгалтаа амжилттай дууссанд баяр хүргэе.
				</h1>
			</div>
		</main>
	);
}
