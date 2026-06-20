import { isStaticExport, withBasePath } from "@/lib/constants/site";
import {
  staticCreateBooking,
  staticFetchFlightById,
  staticFetchFlights,
} from "@/lib/api/static-flight-api";
import type { FlightSearchParams } from "@/lib/types/flight";

export interface FlightSearchOptions {
  simulateError?: boolean;
}

export async function fetchFlights(
  params: FlightSearchParams,
  options?: FlightSearchOptions,
) {
  if (isStaticExport) {
    return staticFetchFlights(params, options);
  }

  const searchParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    date: params.date,
  });

  if (options?.simulateError) {
    searchParams.set("simulateError", "true");
  }

  const response = await fetch(withBasePath(`/api/flights?${searchParams.toString()}`));

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? "Failed to fetch flights");
  }

  return response.json();
}

export async function fetchFlightById(id: string) {
  if (isStaticExport) {
    return staticFetchFlightById(id);
  }

  const response = await fetch(withBasePath(`/api/flights?id=${id}`));

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? "Failed to fetch flight");
  }

  return response.json();
}

export async function createBooking(
  flightId: string,
  passengers: number,
  passengerDetails: import("@/lib/validation/schemas").BookingFormValues,
): Promise<{ booking: import("@/lib/types/booking").BookingConfirmation }> {
  if (isStaticExport) {
    return staticCreateBooking(flightId, passengers, passengerDetails);
  }

  const response = await fetch(withBasePath("/api/bookings"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flightId, passengers, passengerDetails }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? "Failed to create booking");
  }

  return response.json();
}
