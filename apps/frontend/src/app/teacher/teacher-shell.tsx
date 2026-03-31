/** @format */

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Menu, X } from "lucide-react";
import { ProfileMenu } from "@/app/school/_components/profile-menu";
import type { User } from "@/app/lib/types";

const TeacherContext = createContext<User | null>(null);

export function useTeacher() {
  const teacher = useContext(TeacherContext);
  if (!teacher) {
    throw new Error("useTeacher must be used within <TeacherShell />");
  }
  return teacher;
}

type MenuItem = {
  href: string;
  label: string;
  activePrefixes?: string[];
};

const menuItems: MenuItem[] = [
  {
    href: "/teacher",
    label: "Нүүр хуудас",
    activePrefixes: ["/teacher/class", "/teacher/demo-class"],
  },
  {
    href: "/teacher/question-bank",
    label: "Асуултын сан",
  },
  {
    href: "/teacher/exam",
    label: "Шалгалт",
    activePrefixes: ["/teacher/exam", "/teacher/exam-management"],
  },
  {
    href: "/teacher/exam-optimization",
    label: "Хяналт",
  },
];

function isMenuItemActive(pathname: string, href: string) {
  if (href === "/teacher") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function TeacherShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
	const pathname = usePathname();
	const { signOut } = useClerk();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const userMenuMobileRef = useRef<HTMLDivElement | null>(null);
	const userMenuDesktopRef = useRef<HTMLDivElement | null>(null);
	const mobileNavRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleOutside = (event: MouseEvent) => {
			const t = event.target as Node;
			const inside =
				userMenuMobileRef.current?.contains(t) ||
				userMenuDesktopRef.current?.contains(t);
			if (!inside) setIsMenuOpen(false);
		};

		document.addEventListener("mousedown", handleOutside);
		return () => document.removeEventListener("mousedown", handleOutside);
	}, []);

	useEffect(() => {
		const handleOutside = (event: MouseEvent) => {
			if (!mobileNavRef.current) return;
			if (!mobileNavRef.current.contains(event.target as Node)) {
				setMobileNavOpen(false);
			}
		};
		document.addEventListener("mousedown", handleOutside);
		return () => document.removeEventListener("mousedown", handleOutside);
	}, []);

	useEffect(() => {
		const frame = window.requestAnimationFrame(() => {
			setMobileNavOpen(false);
		});
		return () => window.cancelAnimationFrame(frame);
	}, [pathname]);

	return (
		<TeacherContext.Provider value={user}>
			<div className="min-h-screen bg-white text-[#1f2a44]">
				<header className="sticky top-0 z-40 border-b border-[#e3e7ee] bg-[#fdfdff]">
					<div className="mx-auto max-w-378 px-4 py-3 lg:px-6">
						{/* Mobile: compact bar + slide-down nav */}
						<div className="relative lg:hidden" ref={mobileNavRef}>
							<div className="flex items-center justify-between gap-3 rounded-2xl border border-[#cfe8ff] bg-gradient-to-br from-[#eef7ff] via-white to-[#f5f9ff] px-3 py-2.5 shadow-[0_4px_24px_rgba(29,111,235,0.08)]">
								<Link
									href="/teacher"
									className="flex items-center gap-[10px] rounded-[20px] px-[14px] py-[6px] outline-none focus-visible:ring-2 focus-visible:ring-[#7DC8FF] focus-visible:ring-offset-2"
									aria-label="Багшийн нүүр рүү очих"
								>
									<Image
										src="/bee.png"
										alt="UPDATE logo"
										width={44}
                    height={44}
                    className="h-10 w-10 object-contain"
                    priority
                  />
									<h1 className="text-[22px] mt-2 font-extrabold leading-[100%] tracking-tight text-[#1d1f24]">
										UPDATE
									</h1>
								</Link>
							</div>

              <nav
                aria-label="Багшийн навигаци"
                className="justify-self-center"
              >
                <ul className="flex flex-row items-center gap-[50px]">
                  {menuItems.map((item) => {
                    const isActive =
                      isMenuItemActive(pathname, item.href) ||
                      item.activePrefixes?.some((prefix) =>
                        isMenuItemActive(pathname, prefix),
                      );
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`inline-flex h-[35px] items-center rounded-[6px] px-[6px] py-[6px] text-[17px] font-semibold text-[#262626] transition-colors gap-15 ${
                            isActive
                              ? "border border-[#d2cccc]"
                              : "border border-transparent hover:border-[#d2cccc]"
                          }`}
                        >
                          {item.label}
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

        <main className="mx-auto w-full max-w-378 px-4 py-4 sm:py-6 lg:px-6">
          {children}
        </main>
      </div>
    </TeacherContext.Provider>
  );
}
