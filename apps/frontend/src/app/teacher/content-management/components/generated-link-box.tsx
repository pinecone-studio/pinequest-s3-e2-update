import { Copy } from "lucide-react";

export function GeneratedLinkBox({
  link,
  onCopy,
}: {
  link: string;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
      <p className="text-2 font-semibold text-[#1f2a44]">Сурагчийн шалгалтын линк</p>
      <div className="flex flex-col gap-2 md:flex-row">
        <input
          className="h-10 w-full rounded-lg border border-[#d9e6fb] bg-white px-2 text-2 text-[#1f2a44]"
          readOnly
          value={link}
        />
        <button
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#d9e6fb] bg-white px-3 py-2 text-2 text-[#335c96]"
          onClick={onCopy}
          type="button"
        >
          <Copy className="h-3.5 w-3.5" /> Хуулах
        </button>
      </div>
    </div>
  );
}
