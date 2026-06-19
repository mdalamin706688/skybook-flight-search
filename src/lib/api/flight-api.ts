import type { FlightSearchParams } from "@/lib/types/flight";

export interface FlightSearchOptions {
  simulateError?: boolean;
}

export async function fetchFlights(
  params: FlightSearchParams,
  options?: FlightSearchOptions,
): Promise<{
  flights: import("@/lib/types/flight").Flight[];
  count: number;
  availableRoutes?: Array<{ origin: string; destination: string; count: number }>;
}> {
  const searchParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    date: params.date,
  });

  if (options?.simulateError) {
    searchParams.set("simulateError", "true");
  }

  const response = await fetch(`/api/flights?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? "Failed to fetch flights");
  }

  return response.json();
}

export async function fetchFlightById(id: string) {
  const response = await fetch(`/api/flights?id=${id}`);

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
  const response = await fetch("/api/bookings", {
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
