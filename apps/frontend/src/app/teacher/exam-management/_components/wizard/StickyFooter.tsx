import type { ReactNode } from "react";

export function StickyFooter({
  left,
  right,
}: {
  left?: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="pt-6">
      <div className="sticky bottom-0 z-10 border-t border-[#e6edf8] bg-[#f6faff]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-0 py-4">
          <div className="min-w-0">{left}</div>
          <div className="flex shrink-0 items-center gap-3">{right}</div>
        </div>
      </div>
    </div>
  );
}

