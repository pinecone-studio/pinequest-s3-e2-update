import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<
  {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60";
  const sizeClass = size === "sm" ? "h-9 px-3" : size === "lg" ? "h-12 px-5" : "h-10 px-4";

  const variantClass =
    variant === "primary"
      ? "bg-primary text-white hover:bg-[#3f8bff]"
      : variant === "secondary"
        ? "border border-[#d9e6fb] bg-white text-[#1f2a44] hover:bg-[#f7fbff]"
        : variant === "danger"
          ? "border border-[#ff6b6b]/50 bg-[#ff6b6b]/10 text-[#b64747] hover:bg-[#ff6b6b]/20"
          : "text-[#2f73c4] hover:bg-[#eef6ff]";

  return (
    <button
      className={`${base} ${sizeClass} ${variantClass} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" /> : null}
      {children}
    </button>
  );
}

