import type { TabKey } from "../types";

export function TabSwitcher({ value, onChange }: { value: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <div className="rounded-2xl border border-[#d9e6fb] bg-white p-2 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <button
          className={`rounded-xl px-3 py-2 text-2 font-semibold ${
            value === "saved" ? "bg-[#4f9dff] text-white" : "bg-[#f7fbff] text-[#335c96]"
          }`}
          onClick={() => onChange("saved")}
          type="button"
        >
          Өмнө үүсгэсэн шалгалтууд
        </button>
        <button
          className={`rounded-xl px-3 py-2 text-2 font-semibold ${
            value === "create" ? "bg-[#4f9dff] text-white" : "bg-[#f7fbff] text-[#335c96]"
          }`}
          onClick={() => onChange("create")}
          type="button"
        >
          Шинэ шалгалт үүсгэх
        </button>
      </div>
    </div>
  );
}
