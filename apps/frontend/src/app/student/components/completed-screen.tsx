"use client";
import { ArrowDownRightFromSquareIcon, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CompletedScreen() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-10 text-[#1f2a44]">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#dbe3f0] bg-white p-8 text-center shadow-[0_14px_40px_rgba(27,39,80,0.08)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf8ef]">
          <CheckCircle2 className="h-9 w-9 text-[#18a650]" />
        </div>
        <h1 className="mt-4 text-6 font-extrabold text-[#1f2a44]">
          Шалгалт амжилттай илгээгдлээ
        </h1>
        <p className="mt-2 text-4 text-[#5f7090] mb-[30px]">
          Таны хариултууд системд хадгалагдсан.
        </p>
        <div className="w-full flex justify-end ">
          <button
            type="button"
            onClick={() => router.push("/teacher")}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#dbe3f0] bg-white px-5 py-2.5 text-3 font-semibold text-[#1f2a44] transition hover:bg-[#f6f9ff]"
          >
            Teacher
            <ArrowDownRightFromSquareIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
