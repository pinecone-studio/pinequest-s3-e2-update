/** @format */

"use client";

import { useEffect, useState } from "react";
import { HoneyCircularLoader } from "@/components/loaders/honey-circular-loader";

export default function SchoolLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const t = (now - start) / 1000;
      /** ~9.5s time constant — slower climb, loader feels active longer before leveling off. */
      const asymptote = 84 * (1 - Math.exp(-t / 9.5));
      setProgress(
        Math.min(88, asymptote + Math.sin(now / 1600) * 1.8),
      );
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative flex min-h-[min(800px,calc(100vh-4rem))] flex-1 flex-col items-center justify-center overflow-hidden py-16">
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
            label="Самбар ачааллаж байна…"
            labelClassName="text-base font-semibold text-slate-700 sm:text-lg"
            className="mx-auto min-h-0 max-w-[min(280px,82vw)] justify-center gap-5 sm:gap-7"
          />
        </div>
      </div>
    </div>
  );
}
