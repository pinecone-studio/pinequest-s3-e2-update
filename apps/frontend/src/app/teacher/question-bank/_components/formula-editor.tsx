"use client";

import { ArrowLeft, ArrowRight, Delete, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { renderFormulaPreview } from "../_lib/utils";

const CURSOR_MARKER = "__CURSOR__";
const SELECTION_MARKER = "__SEL__";

const BASIC_KEYS = [
  { label: "+", template: " + " },
  { label: "-", template: " - " },
  { label: "×", template: " \\times " },
  { label: "÷", template: " \\div " },
  { label: "=", template: " = " },
  { label: "( )", template: `(${SELECTION_MARKER}${CURSOR_MARKER})` },
  { label: "[ ]", template: `[${SELECTION_MARKER}${CURSOR_MARKER}]` },
  { label: "a/b", template: `${SELECTION_MARKER}/${CURSOR_MARKER}` },
  { label: "√", template: `√(${SELECTION_MARKER}${CURSOR_MARKER})` },
  { label: "x²", template: `${SELECTION_MARKER}^2${CURSOR_MARKER}`, fallbackSelection: "x" },
  { label: "xⁿ", template: `${SELECTION_MARKER}^{${CURSOR_MARKER}}`, fallbackSelection: "x" },
  { label: "xₙ", template: `${SELECTION_MARKER}_{${CURSOR_MARKER}}`, fallbackSelection: "x" },
] as const;

const FUNCTION_KEYS = [
  { label: "sin", template: `sin(${SELECTION_MARKER}${CURSOR_MARKER})` },
  { label: "cos", template: `cos(${SELECTION_MARKER}${CURSOR_MARKER})` },
  { label: "tan", template: `tan(${SELECTION_MARKER}${CURSOR_MARKER})` },
  { label: "log", template: `log(${SELECTION_MARKER}${CURSOR_MARKER})` },
  { label: "ln", template: `ln(${SELECTION_MARKER}${CURSOR_MARKER})` },
  { label: "lim", template: `lim x->${CURSOR_MARKER}` },
  { label: "sum", template: `sum(i=1..${CURSOR_MARKER})` },
  { label: "int", template: `int(${SELECTION_MARKER}..${CURSOR_MARKER})` },
  { label: "f(x)", template: `f(${SELECTION_MARKER}${CURSOR_MARKER})` },
  { label: "|x|", template: `|${SELECTION_MARKER}${CURSOR_MARKER}|` },
  { label: "exp", template: `exp(${SELECTION_MARKER}${CURSOR_MARKER})` },
  { label: "dx", template: " dx" },
] as const;

const SYMBOL_KEYS = [
  { label: "π", template: "π" },
  { label: "θ", template: "θ" },
  { label: "α", template: "α" },
  { label: "β", template: "β" },
  { label: "Δ", template: "Δ" },
  { label: "λ", template: "λ" },
  { label: "μ", template: "μ" },
  { label: "σ", template: "σ" },
  { label: "ω", template: "ω" },
  { label: "∞", template: "∞" },
  { label: "≤", template: "<=" },
  { label: "≥", template: ">=" },
] as const;

type FormulaEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperTokens?: Array<{
    label: string;
    value: string;
  }>;
};

type KeyboardGroup = "basic" | "functions" | "symbols";
type KeyboardKey = {
  label: string;
  template: string;
  fallbackSelection?: string;
};

export function FormulaEditor({
  value,
  onChange,
  error,
  helperTokens = [],
}: FormulaEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState<KeyboardGroup>("basic");

  const focusAt = (position: number) => {
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(position, position);
    });
  };

  const commitValue = (nextValue: string, nextCursorPosition?: number) => {
    if (nextValue === value) return;

    setHistoryStack((current) => [...current.slice(-19), value]);
    onChange(nextValue);

    if (typeof nextCursorPosition === "number") {
      focusAt(nextCursorPosition);
    }
  };

  const insertTemplate = (key: KeyboardKey) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const selectedText = value.slice(start, end);
    const nextSelection =
      selectedText
      || ("fallbackSelection" in key && key.fallbackSelection
        ? key.fallbackSelection
        : "");
    const withSelection = key.template.replaceAll(SELECTION_MARKER, nextSelection);
    const cursorIndex =
      withSelection.indexOf(CURSOR_MARKER) >= 0
        ? withSelection.indexOf(CURSOR_MARKER)
        : withSelection.length;
    const insertedText = withSelection.replace(CURSOR_MARKER, "");
    const nextValue =
      value.slice(0, start) + insertedText + value.slice(end);

    commitValue(nextValue, start + cursorIndex);
  };

  const moveCursor = (direction: "left" | "right") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentPosition = textarea.selectionStart ?? value.length;
    const nextPosition =
      direction === "left"
        ? Math.max(0, currentPosition - 1)
        : Math.min(value.length, currentPosition + 1);

    textarea.focus();
    textarea.setSelectionRange(nextPosition, nextPosition);
  };

  const deleteBackward = () => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;

    if (start === 0 && end === 0) return;

    const deleteStart = start === end ? start - 1 : start;
    const nextValue = value.slice(0, deleteStart) + value.slice(end);
    commitValue(nextValue, deleteStart);
  };

  const undoLastChange = () => {
    const previousValue = historyStack.at(-1);
    if (typeof previousValue !== "string") return;

    setHistoryStack((current) => current.slice(0, -1));
    onChange(previousValue);
    focusAt(previousValue.length);
  };

  const keyboardTabs = [
    { id: "basic" as const, label: "abc" },
    { id: "functions" as const, label: "f(x)" },
    { id: "symbols" as const, label: "πθ" },
  ];

  const activeKeys =
    activeGroup === "basic"
      ? BASIC_KEYS
      : activeGroup === "functions"
        ? [
            ...helperTokens.map((token) => ({
              label: token.label,
              template: token.value,
            })),
            ...FUNCTION_KEYS,
          ]
        : SYMBOL_KEYS;

  const dedupedKeys = activeKeys.filter(
    (key, index, array) =>
      array.findIndex((item) => item.label === key.label) === index,
  );

  const keyboardHint =
    activeGroup === "basic"
      ? "Суурь оператор, хаалт, зэрэг, язгуурын shortcut."
      : activeGroup === "functions"
        ? "Функц, тригонометр, логарифм, интегралын shortcut."
        : "Грек үсэг болон математик тэмдэг нэмнэ.";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#dce5f2] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {keyboardTabs.map((tab) => {
              const isActive = tab.id === activeGroup;
              return (
                <button
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#183153] text-white"
                      : "border border-[#d3deef] bg-[#f8fbff] text-[#365077] hover:border-[#aac8f8]"
                  }`}
                  key={tab.id}
                  onClick={() => setActiveGroup(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionButton
              disabled={historyStack.length === 0}
              icon={RotateCcw}
              label="Буцаах"
              onClick={undoLastChange}
            />
            <ActionButton
              disabled={value.length === 0}
              icon={ArrowLeft}
              label="Зүүн"
              onClick={() => moveCursor("left")}
            />
            <ActionButton
              disabled={value.length === 0}
              icon={ArrowRight}
              label="Баруун"
              onClick={() => moveCursor("right")}
            />
            <ActionButton
              disabled={value.length === 0}
              icon={Delete}
              label="Устгах"
              onClick={deleteBackward}
            />
          </div>
        </div>

        <p className="mt-3 text-sm text-[#6d7f9c]">{keyboardHint}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-6">
          {dedupedKeys.map((key) => (
            <button
              className="rounded-xl border border-[#d3deef] bg-[#f8fbff] px-3 py-3 text-sm font-medium text-[#365077] transition hover:border-[#aac8f8] hover:bg-white hover:text-[#1f6feb]"
              key={`${activeGroup}-${key.label}-${key.template}`}
              onClick={() => insertTemplate(key)}
              type="button"
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#183153]">
            Томьёоны оролт
          </span>
          <textarea
            ref={textareaRef}
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
            `\frac`, `\sqrt`, функц, грек үсэг, зэрэг, индекс зэрэг
            тэмдэглэгээг keyboard-аас шууд нэмж болно.
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  icon: typeof RotateCcw;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${
        disabled
          ? "border-[#e4ebf5] bg-[#f8fbff] text-[#b6c0d0]"
          : "border-[#d3deef] bg-white text-[#365077] hover:border-[#aac8f8] hover:text-[#1f6feb]"
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
}
