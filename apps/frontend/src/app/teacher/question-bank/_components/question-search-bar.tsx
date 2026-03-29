"use client";

export function QuestionSearchBar({
  value,
  onChange,
  placeholder = "Асуулт, сэдэв, түлхүүр үгээр хайх",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <input
        className="h-12 w-full rounded-xl border border-[#e5e7eb] bg-[#fbfbfc] px-4 text-sm text-[#111827] outline-none transition focus:border-[#cbd5e1] focus:bg-white focus:ring-4 focus:ring-[#e5e7eb]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}
