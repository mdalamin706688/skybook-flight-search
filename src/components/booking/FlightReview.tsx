import { getAirportLabel } from "@/lib/constants/airports";
import type { Flight } from "@/lib/types/flight";
import { formatPrice } from "@/lib/utils/flight-utils";
import { panel } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";
import { FlightItinerary } from "@/components/shared/FlightItinerary";

interface FlightReviewProps {
  flight: Flight;
  passengers: number;
}

export function FlightReview({ flight, passengers }: FlightReviewProps) {
  const total = flight.price * passengers;

  return (
    <section className={cn(panel, "flex h-full flex-col overflow-hidden")}>
      <div className="border-b border-[var(--color-line)] bg-[var(--color-paper)] px-5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
          Trip summary
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <FlightItinerary flight={flight} />

        <dl className="mt-6 space-y-3 border-t border-dashed border-[var(--color-line)] pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--color-ink-muted)]">Route</dt>
            <dd className="text-right font-medium text-[var(--color-ink)]">
              {getAirportLabel(flight.origin)} → {getAirportLabel(flight.destination)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--color-ink-muted)]">Fare × {passengers}</dt>
            <dd className="tabular-nums text-[var(--color-ink)]">{formatPrice(flight.price)} × {passengers}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-[var(--color-line)] pt-3">
            <dt className="font-semibold text-[var(--color-ink)]">Total</dt>
            <dd className="text-lg font-semibold tabular-nums text-[var(--color-ink)]">{formatPrice(total)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
