"use client";

import { SignIn } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { authSignUpHref } from "@/app/lib/auth-redirect";

export function HomeSchoolEntry() {
	const [isOpen, setIsOpen] = useState(false);
	const schoolSignUpHref = authSignUpHref("/school");

	useEffect(() => {
		if (!isOpen) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="inline-flex h-17.5 min-w-40 items-center justify-center rounded-xl border border-[#7DC8FF] bg-white px-6 text-[30px] font-medium text-[#122459] transition hover:bg-[#f7fbff]"
			>
				Сургууль
			</button>

			{isOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f4f4ee]/35 px-4 py-6 backdrop-blur-md sm:px-6">
					<button
						type="button"
						aria-label="Close school login modal"
						className="absolute inset-0 cursor-default"
						onClick={() => setIsOpen(false)}
					/>

					<div className="relative z-10 w-full max-w-[33rem] rounded-[2rem] bg-white p-4 shadow-[0_24px_80px_rgba(39,60,106,0.12)] sm:p-5">
						<div className="mb-2 flex items-center justify-between">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#1f2937] transition hover:bg-[#f2f6fb]"
							>
								<ChevronLeft className="h-7 w-7" />
							</button>
							<div
								className="text-[1.65rem] font-bold tracking-tight text-[#172033] sm:text-[1.85rem]"
								aria-hidden="true"
							>
								Нэвтрэх
							</div>
							<div className="h-10 w-10" aria-hidden="true" />
						</div>
						<SignIn
							routing="hash"
							fallbackRedirectUrl="/school"
							signUpUrl={schoolSignUpHref}
							appearance={{
								elements: {
									rootBox: "mx-auto w-full max-w-[27rem]",
									card: "shadow-none border-0 bg-transparent",
									headerTitle: "hidden",
									headerSubtitle: "hidden",
									socialButtonsBlockButton:
										"h-18 rounded-[1.35rem] border border-[#3ab0ef] text-[#33a9eb] font-bold text-[1.45rem] shadow-none",
									formButtonPrimary:
										"h-18 rounded-[1.35rem] bg-[#33a9eb] text-[1.45rem] font-bold hover:brightness-95",
									formFieldInput:
										"h-16 rounded-[1.45rem] border border-[#dfe5f0] px-5 text-[1.05rem] shadow-[0_10px_24px_rgba(31,48,84,0.08)]",
									footerActionLink:
										"text-[1.55rem] font-bold text-[#172033] hover:text-[#0f172a]",
									footerActionText: "hidden",
									identityPreviewText: "text-[#5f687a]",
									formFieldLabel: "hidden",
									formFieldRow: "gap-0",
									dividerLine: "bg-[#e5edf7]",
									dividerText: "text-[#94a3b8]",
									footer: "pt-2",
								},
							}}
						/>
					</div>
				</div>
			) : null}
		</>
	);
}
