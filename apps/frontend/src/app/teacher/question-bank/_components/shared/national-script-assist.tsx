"use client";

import { useState } from "react";

type PreviewMode = "galig" | "mongolian";

type NationalScriptAssistProps = {
  applyLabel?: string;
  heading?: string;
  placeholder?: string;
  onApplyText: (value: string) => void;
};

export function NationalScriptAssist({
  applyLabel = "Монгол бичгийг асуулгад оруулах",
  heading = "Галиг эхээс монгол бичгийн хувилбар бэлдэх",
  placeholder = "Жишээ нь: Монгул хүмүн усу",
  onApplyText,
}: NationalScriptAssistProps) {
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("mongolian");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const hasPreview = convertedText.length > 0;
  const isMongolianPreview = previewMode === "mongolian";
  const previewText = previewMode === "mongolian" ? convertedText : inputText;

  const handleConvert = async () => {
    if (!inputText.trim()) {
      setErrorMessage("Галиг эхээ оруулна уу.");
      setFeedbackMessage("");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setFeedbackMessage("");

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = (await response.json()) as { result?: string; error?: string };

      if (!response.ok || typeof data.result !== "string") {
        throw new Error(data.error ?? "Хөрвүүлэлт амжилтгүй боллоо.");
      }

      setConvertedText(data.result);
      setPreviewMode("mongolian");
      setFeedbackMessage("Монгол бичгийн хувилбарыг үүсгэлээ.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Хөрвүүлэлт амжилтгүй боллоо.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    const textToApply = previewMode === "mongolian" ? convertedText : inputText;
    if (!textToApply.trim()) return;

    onApplyText(textToApply);
    setFeedbackMessage(
      previewMode === "mongolian"
        ? "Монгол бичгийн хувилбарыг асуулгад орууллаа."
        : "Галиг эхийг асуулгад орууллаа.",
    );
    setErrorMessage("");
  };

  return (
    <div className="mt-4 rounded-3xl border border-[#d7e3f4] bg-[#f7faff] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7487a6]">
            Үндэсний бичигт зориулсан нэмэлт оролт
          </p>
          <h3 className="mt-2 text-base font-semibold text-[#183153]">
            {heading}
          </h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#536a90]">
          Зөвхөн Үндэсний бичиг
        </span>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-semibold text-[#183153]">
          Галиг эх
        </span>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-[#d3deef] bg-white px-4 py-3 text-sm leading-6 text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10"
          onChange={(event) => setInputText(event.target.value)}
          placeholder={placeholder}
          value={inputText}
        />
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#1f6feb] px-4 text-sm font-semibold text-white transition hover:bg-[#195fcc] disabled:cursor-not-allowed disabled:bg-[#94b6f3]"
          disabled={loading}
          onClick={handleConvert}
          type="button"
        >
          {loading ? "Хөрвүүлж байна..." : "Монгол бичиг рүү хөрвүүлэх"}
        </button>

        {hasPreview ? (
          <div className="inline-flex rounded-2xl border border-[#d3deef] bg-white p-1">
            <button
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                previewMode === "galig"
                  ? "bg-[#edf4ff] text-[#183153]"
                  : "text-[#6d7f99] hover:text-[#183153]"
              }`}
              onClick={() => setPreviewMode("galig")}
              type="button"
            >
              Галиг
            </button>
            <button
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                previewMode === "mongolian"
                  ? "bg-[#edf4ff] text-[#183153]"
                  : "text-[#6d7f99] hover:text-[#183153]"
              }`}
              onClick={() => setPreviewMode("mongolian")}
              type="button"
            >
              Монгол бичиг
            </button>
          </div>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-[#ffd6d6] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#c84b4b]">
          {errorMessage}
        </p>
      ) : null}

      {feedbackMessage ? (
        <p className="mt-4 rounded-2xl border border-[#d6ead4] bg-[#f3fbf0] px-4 py-3 text-sm font-medium text-[#326c3a]">
          {feedbackMessage}
        </p>
      ) : null}

      {hasPreview ? (
        <>
          <div className="mt-4 rounded-2xl border border-[#d3deef] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7487a6]">
              {previewMode === "mongolian"
                ? "Монгол бичгийн урьдчилан харах"
                : "Галиг урьдчилан харах"}
            </p>
            <div
              className={`mt-3 rounded-2xl bg-[#fbfdff] px-4 py-3 text-sm text-[#183153] ${
                isMongolianPreview
                  ? "min-h-56 overflow-x-auto leading-8"
                  : "min-h-28 whitespace-pre-wrap leading-7"
              }`}
              style={
                isMongolianPreview
                  ? {
                      writingMode: "vertical-lr",
                      textOrientation: "mixed",
                      whiteSpace: "pre-wrap",
                    }
                  : undefined
              }
            >
              {previewText}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#d3deef] bg-white px-4 text-sm font-semibold text-[#183153] transition hover:bg-[#edf4ff]"
              onClick={handleApply}
              type="button"
            >
              {previewMode === "mongolian"
                ? applyLabel
                : "Галиг эхийг оруулах"}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
