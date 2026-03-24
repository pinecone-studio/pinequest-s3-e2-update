"use client";

import { useRouter } from "next/navigation";

type TeacherView = "overview" | "review" | "stats";

type HeaderProps = {
  activeView: TeacherView;
  onChangeView: (view: TeacherView) => void;
};

export default function Header({ activeView, onChangeView }: HeaderProps) {
  const router = useRouter();

  const buttonClass = (view: TeacherView) => {
    if (activeView === view) {
      return "rounded-full bg-[#4ca3f0] px-6 py-2 text-4 font-semibold text-white";
    }
    return "rounded-full px-6 py-2 text-4 font-semibold text-[#1f2a44] transition hover:bg-[#edf2f8]";
  };

  return (
    <header className="border-b border-[#d6dbe3] bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => router.push("/")}
          type="button"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5cacf4] text-white">
            <span className="text-4">🎓</span>
          </div>
          <div>
            <p className="text-8 font-extrabold">Шалгалтын Тогтолцоо</p>
            <p className="text-4 text-[#4a5875]">10-А анги · Нийгмийн Ухаан</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button className={buttonClass("review")} onClick={() => onChangeView("review")} type="button">
            Шалгах
          </button>
          <button className={buttonClass("stats")} onClick={() => onChangeView("stats")} type="button">
            Тоон үзүүлэлт
          </button>
        </div>
      </div>
    </header>
  );
}
