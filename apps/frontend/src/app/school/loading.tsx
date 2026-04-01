"use client";

import { BeehiveNectarLoader } from "@/components/loaders/beehive-nectar-loader";

export default function SchoolLoading() {
  return (
    <div className="flex min-h-[min(800px,calc(100vh-4rem))] flex-1 flex-col items-center justify-center py-20">
      <BeehiveNectarLoader
        progress={0}
        label="Самбар ачааллаж байна…"
        orbitMaxPx={148}
        tripDurationMs={4000}
        className="min-h-0 justify-center gap-6"
      />
    </div>
  );
}
