import type { ChangeEvent } from "react";

export function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  const id = `toggle-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked);

  return (
    <div className={`flex items-start justify-between gap-4 rounded-2xl border border-[#d9e6fb] bg-white p-4 ${disabled ? "opacity-60" : ""}`}>
      <div className="min-w-0">
        <label className="text-sm font-extrabold text-[#1f2a44]" htmlFor={id}>
          {label}
        </label>
        {description ? <p className="mt-1 text-sm text-[#5c6f91]">{description}</p> : null}
      </div>
      <div className="flex-shrink-0">
        <input
          aria-label={label}
          checked={checked}
          disabled={disabled}
          id={id}
          onChange={handleChange}
          type="checkbox"
          className="h-6 w-11 cursor-pointer appearance-none rounded-full bg-[#e6eefc] checked:bg-primary relative transition"
        />
        {/* Tailwind doesn't style checked: track in this minimal setup, so we use a pseudo-like span */}
        <span className="sr-only">{checked ? "Асаалттай" : "Унтраалттай"}</span>
      </div>
    </div>
  );
}

