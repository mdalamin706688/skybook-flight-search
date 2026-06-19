import type {
  Flight,
  FlightFilters,
  SortField,
  SortOrder,
} from "@/lib/types/flight";

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatStops(stops: number): string {
  if (stops === 0) return "Nonstop";
  if (stops === 1) return "1 stop";
  return `${stops} stops`;
}

export function filterFlights(flights: Flight[], filters: FlightFilters): Flight[] {
  return flights.filter((flight) => {
    if (filters.maxPrice !== undefined && flight.price > filters.maxPrice) {
      return false;
    }
    if (filters.maxStops !== undefined && flight.stops > filters.maxStops) {
      return false;
    }
    if (
      filters.airlines &&
      filters.airlines.length > 0 &&
      !filters.airlines.includes(flight.airline)
    ) {
      return false;
    }
    return true;
  });
}

export function sortFlights(
  flights: Flight[],
  sortBy: SortField,
  sortOrder: SortOrder,
): Flight[] {
  const sorted = [...flights].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "price":
        comparison = a.price - b.price;
        break;
      case "duration":
        comparison = a.durationMinutes - b.durationMinutes;
        break;
      case "departureTime":
        comparison = a.departureTime.localeCompare(b.departureTime);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
}

export function getUniqueAirlines(flights: Flight[]): string[] {
  return [...new Set(flights.map((f) => f.airline))].sort();
}

export function getPriceRange(flights: Flight[]): { min: number; max: number } {
  if (flights.length === 0) return { min: 0, max: 0 };
  const prices = flights.map((f) => f.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
