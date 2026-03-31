"use client";

import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const builderInputClassName =
  "h-12 w-full rounded-2xl border border-[#d3deef] bg-white px-4 text-[13px] text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10";

type BuilderFieldProps = {
  children: ReactNode;
  error?: string;
  label: string;
};

type BuilderSelectFieldProps = {
  disabled?: boolean;
  error?: string;
  label: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  value: string;
};

export function BuilderField({
  children,
  error,
  label,
}: BuilderFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-semibold text-[#183153]">{label}</span>
      {children}
      {error ? (
        <p className="text-[13px] font-medium text-[#d34f4f]">{error}</p>
      ) : null}
    </label>
  );
}

export function BuilderSelectField({
  disabled,
  error,
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: BuilderSelectFieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-[13px] font-semibold text-[#183153]">{label}</span>
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="h-12 rounded-2xl border-[#d3deef] focus:border-[#4f9dff] focus:ring-[#4f9dff]/10">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p className="text-[13px] font-medium text-[#d34f4f]">{error}</p>
      ) : null}
    </label>
  );
}
