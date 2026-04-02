/** @format */

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SchoolLoaderExperience } from "@/app/school/_components/school-loader-experience";
import { SCHOOL_LOADER_HOLD_EVENT } from "@/app/school/_lib/school-loader-min-ms";
import { ProfileMenu } from "./profile-menu";
import type { User } from "@/app/lib/types";

const links = [
	{ href: "/school", label: "Нүүр" },
	{ href: "/school/teachers", label: "Хүний нөөц" },
	{ href: "/school/classes?grade=10", label: "Ангиуд" },
	{ href: "/school/exams", label: "Шалгалт" },
] as const;

function isActive(pathname: string, href: string) {
	const baseHref = href.split("?")[0] ?? href;
	if (baseHref === "/school") return pathname === "/school";
	return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
}

export function SchoolShell({
	user,
	children,
}: {
	user: User;
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [showLoaderHold, setShowLoaderHold] = useState(false);
	/** DOM timers are numeric IDs; avoids Node `Timeout` vs `number` mismatch in builds. */
	const loaderHoldTimerRef = useRef<number | null>(null);
	const mobileShellRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const id = window.setTimeout(() => setMobileNavOpen(false), 0);
		return () => window.clearTimeout(id);
	}, [pathname]);

	useEffect(() => {
		const onDown = (event: MouseEvent) => {
			if (!mobileShellRef.current) return;
			if (!mobileShellRef.current.contains(event.target as Node)) {
				setMobileNavOpen(false);
			}
		};
		document.addEventListener("mousedown", onDown);
		return () => document.removeEventListener("mousedown", onDown);
	}, []);

	useEffect(() => {
		const onHold = (event: Event) => {
			const remaining =
				(event as CustomEvent<{ remaining: number }>).detail?.remaining ?? 0;
			if (remaining <= 0) return;
			if (loaderHoldTimerRef.current !== null) {
				window.clearTimeout(loaderHoldTimerRef.current);
			}
			setShowLoaderHold(true);
			loaderHoldTimerRef.current = window.setTimeout(() => {
				setShowLoaderHold(false);
				loaderHoldTimerRef.current = null;
			}, remaining);
		};
		window.addEventListener(SCHOOL_LOADER_HOLD_EVENT, onHold);
		return () => {
			window.removeEventListener(SCHOOL_LOADER_HOLD_EVENT, onHold);
			if (loaderHoldTimerRef.current !== null) {
				window.clearTimeout(loaderHoldTimerRef.current);
			}
		};
	}, []);

	return (
		<div className="flex min-h-screen flex-col bg-[#f7fafc]">
			<header className="sticky top-0 z-40 border-b border-[#e3e7ee] bg-[#fdfdff] pt-[env(safe-area-inset-top,0px)]">
				<div className="mx-auto w-full max-w-[94.5rem] px-3 sm:px-4 lg:px-10">
					<div
						className="relative flex w-full items-center py-2 sm:py-2.5 lg:hidden"
						ref={mobileShellRef}
					>
						<div className="flex w-full min-w-0 items-center justify-between gap-2 rounded-2xl border border-[#cfe8ff] bg-gradient-to-br from-[#eef7ff] via-white to-[#f5f9ff] px-2.5 py-2 shadow-[0_4px_24px_rgba(29,111,235,0.08)] sm:gap-3 sm:px-3 sm:py-2.5">
							<Link
								href="/school"
								className="flex min-w-0 flex-1 items-center gap-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#7DC8FF] focus-visible:ring-offset-2 sm:gap-3"
								aria-label="Сургуулийн самбар — нүүр"
							>
								<span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm sm:h-10 sm:w-10">
									<Image
										alt="UPDATE logo"
										className="object-contain rotate-[12deg]"
										fill
										priority
										src="/Bee.png"
									/>
								</span>
								<div className="min-w-0 text-left">
									<p className="hidden min-[360px]:block text-[11px] font-semibold uppercase tracking-wider text-[#5a7aa3]">
										Сургуулийн хэсэг
									</p>
									<p className="truncate text-sm font-extrabold leading-tight text-[#1f2a44] min-[360px]:text-base">
										UPDATE
									</p>
								</div>
							</Link>
							<div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
								<button
									type="button"
									aria-expanded={mobileNavOpen}
									aria-label={mobileNavOpen ? "Цэс хаах" : "Үндсэн цэс нээх"}
									className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#b8d9f5] bg-white/90 text-[#1f2a44] shadow-sm transition active:scale-[0.98] hover:bg-[#EDF6FF] sm:h-11 sm:w-11"
									onClick={() => setMobileNavOpen((v) => !v)}
								>
									{mobileNavOpen ? (
										<X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
									) : (
										<Menu className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
									)}
								</button>
								<ProfileMenu user={user} variant="appBar" />
							</div>
						</div>

						{mobileNavOpen ? (
							<nav
								aria-label="School main navigation"
								className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[min(70vh,24rem)] w-full min-w-0 overflow-y-auto overscroll-contain rounded-2xl border border-[#d9dee8] bg-white p-2 shadow-xl"
							>
								<ul className="flex flex-col gap-1">
									{links.map((l) => {
										const active = isActive(pathname, l.href);
										return (
											<li key={l.href}>
												<Link
													href={l.href}
													onClick={() => setMobileNavOpen(false)}
													className={`block rounded-xl px-4 py-3.5 text-sm font-semibold transition sm:text-base ${
														active
															? "bg-[#EDF6FF] text-[#1f2a44] ring-1 ring-[#7DC8FF]/40"
															: "text-[#1f2a44] hover:bg-[#f4f8fc]"
													}`}
												>
													{l.label}
												</Link>
											</li>
										);
									})}
								</ul>
							</nav>
						) : null}
					</div>

					<div className="hidden h-[70px] min-h-[70px] items-center gap-3 lg:flex xl:gap-6">
						<div className="min-w-0 shrink-0">
							<Link
								href="/school"
								className="flex max-w-[11rem] items-center gap-1.5 rounded-[20px] px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#7DC8FF] focus-visible:ring-offset-2 sm:gap-[6px] sm:px-[14px] sm:py-[6px] xl:max-w-none"
								aria-label="Сургуулийн нүүр рүү очих"
							>
								<Image
									src="/Bee.png"
									alt="UPDATE logo"
									width={44}
									height={44}
									className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
									priority
								/>
								<h1 className="truncate text-lg font-semibold leading-none tracking-normal text-[#171717] xl:text-[22px]">
									UPDATE
								</h1>
							</Link>
						</div>

						<nav
							aria-label="School main navigation"
							className="flex min-w-0 flex-1 justify-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						>
							<ul className="inline-flex items-center gap-1 whitespace-nowrap px-1 lg:gap-2 xl:gap-6 2xl:gap-8">
								{links.map((l) => {
									const active = isActive(pathname, l.href);
									return (
										<li className="shrink-0" key={l.href}>
											<Link
												href={l.href}
												className={`inline-flex min-h-[35px] items-center rounded-[6px] px-2 py-1.5 text-sm font-semibold text-[#262626] transition-colors lg:px-2.5 lg:py-[6px] lg:text-[15px] xl:px-3 xl:text-[17px] ${
													active
														? "border border-[#d2cccc]"
														: "border border-transparent hover:border-[#d2cccc]"
												}`}
											>
												{l.label}
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>

						<div className="shrink-0 justify-self-end">
							<ProfileMenu user={user} />
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto flex w-full max-w-378 flex-1 flex-col px-4 py-6 sm:px-6">
				{children}
			</main>

			{showLoaderHold ? <SchoolLoaderExperience overlay /> : null}
		</div>
	);
}

export const AdminShell = SchoolShell;
