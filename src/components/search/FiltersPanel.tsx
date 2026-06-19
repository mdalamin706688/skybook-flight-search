"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { focusRing, interactiveControl } from "@/lib/utils/interactive-styles";
import type { FlightFilters } from "@/lib/types/flight";
import { getPriceRange, getUniqueAirlines } from "@/lib/utils/flight-utils";
import type { Flight } from "@/lib/types/flight";

interface FiltersPanelProps {
  flights: Flight[];
  filters: FlightFilters;
  onFiltersChange: (filters: FlightFilters) => void;
}

function countActiveFilters(filters: FlightFilters): number {
  let count = 0;
  if (filters.maxPrice !== undefined) count += 1;
  if (filters.maxStops !== undefined) count += 1;
  if (filters.airlines && filters.airlines.length > 0) count += 1;
  return count;
}

export function FiltersPanel({ flights, filters, onFiltersChange }: FiltersPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const airlines = getUniqueAirlines(flights);
  const { min, max } = getPriceRange(flights);
  const activeCount = countActiveFilters(filters);
  const currentMaxPrice = filters.maxPrice ?? max;

  function toggleAirline(airline: string) {
    const current = filters.airlines ?? [];
    const updated = current.includes(airline)
      ? current.filter((a) => a !== airline)
      : [...current, airline];
    onFiltersChange({ ...filters, airlines: updated.length > 0 ? updated : undefined });
  }

  const panelContent = (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="max-price" className="text-sm font-medium text-slate-700">
          Max price: ${currentMaxPrice}
        </label>
        <input
          id="max-price"
          type="range"
          min={min}
          max={max}
          step={10}
          value={currentMaxPrice}
          onChange={(e) =>
            onFiltersChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full cursor-pointer accent-sky-600"
          aria-label="Maximum price filter"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentMaxPrice}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>${min}</span>
          <span>${max}</span>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">Stops</legend>
        <div className="flex flex-col gap-2">
          {[
            { value: undefined, label: "Any" },
            { value: 0, label: "Nonstop only" },
            { value: 1, label: "1 stop max" },
          ].map((option) => (
            <label
              key={String(option.value)}
              className={cn("flex cursor-pointer items-center gap-2 text-sm", interactiveControl)}
            >
              <input
                type="radio"
                name="stops"
                checked={filters.maxStops === option.value}
                onChange={() =>
                  onFiltersChange({ ...filters, maxStops: option.value })
                }
                className="cursor-pointer accent-sky-600"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">Airlines</legend>
        <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
          {airlines.map((airline) => (
            <label
              key={airline}
              className={cn("flex cursor-pointer items-center gap-2 text-sm", interactiveControl)}
            >
              <input
                type="checkbox"
                checked={filters.airlines?.includes(airline) ?? false}
                onChange={() => toggleAirline(airline)}
                className="cursor-pointer accent-sky-600"
              />
              {airline}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={() => onFiltersChange({})}
        className={cn(
          "cursor-pointer text-sm text-sky-600 hover:text-sky-800 hover:underline",
          focusRing,
          "rounded px-1 py-0.5",
        )}
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <aside className="space-y-3">
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm lg:hidden",
          interactiveControl,
          focusRing,
        )}
        aria-expanded={mobileOpen}
        aria-controls="filters-panel-content"
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span>Filters{activeCount > 0 ? ` (${activeCount} active)` : ""}</span>
        <span aria-hidden="true">{mobileOpen ? "−" : "+"}</span>
      </button>

      <div
        id="filters-panel-content"
        className={cn(
          "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
          mobileOpen ? "block" : "hidden lg:block",
        )}
      >
        <h2 className="mb-6 hidden text-sm font-semibold uppercase tracking-wide text-slate-500 lg:block">
          Filters
        </h2>
        {panelContent}
      </div>
    </aside>
  );
}
