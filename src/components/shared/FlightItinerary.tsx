import { Badge } from "@/components/ui/Badge";
import { getAirportLabel } from "@/lib/constants/airports";
import type { Flight } from "@/lib/types/flight";
import { formatDuration, formatStops } from "@/lib/utils/flight-utils";
import { cn } from "@/lib/utils/cn";

interface FlightItineraryProps {
  flight: Flight;
  className?: string;
  size?: "sm" | "md";
}

const airlineMonogram: Record<string, string> = {
  Delta: "D",
  United: "U",
  American: "A",
  Southwest: "S",
  JetBlue: "J",
  Alaska: "K",
  Spirit: "S",
  Frontier: "F",
};

export function FlightItinerary({ flight, className, size = "md" }: FlightItineraryProps) {
  const mono = airlineMonogram[flight.airline] ?? flight.airline.charAt(0);
  const isSm = size === "sm";

  return (
    <div className={cn("flex gap-4", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-[var(--color-ink)] font-semibold text-white",
          isSm ? "h-10 w-10 text-sm" : "h-11 w-11 text-sm",
        )}
        aria-hidden="true"
      >
        {mono}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={cn("font-semibold text-[var(--color-ink)]", isSm ? "text-sm" : "text-[15px]")}>
            {flight.airline}
          </span>
          <span className="text-xs text-[var(--color-ink-faint)]">{flight.flightNumber}</span>
          <Badge variant={flight.stops === 0 ? "success" : "warning"}>{formatStops(flight.stops)}</Badge>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="shrink-0">
            <p className={cn("font-semibold tabular-nums tracking-tight text-[var(--color-ink)]", isSm ? "text-lg" : "text-xl")}>
              {flight.departureTime}
            </p>
            <p className="mt-0.5 text-xs font-medium text-[var(--color-ink-muted)]">{flight.origin}</p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center px-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
              {formatDuration(flight.durationMinutes)}
            </span>
            <div className="mt-1.5 flex w-full max-w-[120px] items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-line-strong)]" />
              <span className="mx-1 h-px flex-1 bg-[var(--color-line)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className={cn("font-semibold tabular-nums tracking-tight text-[var(--color-ink)]", isSm ? "text-lg" : "text-xl")}>
              {flight.arrivalTime}
            </p>
            <p className="mt-0.5 text-xs font-medium text-[var(--color-ink-muted)]">{flight.destination}</p>
          </div>
        </div>

        {!isSm && (
          <p className="mt-2 text-xs text-[var(--color-ink-faint)]">
            {getAirportLabel(flight.origin)} → {getAirportLabel(flight.destination)} · {flight.date}
          </p>
        )}
      </div>
    </div>
  );
}
