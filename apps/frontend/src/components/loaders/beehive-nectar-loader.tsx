"use client";

import { useId, useMemo } from "react";
import type { CSSProperties } from "react";

export type BeehiveNectarLoaderProps = {
  /** 0–100 for accessibility / completion state. */
  progress: number;
  className?: string;
  label?: string;
  showLabel?: boolean;
  /** Bee orbit duration while progress &lt; 100 (ms). Default 3400. */
  tripDurationMs?: number;
  /**
   * Max orbit radius in px (with `min(31vw, …)`). Default 126; larger = bigger loader.
   */
  orbitMaxPx?: number;
};

/**
 * Bee travels on a circular stroke; orbit radius matches the ring geometry.
 * At 100% the bee animation stops in a settled pose.
 */
export function BeehiveNectarLoader({
  progress: progressRaw,
  className = "",
  label = "Collecting data...",
  showLabel = true,
  tripDurationMs = 3400,
  orbitMaxPx = 126,
}: BeehiveNectarLoaderProps) {
  const p = Math.min(100, Math.max(0, progressRaw));
  const complete = p >= 100;
  const rawId = useId();
  const softFilterId = useMemo(
    () => `nectar-orbit-soft-${rawId.replace(/:/g, "")}`,
    [rawId],
  );

  const orbitRadius = `min(31vw, ${orbitMaxPx}px)`;
  const boxMaxPx = Math.min(340, orbitMaxPx * 2 + 48);

  const motionStyle = {
    "--nectar-trip-duration": `${tripDurationMs}ms`,
    "--nectar-orbit-radius": orbitRadius,
    "--nectar-bee-settled-y": "calc(var(--nectar-orbit-radius) * 0.62)",
    maxWidth: `min(${boxMaxPx}px, 92vw)`,
  } as CSSProperties;

  return (
    <div
      className={["flex w-full flex-col items-center gap-5", className].join(
        " ",
      )}
      style={motionStyle}
      role="progressbar"
      aria-valuenow={Math.round(p)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={showLabel && label ? label : "Loading progress"}
    >
      <div
        className="relative mx-auto shrink-0"
        style={{
          width: `calc(2 * ${orbitRadius})`,
          height: `calc(2 * ${orbitRadius})`,
        }}
        aria-hidden
      >
        <svg
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <filter
              id={softFilterId}
              x="-14%"
              y="-14%"
              width="128%"
              height="128%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="100"
            stroke="#c9b29a"
            strokeOpacity={0.42}
            strokeWidth="1.5"
            vectorEffect="nonScalingStroke"
            filter={`url(#${softFilterId})`}
          />
        </svg>
        <div
          className={
            complete
              ? "nectar-bee-settled pointer-events-none absolute left-1/2 top-1/2 h-9 w-9"
              : "nectar-bee-trip pointer-events-none absolute left-1/2 top-1/2 h-9 w-9"
          }
        >
          <BeeGlyph className="h-9 w-9 drop-shadow-md" />
        </div>
      </div>

      {showLabel && label ? (
        <p className="max-w-xs text-center text-sm font-medium text-amber-950/75">
          {label}
        </p>
      ) : null}
    </div>
  );
}

function BeeGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="11"
        cy="13"
        rx="5.5"
        ry="6.5"
        fill="#fbbf24"
        stroke="#92400e"
        strokeWidth="1.1"
      />
      <line
        x1="7.5"
        y1="11"
        x2="14.5"
        y2="11"
        stroke="#1c1917"
        strokeWidth="1.05"
      />
      <line
        x1="8"
        y1="14"
        x2="14"
        y2="14"
        stroke="#1c1917"
        strokeWidth="1.05"
      />
      <ellipse
        cx="8"
        cy="8"
        rx="4"
        ry="2.3"
        fill="#fffbeb"
        opacity="0.9"
        stroke="#fcd34d"
        strokeWidth="0.55"
      />
      <ellipse
        cx="16.5"
        cy="8.5"
        rx="4.2"
        ry="2.5"
        fill="#fffbeb"
        opacity="0.9"
        stroke="#fcd34d"
        strokeWidth="0.55"
      />
      <circle cx="15.5" cy="6.5" r="1.2" fill="#1c1917" />
      <circle cx="15.85" cy="6.2" r="0.32" fill="#fef3c7" />
    </svg>
  );
}
