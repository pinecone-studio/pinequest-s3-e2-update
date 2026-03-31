"use client";

import { useMemo } from "react";
import {
  listMockRegions,
  parseRegionKey,
  regionKey,
} from "@/app/lib/mock-mongolia-divisions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FieldErrors = {
  organizationRegion?: string;
  organizationSum?: string;
};

type Props = {
  organizationAimag: string;
  organizationHot: string;
  organizationSum: string;
  onAimagHotChange: (aimag: string, hot: string) => void;
  onSumChange: (value: string) => void;
  fieldErrors: FieldErrors;
  disabled?: boolean;
  /** Нэвтрэх/бүртгүүлэх дэлгэцтэй ижил өнцөг, өндөр, цэнхэр focus */
  compactAuth?: boolean;
};

type Option = string | { value: string; label: string };

function LabeledSelect({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled,
  error,
  compactAuth,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly Option[];
  disabled?: boolean;
  error?: string;
  compactAuth?: boolean;
}) {
  const triggerClass = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
    : undefined;
  const authTrigger =
    "h-14 rounded-[14px] border-gray-200 text-base shadow-sm data-[placeholder]:text-gray-400 " +
    "focus:border-[#29B6FF] focus:ring-2 focus:ring-[#29B6FF]/30 focus:ring-offset-0 focus:outline-none";

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className={
          compactAuth
            ? "block text-xs font-medium text-gray-600"
            : "block text-sm font-medium text-gray-900"
        }
      >
        {label}
      </label>
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={cn(
            compactAuth && authTrigger,
            triggerClass,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4}>
          {options.map((opt) =>
            typeof opt === "string" ? (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ) : (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function OrganizationDivisionSelects({
  organizationAimag,
  organizationHot,
  organizationSum,
  onAimagHotChange,
  onSumChange,
  fieldErrors,
  disabled,
  compactAuth,
}: Props) {
  const regions = useMemo(() => listMockRegions(), []);

  const regionOptions = useMemo(
    () => regions.map((r) => ({ value: r.key, label: r.label })),
    [regions],
  );

  const regionValue = useMemo(() => {
    if (!organizationAimag.trim() || !organizationHot.trim()) return "";
    return regionKey(organizationAimag, organizationHot);
  }, [organizationAimag, organizationHot]);

  const sumOptions = useMemo(() => {
    const row = regions.find((r) => r.key === regionValue);
    return row?.sums ?? [];
  }, [regions, regionValue]);

  return (
    <div
      className={
        compactAuth ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "grid gap-5 sm:grid-cols-2"
      }
    >
      <LabeledSelect
        id="signup-org-region"
        label="Аймаг / хот"
        placeholder="Сонгоно уу"
        value={regionValue}
        onChange={(key) => {
          const parsed = parseRegionKey(key);
          if (parsed) onAimagHotChange(parsed.aimag, parsed.hot);
        }}
        options={regionOptions}
        disabled={disabled}
        error={fieldErrors.organizationRegion}
        compactAuth={compactAuth}
      />
      <LabeledSelect
        id="signup-org-sum"
        label="Сум"
        placeholder={
          regionValue ? "Сонгоно уу" : "Эхлээд аймаг / хот сонгоно уу"
        }
        value={organizationSum}
        onChange={onSumChange}
        options={sumOptions}
        disabled={disabled || !regionValue}
        error={fieldErrors.organizationSum}
        compactAuth={compactAuth}
      />
    </div>
  );
}
