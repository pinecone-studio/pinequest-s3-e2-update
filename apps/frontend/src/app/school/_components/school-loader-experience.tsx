/** @format */

"use client";

import { useEffect, useState } from "react";
import { HoneyCircularLoader } from "@/components/loaders/honey-circular-loader";

type SchoolLoaderExperienceProps = {
  /** Full-screen overlay for shell minimum-hold after route loader unmounts. */
  overlay?: boolean;
};

export function SchoolLoaderExperience({ overlay = false }: SchoolLoaderExperienceProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let start = 0;
    const tick = (now: number) => {
      if (cancelled) return;
      if (start === 0) {
        start = now;
        setProgress(0);
        requestAnimationFrame(tick);
        return;
      }
      const t = (now - start) / 1000;
      const asymptote = 84 * (1 - Math.exp(-t / 9.5));
      setProgress(Math.min(88, asymptote + Math.sin(now / 1600) * 1.8));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, []);

  const body = (
    <div
      className={[
        "relative flex min-h-[min(800px,calc(100vh-4rem))] flex-1 flex-col items-center justify-center overflow-hidden py-16",
        overlay ? "min-h-full grow" : "",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_40%,rgba(254,243,199,0.55)_0%,transparent_55%),linear-gradient(165deg,rgba(240,249,255,0.9)_0%,var(--background)_42%,rgba(255,251,235,0.85)_100%)]"
        aria-hidden
      />
      <div className="relative z-[1] flex w-full justify-center px-6">
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-amber-200/50 bg-white/75 px-6 py-12 shadow-[0_20px_50px_-20px_rgba(217,119,6,0.25),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-md">
          <HoneyCircularLoader
            progress={progress}
            backgroundImage="/bee-gin-here.png"
            backgroundImageFit="contain"
            showLabel={false}
            showCenterPercent={false}
            className="max-w-[260px]"
          />
        </div>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div
        className="absolute inset-0 z-50 flex min-h-0 flex-col bg-[#f7fafc]/85 backdrop-blur-[2px]"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading progress"
      >
        {body}
      </div>
    );
  }

  return body;
}
