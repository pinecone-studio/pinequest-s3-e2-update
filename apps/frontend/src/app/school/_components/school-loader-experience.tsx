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
    const start = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const t = (now - start) / 1000;
      const asymptote = 78 * (1 - Math.exp(-t / 22));
      setProgress(Math.min(81, asymptote + Math.sin(now / 2800) * 1.3));
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
        overlay ? "min-h-screen" : "",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_40%,rgba(254,243,199,0.55)_0%,transparent_55%),linear-gradient(165deg,rgba(240,249,255,0.9)_0%,var(--background)_42%,rgba(255,251,235,0.85)_100%)]"
        aria-hidden
      />
      <div className="relative z-[1] w-full max-w-md px-6">
        <div className="rounded-[2rem] border border-amber-200/50 bg-white/75 px-8 py-10 shadow-[0_20px_50px_-20px_rgba(217,119,6,0.25),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-md sm:px-10 sm:py-12">
          <HoneyCircularLoader
            progress={progress}
            backgroundImage="/bee-gin-here.png"
            backgroundImageFit="contain"
            showJarOutline
            showLabel={false}
            showCenterPercent={false}
            className="mx-auto min-h-0 max-w-[min(280px,82vw)] justify-center gap-5 sm:gap-7"
          />
        </div>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col bg-[#f7fafc]/85 backdrop-blur-[2px]"
        aria-live="polite"
        aria-busy="true"
        aria-label="Самбар ачааллаж байна"
      >
        {body}
      </div>
    );
  }

  return body;
}
