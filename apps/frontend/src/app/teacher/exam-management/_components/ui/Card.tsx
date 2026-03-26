import type { PropsWithChildren } from "react";

export function Card({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return <section className={`rounded-2xl border border-[#d9e6fb] bg-white shadow-sm ${className}`}>{children}</section>;
}

export function CardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-extrabold text-[#1f2a44]">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-[#5c6f91]">{subtitle}</p> : null}
    </div>
  );
}

