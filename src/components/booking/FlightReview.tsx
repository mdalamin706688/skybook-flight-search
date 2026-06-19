import { Badge } from "@/components/ui/Badge";
import { getAirportLabel } from "@/lib/constants/airports";
import type { Flight } from "@/lib/types/flight";
import {
  formatDuration,
  formatPrice,
  formatStops,
} from "@/lib/utils/flight-utils";

interface FlightReviewProps {
  flight: Flight;
  passengers: number;
}

export function FlightReview({ flight, passengers }: FlightReviewProps) {
  const totalPrice = flight.price * passengers;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Flight details</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">{flight.airline}</span>
          <span className="text-slate-500">{flight.flightNumber}</span>
          <Badge variant={flight.stops === 0 ? "success" : "warning"}>
            {formatStops(flight.stops)}
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Departure</p>
            <p className="text-lg font-semibold">{flight.departureTime}</p>
            <p className="text-sm text-slate-600">{getAirportLabel(flight.origin)}</p>
            <p className="text-xs text-slate-400">{flight.date}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-slate-500">{formatDuration(flight.durationMinutes)}</p>
            <div className="my-2 h-px w-full max-w-[120px] bg-slate-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Arrival</p>
            <p className="text-lg font-semibold">{flight.arrivalTime}</p>
            <p className="text-sm text-slate-600">{getAirportLabel(flight.destination)}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">
              {passengers} passenger{passengers > 1 ? "s" : ""} × {formatPrice(flight.price)}
            </span>
            <span className="text-lg font-bold text-slate-900">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
