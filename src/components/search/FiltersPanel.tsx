"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { panel, panelInset } from "@/lib/utils/design-tokens";
import { focusRing } from "@/lib/utils/interactive-styles";
import type { FlightFilters } from "@/lib/types/flight";
import { getPriceRange, getUniqueAirlines } from "@/lib/utils/flight-utils";
import type { Flight } from "@/lib/types/flight";

interface FiltersPanelProps {
  flights: Flight[];
  filters: FlightFilters;
  onFiltersChange: (filters: FlightFilters) => void;
}

function countActive(filters: FlightFilters) {
  let n = 0;
  if (filters.maxPrice !== undefined) n++;
  if (filters.maxStops !== undefined) n++;
  if (filters.airlines?.length) n++;
  return n;
}

export function FiltersPanel({ flights, filters, onFiltersChange }: FiltersPanelProps) {
  const [open, setOpen] = useState(false);
  const airlines = getUniqueAirlines(flights);
  const { min, max } = getPriceRange(flights);
  const active = countActive(filters);
  const price = filters.maxPrice ?? max;

  function toggleAirline(name: string) {
    const cur = filters.airlines ?? [];
    const next = cur.includes(name) ? cur.filter((a) => a !== name) : [...cur, name];
    onFiltersChange({ ...filters, airlines: next.length ? next : undefined });
  }

  const body = (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-xs font-medium text-[var(--color-ink-muted)]">Max fare</span>
          <span className="text-sm font-semibold tabular-nums text-[var(--color-ink)]">${price}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={price}
          onChange={(e) => onFiltersChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="h-1 w-full cursor-pointer accent-[var(--color-ink)]"
          aria-label="Maximum fare"
        />
        <div className="mt-1 flex justify-between text-[10px] text-[var(--color-ink-faint)]">
          <span>${min}</span>
          <span>${max}</span>
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-medium text-[var(--color-ink-muted)]">Stops</legend>
        <div className="space-y-0.5">
          {[
            { v: undefined, l: "Any" },
            { v: 0, l: "Nonstop" },
            { v: 1, l: "1 stop max" },
          ].map((o) => (
            <label
              key={String(o.v)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm",
                filters.maxStops === o.v ? "bg-[var(--color-accent-soft)] font-medium text-[var(--color-accent)]" : "text-[var(--color-ink-muted)] hover:bg-[var(--color-paper)]",
              )}
            >
              <input type="radio" name="stops" checked={filters.maxStops === o.v} onChange={() => onFiltersChange({ ...filters, maxStops: o.v })} className="accent-[var(--color-accent)]" />
              {o.l}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-medium text-[var(--color-ink-muted)]">Airline</legend>
        <div className="max-h-36 space-y-0.5 overflow-y-auto">
          {airlines.map((name) => (
            <label
              key={name}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm",
                filters.airlines?.includes(name) ? "bg-[var(--color-accent-soft)] font-medium text-[var(--color-accent)]" : "text-[var(--color-ink-muted)] hover:bg-[var(--color-paper)]",
              )}
            >
              <input type="checkbox" checked={filters.airlines?.includes(name) ?? false} onChange={() => toggleAirline(name)} className="accent-[var(--color-accent)]" />
              {name}
            </label>
          ))}
        </div>
      </fieldset>

      {active > 0 && (
        <button type="button" onClick={() => onFiltersChange({})} className={cn("text-xs font-semibold text-[var(--color-accent)]", focusRing, "rounded px-1")}>
          Reset filters
        </button>
      )}
    </div>
  );

  return (
    <aside>
      <button
        type="button"
        className={cn(panelInset, "mb-3 flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium lg:hidden", focusRing)}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        Filters{active > 0 ? ` (${active})` : ""}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div className={cn(panel, "p-5", open ? "block" : "hidden lg:block")}>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">Refine</h2>
        {body}
      </div>
    </aside>
  );
}
