import type { Flight } from "@/lib/types/flight";
import type { AvailableRoute } from "@/lib/data/flights-repository";

export function findFlightById(flights: Flight[], id: string): Flight | undefined {
  return flights.find((flight) => flight.id === id);
}

export function filterFlightsByRoute(
  flights: Flight[],
  origin: string,
  destination: string,
  date: string,
): Flight[] {
  return flights.filter(
    (flight) =>
      flight.origin === origin &&
      flight.destination === destination &&
      flight.date === date,
  );
}

export function computeAvailableRoutes(flights: Flight[], date: string): AvailableRoute[] {
  const routeCounts = new Map<string, AvailableRoute>();

  for (const flight of flights) {
    if (flight.date !== date) continue;

    const key = `${flight.origin}-${flight.destination}`;
    const existing = routeCounts.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      routeCounts.set(key, {
        origin: flight.origin,
        destination: flight.destination,
        count: 1,
      });
    }
  }

  return [...routeCounts.values()].sort((a, b) => b.count - a.count);
}
