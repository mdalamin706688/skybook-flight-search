"use client";

import { cn } from "@/lib/utils/cn";
import { focusRing } from "@/lib/utils/interactive-styles";
import type { SortField, SortOrder } from "@/lib/types/flight";

interface SortControlsProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void;
}

const options: Array<{ value: SortField; label: string }> = [
  { value: "price", label: "Cheapest" },
  { value: "duration", label: "Fastest" },
  { value: "departureTime", label: "Departure" },
];

export function SortControls({ sortBy, sortOrder, onSortChange }: SortControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Sort by">
      {options.map((opt) => {
        const active = sortBy === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSortChange(opt.value, active && sortOrder === "asc" ? "desc" : "asc")}
            className={cn(
              "h-8 rounded-full px-3.5 text-xs font-semibold transition-colors",
              focusRing,
              active
                ? "bg-[var(--color-ink)] text-white"
                : "bg-[var(--color-paper)] text-[var(--color-ink-muted)] ring-1 ring-[var(--color-line)] hover:text-[var(--color-ink)]",
            )}
            aria-pressed={active}
          >
            {opt.label}
            {active && (
              <span className="ml-1 opacity-70" aria-hidden="true">
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
