import { CheckCircle2 } from "lucide-react";

export function CompletedScreen() {
  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-10 text-[#1f2a44]">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#dbe3f0] bg-white p-8 text-center shadow-[0_14px_40px_rgba(27,39,80,0.08)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf8ef]">
          <CheckCircle2 className="h-9 w-9 text-[#18a650]" />
        </div>
        <h1 className="mt-4 text-6 font-extrabold text-[#1f2a44]">
          Шалгалт амжилттай илгээгдлээ
        </h1>
        <p className="mt-2 text-4 text-[#5f7090]">
          Таны хариултууд системд хадгалагдсан.
        </p>
      </div>
    </main>
  );
}
