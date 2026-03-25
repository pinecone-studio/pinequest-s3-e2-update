import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "social";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function AuthButton({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: Props) {
  const base =
    "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-50";

  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50";

  return (
    <button type={type} className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
