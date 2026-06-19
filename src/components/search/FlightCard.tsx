"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { getAirportLabel } from "@/lib/constants/airports";
import type { Flight } from "@/lib/types/flight";
import {
  formatDuration,
  formatPrice,
  formatStops,
} from "@/lib/utils/flight-utils";
import { cn } from "@/lib/utils/cn";
import { focusRing, interactiveControl } from "@/lib/utils/interactive-styles";
import { useBookingStore } from "@/store/booking-store";

interface FlightCardProps {
  flight: Flight;
  passengers: number;
}

export function FlightCard({ flight, passengers }: FlightCardProps) {
  const router = useRouter();
  const selectFlight = useBookingStore((s) => s.selectFlight);

  function handleSelect() {
    selectFlight(flight);
    router.push(`/booking/${flight.id}?passengers=${passengers}`);
  }

  const label = `Select ${flight.airline} flight ${flight.flightNumber} from ${getAirportLabel(flight.origin)} to ${getAirportLabel(flight.destination)} for ${formatPrice(flight.price * passengers)}`;

  return (
    <button
      type="button"
      onClick={handleSelect}
      aria-label={label}
      className={cn(
        "group w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm",
        interactiveControl,
        focusRing,
        "hover:border-sky-200 hover:shadow-md",
      )}
    >
      <article className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{flight.airline}</span>
            <span className="text-sm text-slate-500">{flight.flightNumber}</span>
            <Badge variant={flight.stops === 0 ? "success" : "warning"}>
              {formatStops(flight.stops)}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">{flight.departureTime}</p>
              <p className="text-xs text-slate-500">{getAirportLabel(flight.origin)}</p>
            </div>
            <div className="flex flex-1 flex-col items-center gap-1">
              <p className="text-xs text-slate-400">{formatDuration(flight.durationMinutes)}</p>
              <div className="relative h-px w-full bg-slate-300">
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500 transition-transform group-hover:scale-125" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">{flight.arrivalTime}</p>
              <p className="text-xs text-slate-500">{getAirportLabel(flight.destination)}</p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 border-t border-slate-100 pt-4 sm:w-auto sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div className="text-left sm:text-right">
            <p className="text-2xl font-bold text-slate-900">
              {formatPrice(flight.price * passengers)}
            </p>
            <p className="text-xs text-slate-500">
              {passengers > 1
                ? `${formatPrice(flight.price)} × ${passengers} passengers`
                : "per passenger"}
            </p>
          </div>
          <span className="inline-flex min-h-10 items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-sky-700">
            Select flight
          </span>
        </div>
      </article>
    </button>
  );
}
