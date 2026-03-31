/** @format */

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./profile-menu";
import type { User } from "@/app/lib/types";

const links = [
  { href: "/school", label: "Нүүр" },
  { href: "/school/teachers", label: "Хүний нөөц" },
  { href: "/school/classes", label: "Ангиуд" },
  { href: "/school/exams", label: "Шалгалт" },
  { href: "/school/results", label: "Үр дүн" },
] as const;

function isActive(pathname: string, href: string) {
	if (href === "/school") return pathname === "/school";
	return pathname === href || pathname.startsWith(`${href}/`);
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
	const mobileShellRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setMobileNavOpen(false);
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

	return (
		<div className="flex min-h-screen flex-col bg-[#f7fafc]">
			<header className="sticky top-0 z-40 border-b border-[#e3e7ee] bg-[#fdfdff]">
				<div className="mx-auto w-full max-w-[94.5rem] px-4 py-3 lg:px-10">
					{/* Mobile — багшийн shell-тай ижил: цэнхэг gradient card + цэс + профайл + доош нээлттэй жагсаалт */}
					<div className="relative lg:hidden" ref={mobileShellRef}>
						<div className="flex items-center justify-between gap-3 rounded-2xl border border-[#cfe8ff] bg-gradient-to-br from-[#eef7ff] via-white to-[#f5f9ff] px-3 py-2.5 shadow-[0_4px_24px_rgba(29,111,235,0.08)]">
							<Link
								href="/school"
								className="flex min-w-0 flex-1 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#7DC8FF] focus-visible:ring-offset-2"
								aria-label="Сургуулийн самбар — нүүр"
							>
								<span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
									<Image
										alt="UPDATE logo"
										className="object-contain rotate-[12deg]"
										fill
										priority
										src="/bee.png"
									/>
								</span>
								<div className="min-w-0 text-left">
									<p className="text-[11px] font-semibold uppercase tracking-wider text-[#5a7aa3]">
										Сургуулийн хэсэг
									</p>
									<p className="truncate text-4 font-extrabold leading-tight text-[#1f2a44]">
										UPDATE
									</p>
								</div>
							</Link>
							<div className="flex shrink-0 items-center gap-2">
								<button
									type="button"
									aria-expanded={mobileNavOpen}
									aria-label={mobileNavOpen ? "Цэс хаах" : "Үндсэн цэс нээх"}
									className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#b8d9f5] bg-white/90 text-[#1f2a44] shadow-sm transition active:scale-[0.98] hover:bg-[#EDF6FF]"
									onClick={() => setMobileNavOpen((v) => !v)}
								>
									{mobileNavOpen ? (
										<X className="h-6 w-6" strokeWidth={2} />
									) : (
										<Menu className="h-6 w-6" strokeWidth={2} />
									)}
								</button>
								<ProfileMenu user={user} variant="appBar" />
							</div>
						</div>

						{mobileNavOpen ? (
							<nav
								aria-label="School main navigation"
								className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[min(70vh,24rem)] overflow-y-auto rounded-2xl border border-[#d9dee8] bg-white p-2 shadow-xl"
							>
								<ul className="flex flex-col gap-1">
									{links.map((l) => {
										const active = isActive(pathname, l.href);
										return (
											<li key={l.href}>
												<Link
													href={l.href}
													onClick={() => setMobileNavOpen(false)}
													className={`block rounded-xl px-4 py-3.5 text-3 font-semibold transition ${
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

  return (
    <div className="flex h-screen flex-col bg-[#f7fafc]">
      <header className="sticky top-0 z-40 border-b border-[#e3e7ee] bg-[#fdfdff]">
        <div className="mx-auto flex h-[70px] w-[1512px] max-w-full items-center justify-between px-[52px]">
          <div className="min-w-0">
            <div className="flex h-14 w-43 items-center gap-[6px] rounded-[20px] pt-[4px] pr-[16px] pb-[8px] pl-[14px]">
              <Image
                src="/bee.png"
                alt="UPDATE logo"
                width={44}
                height={44}
                className="h-10 w-10 object-contain"
                priority
              />
              <h1 className="mt-2 h-6 w-23 text-[22px] font-semibold leading-[100%] tracking-[0px] text-[#171717]">
                UPDATE
              </h1>
            </div>
          </div>

          <nav
            aria-label="School main navigation"
            className="justify-self-center"
          >
            <ul className="flex flex-row items-center gap-5">
              {links.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`inline-flex h-[35px] items-center rounded-[6px]  px-[12px] py-[6px] text-[17px] font-semibold transition-colors ${
                        active
                          ? "border-[#d2cccc] border"
                          : "border-[#d2cccc] hover:border"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

						<div className="justify-self-end">
							<ProfileMenu user={user} />
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto flex w-full max-w-[1512px] flex-1 flex-col px-4 py-6 sm:px-6">
				{children}
			</main>
		</div>
	);
}

export const AdminShell = SchoolShell;
