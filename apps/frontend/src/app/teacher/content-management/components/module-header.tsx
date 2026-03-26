import { FileCheck2 } from "lucide-react";

export function ModuleHeader() {
  return (
    <section className="rounded-2xl border border-[#d9e6fb] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-[#4f9dff]/15 p-2 text-[#2f73c4]">
          <FileCheck2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-4 font-extrabold text-[#1f2a44]">Контентийн менежмент</h1>
          <p className="mt-1 text-2 text-[#5c6f91]">
            Шалгалт үүсгэх, хадгалах, засах, анги руу илгээх болон сурагчийн шалгалт өгөх урсгал.
          </p>
        </div>
      </div>
    </section>
  );
}
