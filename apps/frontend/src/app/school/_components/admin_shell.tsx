/** @format */

import Link from "next/link";
import { ProfileMenu } from "./profile-menu";
import type { User } from "@/app/lib/types";
const links = [
	{ href: "/school", label: "Самбар" },
	{ href: "/school/teachers", label: "Багш нар" },
	{ href: "/school/classes", label: "Ангиуд" },
] as const;

export function AdminShell({
	user,
	children,
}: {
	user: User;
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col bg-white">
			<header className="shrink-0 border-b border-zinc-200 bg-white">
				<div className="mx-auto flex max-w-6xl flex-row flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
					<div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-2 md:gap-x-10">
						<div className="min-w-0 shrink-0">
							<p className="text-xs font-medium uppercase tracking-wide text-blue-600">
								Сургуулийн захиргаа
							</p>
							<h1 className="truncate text-base font-semibold text-zinc-900 sm:text-lg">
								Гүн Галуутай сургууль
							</h1>
						</div>
						<nav className="min-w-0" aria-label="Үндсэн цэс">
							<ul className="flex flex-row flex-wrap items-center gap-1">
								{links.map((l) => (
									<li key={l.href}>
										<Link
											href={l.href}
											className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
										>
											{l.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
					<div className="shrink-0">
						<ProfileMenu user={user} />
					</div>
				</div>
			</header>
			<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col bg-white px-4 py-8 sm:px-6">
				{children}
			</main>
		</div>
	);
}
