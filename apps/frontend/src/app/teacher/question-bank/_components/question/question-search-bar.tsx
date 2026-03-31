"use client";

type QuestionSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function QuestionSearchBar({
  value,
  onChange,
  placeholder = "Асуулт, сэдэв, түлхүүр үгээр хайх",
}: QuestionSearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-[#e5e7eb] bg-[#fbfbfc] pl-10 pr-10 text-sm text-[#111827] outline-none transition focus:border-[#cbd5e1] focus:bg-white focus:ring-4 focus:ring-[#e5e7eb]"
      />

      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">
        🔍
      </span>

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#9ca3af] hover:text-[#111827]"
        >
          ✕
        </button>
      )}
    </div>
  );
}