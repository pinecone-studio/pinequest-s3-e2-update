/** @format */

"use client";

import Image from "next/image";

export function CompletedScreen() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-3 py-8 text-[#1f2a44] sm:px-4 sm:py-10">
			<div className="exam-complete-card flex min-h-0 w-full max-w-xl flex-col items-center justify-center rounded-[20px] border border-[#cfe3f5] bg-[#edf6ff] px-5 py-11 text-center sm:rounded-[28px] sm:px-9 sm:py-[3.25rem] md:min-h-[25rem] md:py-[4.25rem]">
				<div className="exam-complete-orbit-stage relative mx-auto mt-1 flex min-h-[12.5rem] w-full max-w-md items-center justify-center sm:min-h-[14.5rem] md:min-h-[17rem]">
					<div
						className="exam-complete-orbit-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#9ec5eb]/85"
						aria-hidden
					/>
					<div className="exam-complete-orbit-core">
						<p className="exam-complete-orbit-center-msg" lang="mn">
							<span className="exam-complete-orbit-center-msg-accent">
								Шалгалтаа амжилттай дуусгасанд баяр хүргэе.
							</span>
						</p>
					</div>
					<div className="absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2">
						<div className="exam-complete-bee-orbit relative h-0 w-0">
							<div className="exam-complete-bee-carrier pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
								<Image
									src="/hive-five.png"
									alt="Hive five — шалгалт амжилттай"
									width={240}
									height={240}
									priority
									className="block h-16 w-16 max-h-none max-w-[min(42vw,10rem)] object-contain sm:h-20 sm:w-20 md:h-24 md:w-24"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
