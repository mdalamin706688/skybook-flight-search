"use client";

import { useRouter } from "next/navigation";
import { FlightItinerary } from "@/components/shared/FlightItinerary";
import type { Flight } from "@/lib/types/flight";
import { formatPrice } from "@/lib/utils/flight-utils";
import { rowHover } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";
import { focusRing } from "@/lib/utils/interactive-styles";
import { useBookingStore } from "@/store/booking-store";

interface FlightCardProps {
  flight: Flight;
  passengers: number;
  isLast?: boolean;
}

export function FlightCard({ flight, passengers, isLast }: FlightCardProps) {
  const router = useRouter();
  const selectFlight = useBookingStore((s) => s.selectFlight);
  const total = flight.price * passengers;

  function handleSelect() {
    selectFlight(flight);
    router.push(`/booking?flightId=${flight.id}&passengers=${passengers}`);
  }

  const label = `Select ${flight.airline} ${flight.flightNumber}, ${formatPrice(total)}`;

  return (
    <button
      type="button"
      onClick={handleSelect}
      aria-label={label}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-6 px-5 py-5 text-left transition-colors",
        rowHover,
        focusRing,
        !isLast && "border-b border-[var(--color-line)]",
      )}
    >
      <div className="min-w-0 flex-1">
        <FlightItinerary flight={flight} size="sm" />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-5">
        <div className="text-right">
          <p className="text-xl font-semibold tabular-nums tracking-tight text-[var(--color-ink)]">
            {formatPrice(total)}
          </p>
          <p className="text-[11px] text-[var(--color-ink-faint)]">
            {passengers > 1 ? `${formatPrice(flight.price)} each` : "per traveler"}
          </p>
        </div>
        <span className="inline-flex h-9 items-center rounded-lg bg-[var(--color-ink)] px-4 text-xs font-semibold text-white transition-colors group-hover:bg-[#1a2332]">
          Select
        </span>
      </div>
    </button>
  );
}
