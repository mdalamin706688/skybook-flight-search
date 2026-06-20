import { readFileSync } from "fs";
import { join } from "path";
import type { Flight } from "@/lib/types/flight";
import {
  computeAvailableRoutes,
  filterFlightsByRoute,
  findFlightById,
} from "@/lib/data/flights-logic";

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
  return findFlightById(getFlights(), id);
}

export function searchFlights(
  origin: string,
  destination: string,
  date: string,
): Flight[] {
  return filterFlightsByRoute(getFlights(), origin, destination, date);
}

export interface AvailableRoute {
  origin: string;
  destination: string;
  count: number;
}

export function getAvailableRoutes(date: string): AvailableRoute[] {
  return computeAvailableRoutes(getFlights(), date);
}
