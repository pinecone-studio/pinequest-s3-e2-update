import type { ReactNode } from "react";

/** Гурван алхам: байршуулах → тохируулах → илгээх */
export type WizardStepKey = "upload" | "setup" | "send";

type Step = { key: WizardStepKey; label: string; helper?: string };

const STEPS: Step[] = [
  { key: "upload", label: "Байршуулах", helper: "PDF ба асуулт" },
  { key: "setup", label: "Тохируулах", helper: "Анги сонгох" },
  { key: "send", label: "Илгээх", helper: "Урьдчилж харах ба илгээх" },
];

function StepCard({
  step,
  idx,
  state,
}: {
  step: Step;
  idx: number;
  state: "done" | "active" | "upcoming";
}) {
  const isActive = state === "active";

  return (
    <div
      className={[
        "flex h-full min-h-[5.5rem] flex-col justify-center rounded-2xl border transition-all duration-200",
        isActive
          ? "border-primary bg-gradient-to-b from-[#eef6ff] to-white p-4 shadow-[0_8px_30px_-8px_rgba(47,115,196,0.35)] ring-[3px] ring-primary/25 md:-translate-y-0.5 md:scale-[1.02]"
          : state === "done"
            ? "border-[#c5dcf5] bg-[#f7fbff] p-3 opacity-95"
            : "border-[#e6edf8] border-dashed bg-white/80 p-3 opacity-[0.72]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-colors",
            isActive
              ? "border-primary bg-primary text-white shadow-md shadow-primary/30"
              : state === "done"
                ? "border-primary/40 bg-[#eef6ff] text-primary"
                : "border-[#d9e6fb] bg-white text-[#5c6f91]",
          ].join(" ")}
        >
          {state === "done" && !isActive ? (
            <span className="text-base leading-none" aria-hidden>
              ✓
            </span>
          ) : (
            idx + 1
          )}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={[
                "truncate text-sm font-extrabold",
                isActive ? "text-primary" : state === "done" ? "text-[#1f2a44]" : "text-[#5c6f91]",
              ].join(" ")}
            >
              {step.label}
            </p>
            {isActive ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                Одоо
              </span>
            ) : null}
          </div>
          <p
            className={[
              "mt-0.5 text-xs leading-snug",
              isActive ? "font-semibold text-[#2f73c4]" : "truncate text-[#5c6f91]",
            ].join(" ")}
          >
            {step.helper}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ExamStepper({ activeKey, rightSlot }: { activeKey: WizardStepKey; rightSlot?: ReactNode }) {
  const activeIdx = STEPS.findIndex((s) => s.key === activeKey);

  const items: ReactNode[] = [];
  STEPS.forEach((step, idx) => {
    const state = idx < activeIdx ? "done" : idx === activeIdx ? "active" : "upcoming";
    items.push(
      <li key={step.key} className="min-w-0">
        <StepCard step={step} idx={idx} state={state} />
      </li>,
    );
    if (idx < STEPS.length - 1) {
      const segmentDone = idx < activeIdx;
      items.push(
        <li key={`segment-${idx}`} className="hidden min-w-[12px] items-center md:flex" aria-hidden>
          <div className={`h-1.5 w-full rounded-full ${segmentDone ? "bg-primary" : "bg-[#e6edf8]"}`} />
        </li>,
      );
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-[#d9e6fb] bg-white px-3 py-1 text-sm font-extrabold text-primary">
            Шалгалт үүсгэх
          </div>
          <div className="hidden text-sm text-[#5c6f91] md:block">Гурван алхам — илүү хурдан, илүү ойлгомжтой.</div>
        </div>
        {rightSlot ? <div>{rightSlot}</div> : null}
      </div>

      <ol className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_minmax(12px,1.5rem)_minmax(0,1fr)_minmax(12px,1.5rem)_minmax(0,1fr)] md:items-center">
        {items}
      </ol>
    </div>
  );
}
