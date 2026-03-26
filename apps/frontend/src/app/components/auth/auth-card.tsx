import type { ReactNode } from "react";

export function AuthCard({ subtitle, children }: { subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {subtitle ? (
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-wide text-gray-400">
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
