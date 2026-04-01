"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

const VB = 200;
const CX = 100;
const CY = 100;
/** Liquid clipped to this circle. */
const R_CLIP = 82;
/** Optional outer ring (viewBox units), outside clip. */
const R_RING = 87;
const BOTTOM = CY + R_CLIP;
const FILL_RANGE = R_CLIP * 2;
/** SVG wave tile width; must match `<animateTransform>` translation for seamless motion. */
const WAVE_PERIOD = 120;

export type HoneyCircularLoaderProps = {
  /** 0–100; controls honey level and accessibility. */
  progress: number;
  className?: string;
  /** Optional caption under the circle. */
  label?: string;
  /** When false, the caption is hidden. Default true. */
  showLabel?: boolean;
  /** When false, hides the center percentage. Default true. */
  showCenterPercent?: boolean;
  /**
   * Optional photo inside the jar (clipped to the inner circle), behind the honey fill.
   * Use a path under `/public` (e.g. `/school-mascot.png`) or any absolute image URL.
   */
  backgroundImage?: string;
  /**
   * How the image fits inside the inner circle. Default `"cover"` (same idea as CSS object-fit).
   */
  backgroundImageFit?: "cover" | "contain";
  /**
   * When true, draws a soft ring around the jar (opt-in, e.g. school loading).
   */
  showJarOutline?: boolean;
  /** Extra Tailwind / classes for the caption under the jar. */
  labelClassName?: string;
};

/**
 * Circular “honey jar” loader: golden fill rises with progress and a gentle wave animates at the surface.
 */
export function HoneyCircularLoader({
  progress: progressRaw,
  className = "",
  label = "Loading...",
  showLabel = true,
  showCenterPercent = true,
  backgroundImage,
  backgroundImageFit = "cover",
  showJarOutline = false,
  labelClassName = "",
}: HoneyCircularLoaderProps) {
  const progress = Math.min(100, Math.max(0, progressRaw));
  const rawId = useId().replace(/:/g, "");
  const clipId = `honey-clip-${rawId}`;
  const gradId = `honey-grad-${rawId}`;
  const filterId = `honey-soft-${rawId}`;

  const liftRef = useRef(((100 - progress) / 100) * FILL_RANGE);
  const [fillLift, setFillLift] = useState(
    () => ((100 - progress) / 100) * FILL_RANGE,
  );

  useEffect(() => {
    const t = ((100 - progress) / 100) * FILL_RANGE;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const cur = liftRef.current;
      const next = cur + (t - cur) * 0.14;
      const settled = Math.abs(t - next) < 0.35;
      const nv = settled ? t : next;
      liftRef.current = nv;
      setFillLift(nv);
      if (!settled) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [progress]);

  const imagePar =
    backgroundImageFit === "contain" ? "xMidYMid meet" : "xMidYMid slice";

  const wavePath = useMemo(() => {
    const topY = CY - R_CLIP;
    const amp = 3.25;
    const left = -WAVE_PERIOD * 5;
    const right = WAVE_PERIOD * 7;
    const parts: string[] = [`M ${left} ${BOTTOM}`, `L ${left} ${topY}`];
    for (let x = left; x < right - 0.1; x += WAVE_PERIOD) {
      const mid = x + WAVE_PERIOD / 2;
      const crest = x + WAVE_PERIOD * 0.25;
      const trough = x + WAVE_PERIOD * 0.75;
      parts.push(
        `Q ${crest} ${topY - amp} ${mid} ${topY} Q ${trough} ${topY + amp} ${x + WAVE_PERIOD} ${topY}`,
      );
    }
    parts.push(`L ${right} ${BOTTOM}`, `Z`);
    return parts.join(" ");
  }, []);

  return (
    <div
      className={[
        "flex w-full max-w-[min(300px,88vw)] flex-col items-center gap-4 text-foreground",
        className,
      ].join(" ")}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={showLabel && label ? label : "Loading progress"}
    >
      <div
        className={[
          "relative w-full",
          showJarOutline
            ? "drop-shadow-[0_14px_40px_rgba(217,119,6,0.2)]"
            : "drop-shadow-[0_10px_32px_rgba(217,119,6,0.22)]",
        ].join(" ")}
        style={{ aspectRatio: "1 / 1" }}
      >
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="35%" stopColor="#ea580c" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fcd34d" />
            </linearGradient>
            <filter
              id={filterId}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="b" />
              <feColorMatrix
                in="b"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0"
                result="s"
              />
              <feMerge>
                <feMergeNode in="s" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id={clipId}>
              <circle cx={CX} cy={CY} r={R_CLIP} />
            </clipPath>
          </defs>

          {showJarOutline ? (
            <g aria-hidden>
              <circle
                cx={CX}
                cy={CY}
                r={R_RING + 5}
                fill="none"
                stroke="#fde68a"
                strokeOpacity={0.35}
                strokeWidth={10}
                style={{ filter: "blur(6px)" }}
              />
              <circle
                cx={CX}
                cy={CY}
                r={R_RING}
                fill="none"
                stroke="#fefce8"
                strokeWidth={3}
                strokeOpacity={0.95}
              />
              <circle
                cx={CX + 0.35}
                cy={CY + 0.35}
                r={R_RING}
                fill="none"
                stroke="#d97706"
                strokeOpacity={0.22}
                strokeWidth={1.5}
              />
            </g>
          ) : null}

          <g clipPath={`url(#${clipId})`}>
            {backgroundImage ? (
              <image
                href={backgroundImage}
                x={CX - R_CLIP}
                y={CY - R_CLIP}
                width={R_CLIP * 2}
                height={R_CLIP * 2}
                preserveAspectRatio={imagePar}
                aria-hidden
              />
            ) : null}
            <rect
              x={CX - R_CLIP - 2}
              y={CY - R_CLIP}
              width={(R_CLIP + 2) * 2}
              height={R_CLIP * 2 + 4}
              fill="#fef3c7"
              opacity={
                backgroundImage
                  ? showJarOutline
                    ? 0.12
                    : 0.2
                  : 0.85
              }
            />
            <g transform={`translate(0, ${fillLift})`}>
              <g filter={`url(#${filterId})`}>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`0 0; -${WAVE_PERIOD} 0`}
                    dur="5.25s"
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                  <path d={wavePath} fill={`url(#${gradId})`} />
                </g>
              </g>
            </g>
            {/* Specular strip */}
            <ellipse
              cx={CX - R_CLIP * 0.35}
              cy={CY - R_CLIP * 0.15}
              rx={R_CLIP * 0.22}
              ry={R_CLIP * 0.5}
              fill="#fffbeb"
              opacity={0.22}
              style={{ mixBlendMode: "screen" as const, pointerEvents: "none" }}
            />
          </g>
        </svg>

        {showCenterPercent ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className={[
                "select-none text-[clamp(1.35rem,9vw,2.35rem)] font-semibold tabular-nums tracking-tight",
                backgroundImage
                  ? "text-amber-950 [text-shadow:0_0_12px_rgba(255,251,235,0.95),0_2px_4px_rgba(251,191,36,0.5)]"
                  : "text-amber-950/90 drop-shadow-[0_1px_0_rgba(255,251,235,0.85)]",
              ].join(" ")}
            >
              {Math.round(progress)}
              <span className="text-[0.58em] font-semibold text-amber-900/75">
                %
              </span>
            </span>
          </div>
        ) : null}
      </div>

      {showLabel && label ? (
        <p
          className={[
            "max-w-full px-2 text-center text-sm font-medium leading-snug text-amber-900/80 sm:text-base",
            labelClassName,
          ].join(" ")}
        >
          {label}
        </p>
      ) : null}
    </div>
  );
}
