"use client";

import { renderFormulaPreview } from "../_lib/utils";

type FormulaEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperDescription?: string;
  helperTitle?: string;
  helperTokens?: Array<{
    label: string;
    value: string;
  }>;
};

export function FormulaEditor({
  value,
  onChange,
  error,
  helperDescription,
  helperTitle,
  helperTokens = [],
}: FormulaEditorProps) {
  const insertToken = (token: string) => {
    const trimmed = value.trim();
    const nextValue = trimmed ? `${value}${value.endsWith(" ") ? "" : " "}${token}` : token;
    onChange(nextValue);
  };

  return (
    <div className="space-y-4">
      {helperTokens.length > 0 ? (
        <div className="rounded-2xl border border-[#dce5f2] bg-[#f8fbff] p-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#183153]">
              {helperTitle ?? "Хурдан томьёоны товчлол"}
            </p>
            {helperDescription ? (
              <p className="text-sm text-[#6d7f9c]">{helperDescription}</p>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {helperTokens.map((token) => (
              <button
                className="rounded-xl border border-[#d3deef] bg-white px-3 py-2 text-sm font-medium text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
                key={`${token.label}-${token.value}`}
                onClick={() => insertToken(token.value)}
                type="button"
              >
                {token.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#183153]">
            Томьёоны оролт
          </span>
          <textarea
            className="min-h-36 w-full rounded-2xl border border-[#d3deef] bg-white px-4 py-3 font-mono text-sm text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10"
            onChange={(event) => onChange(event.target.value)}
            placeholder={"Жишээ: \\frac{d}{dx} x^2 = 2x"}
            value={value}
          />
          {error ? (
            <p className="text-sm font-medium text-[#d34f4f]">{error}</p>
          ) : null}
        </label>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-[#183153]">
            Урьдчилан харагдах байдал
          </span>
          <div className="min-h-36 rounded-2xl border border-[#dce5f2] bg-[#f8fbff] px-4 py-3">
            <p className="font-mono text-sm leading-7 text-[#183153]">
              {renderFormulaPreview(value)}
            </p>
          </div>
          <p className="text-xs text-[#7d8ca5]">
            `\frac`, `\sqrt`, зэрэг үндсэн LaTeX маягийн тэмдэглэгээ, зэрэг,
            индексийг дэмжинэ.
          </p>
        </div>
      </div>
    </div>
  );
}
