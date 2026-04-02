"use client";

const VB = 200;
const CX = 100;
const CY = 100;
/** Orbit radius in viewBox units (matches former ring + bee offset). */
const BEE_ORBIT_R = 89;

/** One full orbit; higher = slower spin. */
const ORBIT_DURATION_S = 4.2;

/** Scale for bee drawing (1 = former default size). */
const BEE_GLYPH_SCALE = 1.65;
/** Y of body center in coords after BeeGlyph’s translate(-10,-10). */
const BEE_GLYPH_ANCHOR_Y = 2;

export type BeeRingProgressLoaderProps = {
  /** 0–100; drives aria and optional center “N %”. Bee orbits continuously. */
  progress: number;
  className?: string;
  /** Caption under the ring (e.g. “Collecting data…”). */
  label?: string;
  /** When false, the caption is hidden. Default true. */
  showLabel?: boolean;
  /** When false, hides the large center “N %”. Default true. */
  showCenterPercent?: boolean;
};

/**
 * Single bee on a circle; outer spin + inner counter-spin keeps the glyph upright.
 */
export function BeeRingProgressLoader({
  progress: progressRaw,
  className = "",
  label = "Collecting data...",
  showLabel = true,
  showCenterPercent = true,
}: BeeRingProgressLoaderProps) {
  const progress = Math.min(100, Math.max(0, progressRaw));
  const dur = `${ORBIT_DURATION_S}s`;

  return (
    <div
      className={[
        "flex w-full max-w-[min(280px,85vw)] flex-col items-center gap-4",
        className,
      ].join(" ")}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={showLabel && label ? label : "Loading progress"}
    >
      <div
        className="relative w-full drop-shadow-[0_8px_28px_rgba(29,111,235,0.14)]"
        style={{ aspectRatio: "1 / 1" }}
      >
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient
              id="bee-orbit-ring"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#E8F4FF" />
              <stop offset="50%" stopColor="#CFE8FF" />
              <stop offset="100%" stopColor="#EEF6FF" />
            </linearGradient>
          </defs>
          <g transform={`translate(${CX} ${CY})`}>
            <circle
              r={BEE_ORBIT_R}
              fill="none"
              stroke="url(#bee-orbit-ring)"
              strokeWidth="2.25"
              strokeDasharray="5 14"
              strokeLinecap="round"
              opacity={0.92}
            />
            <circle
              r={BEE_ORBIT_R - 5}
              fill="none"
              stroke="#7DC8FF"
              strokeWidth="0.65"
              opacity={0.35}
            />
            <g>
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur={dur}
                repeatCount="indefinite"
              />
              <g transform={`translate(0 ${-BEE_ORBIT_R})`}>
                <g>
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 0 0"
                    to="-360 0 0"
                    dur={dur}
                    repeatCount="indefinite"
                  />
                  <g
                    transform={`translate(0 ${BEE_GLYPH_ANCHOR_Y}) scale(${BEE_GLYPH_SCALE}) translate(0 ${-BEE_GLYPH_ANCHOR_Y})`}
                  >
                    <BeeGlyph />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>

        {showCenterPercent ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[clamp(1.75rem,6vw,2.35rem)] font-semibold tabular-nums tracking-tight text-[#122459]">
              {Math.round(progress)}
              <span className="text-[0.55em] font-semibold text-[#2f66b9]">
                %
              </span>
            </span>
          </div>
        ) : null}
      </div>

      {showLabel && label ? (
        <p className="max-w-xs text-center text-sm font-medium leading-snug text-[#4a5875]">
          {label}
        </p>
      ) : null}
    </div>
  );
}

/** Bee centered on anchor — navy outline + sky wings (UPDATE palette). */
function BeeGlyph() {
  return (
    <g transform="translate(-10,-10)" fill="none">
      <ellipse
        cx="10"
        cy="12"
        rx="4.5"
        ry="5.5"
        fill="#fcd34d"
        stroke="#122459"
        strokeWidth="1.05"
      />
      <line
        x1="7"
        y1="10"
        x2="13"
        y2="10"
        stroke="#122459"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="7.5"
        y1="13"
        x2="13"
        y2="13"
        stroke="#122459"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <ellipse
        cx="7.5"
        cy="7.2"
        rx="3.2"
        ry="1.85"
        fill="#EEF6FF"
        opacity={0.96}
        stroke="#7DC8FF"
        strokeWidth="0.5"
      />
      <ellipse
        cx="14.5"
        cy="7.5"
        rx="3.3"
        ry="2"
        fill="#EEF6FF"
        opacity={0.96}
        stroke="#7DC8FF"
        strokeWidth="0.5"
      />
      <circle cx="14" cy="6" r="0.95" fill="#122459" />
      <circle cx="14.3" cy="5.75" r="0.25" fill="#EEF6FF" />
    </g>
  );
}
