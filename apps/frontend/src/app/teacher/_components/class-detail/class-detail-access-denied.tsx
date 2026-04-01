"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ClassDetailAccessDenied() {
  const router = useRouter();
  return (
    <section className="px-4 py-10 sm:px-10">
      <div className="mx-auto max-w-lg rounded-2xl border border-[#d9dee8] bg-white p-8 text-center shadow-sm">
        <p className="text-4 font-semibold text-[#122459]">
          Энэ ангид хандах эрхгүй эсвэл анги олдсонгүй.
        </p>
        <button
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4f9dff] px-5 py-2.5 text-4 font-semibold text-white transition hover:bg-[#3f8ff5]"
          onClick={() => router.push("/teacher")}
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
          Нүүр хуудас
        </button>
      </div>
    </section>
  );
}
