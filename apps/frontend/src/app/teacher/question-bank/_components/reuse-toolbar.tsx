"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXAM_DESTINATIONS } from "../_lib/constants";

type ReuseToolbarProps = {
  selectedCount: number;
  onSelectAllVisible: () => void;
  onReuseSelected: () => void;
  reuseTarget: string;
  onReuseTargetChange: (value: (typeof EXAM_DESTINATIONS)[number]) => void;
};

export function ReuseToolbar({
  selectedCount,
  onSelectAllVisible,
  onReuseSelected,
  reuseTarget,
  onReuseTargetChange,
}: ReuseToolbarProps) {
  return (
    <section className="rounded-[24px] border border-[#d8e2f0] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="mt-1 text-lg font-semibold text-[#183153]">
            {selectedCount === 0
              ? "Шалгалтын багц үүсгэхийн тулд асуултаа сонгоно уу"
              : `${selectedCount} асуулт сонгогдсон`}
          </h2>
          <p className="text-sm text-[#6d7f9c]">
            Асуултыг шалгалтын урсгалд нэмэхдээ хичээл, түвшин, үнэлгээний
            мэдээллийг хэвээр хадгална.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#d7e2f1] px-4 text-sm font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
            onClick={onSelectAllVisible}
            type="button"
          >
            Харагдаж буйг сонгох
          </button>
          <div className="min-w-56">
            <Select
              onValueChange={(value) =>
                onReuseTargetChange(value as (typeof EXAM_DESTINATIONS)[number])
              }
              value={reuseTarget}
            >
              <SelectTrigger className="h-11 rounded-2xl border-[#d3deef]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXAM_DESTINATIONS.map((destination) => (
                  <SelectItem key={destination} value={destination}>
                    {destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#163b69] px-4 text-sm font-semibold text-white transition hover:bg-[#122f55]"
            onClick={onReuseSelected}
            type="button"
          >
            Шалгалт руу нэмэх
          </button>
        </div>
      </div>
    </section>
  );
}
