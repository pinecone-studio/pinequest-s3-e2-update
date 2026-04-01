"use client";

const VB = 200;
const CX = 100;
const CY = 100;
/** Orbit radius in viewBox units (matches former ring + bee offset). */
const BEE_ORBIT_R = 89;

const SWARM_BEE_COUNT = 8;
/** One full orbit; higher = slower spin. */
const SWARM_DURATION_S = 4.2;

export type BeeRingProgressLoaderProps = {
  /** 0–100; drives aria and optional center “N %”. Bees orbit continuously. */
  progress: number;
  className?: string;
  /** Caption under the swarm (e.g. “Collecting data…”). */
  label?: string;
  /** When false, the caption is hidden. Default true. */
  showLabel?: boolean;
  /** When false, hides the large center “N %”. Default true. */
  showCenterPercent?: boolean;
};

/** +1 = clockwise, −1 = counter-clockwise in SVG coords. */
function orbitDirectionForBee(i: number): 1 | -1 {
  const pattern: (1 | -1)[] = [1, -1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1];
  return pattern[i % pattern.length];
}

function orbitDurationSec(beeIndex: number): string {
  const spread = 0.85 + (beeIndex % 5) * 0.065 + (beeIndex % 3) * 0.04;
  return (SWARM_DURATION_S * spread).toFixed(2);
}

function orbitBeginDelaySec(beeIndex: number): string {
  return (beeIndex * 0.11).toFixed(2);
}

/**
 * Bees on the same circle, each with its own direction, speed, and phase.
 */
export function BeeRingProgressLoader({
  progress: progressRaw,
  className = "",
  label = "Collecting data...",
  showLabel = true,
  showCenterPercent = true,
}: BeeRingProgressLoaderProps) {
  const progress = Math.min(100, Math.max(0, progressRaw));
  const step = 360 / SWARM_BEE_COUNT;

  return (
    <div
      className={[
        "flex w-full max-w-[min(280px,85vw)] flex-col items-center gap-5",
        className,
      ].join(" ")}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={showLabel && label ? label : "Loading progress"}
    >
      <div
        className="relative w-full drop-shadow-[0_10px_32px_rgba(217,119,6,0.18)]"
        style={{ aspectRatio: "1 / 1" }}
      >
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <g transform={`translate(${CX} ${CY})`}>
            {Array.from({ length: SWARM_BEE_COUNT }, (_, i) => {
              const dir = orbitDirectionForBee(i);
              const dur = orbitDurationSec(i);
              const begin = `${orbitBeginDelaySec(i)}s`;
              const a0 = i * step;
              return (
                <g key={i}>
                  <g>
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="rotate"
                      from={`${a0} 0 0`}
                      to={`${a0 + 360 * dir} 0 0`}
                      dur={dur}
                      begin={begin}
                      repeatCount="indefinite"
                    />
                    <g transform={`translate(0 ${-BEE_ORBIT_R})`}>
                      <g>
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          from={`${-a0} 0 0`}
                          to={`${-a0 - 360 * dir} 0 0`}
                          dur={dur}
                          begin={begin}
                          repeatCount="indefinite"
                        />
                        <BeeGlyphSwarm />
                      </g>
                    </g>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {showCenterPercent ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[clamp(1.75rem,6vw,2.35rem)] font-semibold tabular-nums tracking-tight text-amber-950/90">
              {Math.round(progress)}
              <span className="text-[0.55em] font-semibold text-amber-800/75">
                %
              </span>
            </span>
          </div>
        ) : null}
      </div>

      {showLabel && label ? (
        <p className="max-w-xs text-center text-sm font-medium text-amber-900/70">
          {label}
        </p>
      ) : null}
    </div>
  );
}

/** Bee drawn for the swarm (small, centered on anchor). */
function BeeGlyphSwarm() {
  return (
    <g transform="translate(-10,-10)" fill="none">
      <ellipse
        cx="10"
        cy="12"
        rx="4.5"
        ry="5.5"
        fill="#fbbf24"
        stroke="#b45309"
        strokeWidth="1"
      />
      <line
        x1="7"
        y1="10"
        x2="13"
        y2="10"
        stroke="#1c1917"
        strokeWidth="1"
      />
      <line
        x1="7.5"
        y1="13"
        x2="13"
        y2="13"
        stroke="#1c1917"
        strokeWidth="1"
      />
      <ellipse
        cx="7.5"
        cy="7.2"
        rx="3.2"
        ry="1.85"
        fill="#fffbeb"
        opacity="0.88"
        stroke="#fcd34d"
        strokeWidth="0.45"
      />
      <ellipse
        cx="14.5"
        cy="7.5"
        rx="3.3"
        ry="2"
        fill="#fffbeb"
        opacity="0.88"
        stroke="#fcd34d"
        strokeWidth="0.45"
      />
      <circle cx="14" cy="6" r="0.95" fill="#1c1917" />
      <circle cx="14.3" cy="5.75" r="0.25" fill="#fef3c7" />
    </g>
  );
}
