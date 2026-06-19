import { readFileSync } from "fs";
import { join } from "path";
import type { Flight } from "@/lib/types/flight";

let cachedFlights: Flight[] | null = null;

export function getFlights(): Flight[] {
  if (process.env.NODE_ENV === "production" && cachedFlights) {
    return cachedFlights;
  }

  const filePath = join(process.cwd(), "data", "flights.json");
  const raw = readFileSync(filePath, "utf-8");
  const flights = JSON.parse(raw) as Flight[];

  if (process.env.NODE_ENV === "production") {
    cachedFlights = flights;
  }

  return flights;
}

export function getFlightById(id: string): Flight | undefined {
  return getFlights().find((flight) => flight.id === id);
}

export function searchFlights(
  origin: string,
  destination: string,
  date: string,
): Flight[] {
  return getFlights().filter(
    (flight) =>
      flight.origin === origin &&
      flight.destination === destination &&
      flight.date === date,
  );
}

export interface AvailableRoute {
  origin: string;
  destination: string;
  count: number;
}

export function getAvailableRoutes(date: string): AvailableRoute[] {
  const routeCounts = new Map<string, AvailableRoute>();

  for (const flight of getFlights()) {
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
