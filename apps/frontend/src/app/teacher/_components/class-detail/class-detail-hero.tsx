"use client";

import { ArrowLeft, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

type ClassDetailHeroProps = {
  className: string;
};

export function ClassDetailHero({ className }: ClassDetailHeroProps) {
  const router = useRouter();
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6">
      <button
        className="inline-flex items-center gap-2 text-4 font-semibold text-[#122459] transition-colors hover:text-[#122459]"
        onClick={() => router.push("/teacher")}
        type="button"
      >
        <ArrowLeft className="h-5 w-5" />
        Нүүр Хуудас Руу Буцах
      </button>
      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#7DC8FF] bg-[#EDF6FF] text-[#122459]">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-5 font-extrabold text-[#122459]">{className}</h1>
          <p className="mt-2 text-3 text-[#122459]">
            Мөр дарахад нэрний доор өмнөх шалгалтын дүн нээгдэнэ. Дахин дархад
            хаагдана.
          </p>
        </div>
      </div>
    </div>
  );
}
