"use client";

import { cn } from "@/lib/utils/cn";
import { focusRing, interactiveControl } from "@/lib/utils/interactive-styles";
import type { SortField, SortOrder } from "@/lib/types/flight";

interface SortControlsProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void;
}

const sortOptions: Array<{ value: SortField; label: string }> = [
  { value: "price", label: "Price" },
  { value: "duration", label: "Duration" },
  { value: "departureTime", label: "Departure" },
];

export function SortControls({ sortBy, sortOrder, onSortChange }: SortControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-slate-600">Sort by:</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Sort results">
        {sortOptions.map((option) => {
          const isActive = sortBy === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (isActive) {
                  onSortChange(option.value, sortOrder === "asc" ? "desc" : "asc");
                } else {
                  onSortChange(option.value, "asc");
                }
              }}
              className={cn(
                "min-h-11 rounded-lg px-3 py-2 text-sm font-medium",
                interactiveControl,
                focusRing,
                isActive
                  ? "bg-sky-100 text-sky-800 hover:bg-sky-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
              aria-pressed={isActive}
            >
              {option.label}
              {isActive && (
                <>
                  <span className="ml-1" aria-hidden="true">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                  <span className="sr-only">
                    {sortOrder === "asc" ? ", ascending" : ", descending"}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
