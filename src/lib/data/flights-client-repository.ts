import { withBasePath } from "@/lib/constants/site";
import type { Flight } from "@/lib/types/flight";
import {
  computeAvailableRoutes,
  filterFlightsByRoute,
  findFlightById,
} from "@/lib/data/flights-logic";

let cachedFlights: Flight[] | null = null;
let loadPromise: Promise<Flight[]> | null = null;

export async function loadFlights(): Promise<Flight[]> {
  if (cachedFlights) return cachedFlights;
  if (!loadPromise) {
    loadPromise = fetch(withBasePath("/data/flights.json"))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load flight data");
        }
        return response.json() as Promise<Flight[]>;
      })
      .then((flights) => {
        cachedFlights = flights;
        return flights;
      });
  }
  return loadPromise;
}

export async function getFlightByIdClient(id: string): Promise<Flight | undefined> {
  const flights = await loadFlights();
  return findFlightById(flights, id);
}

export async function searchFlightsClient(
  origin: string,
  destination: string,
  date: string,
) {
  const flights = await loadFlights();
  return filterFlightsByRoute(flights, origin, destination, date);
}

export async function getAvailableRoutesClient(date: string) {
  const flights = await loadFlights();
  return computeAvailableRoutes(flights, date);
}
