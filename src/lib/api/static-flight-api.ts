import {
  getAvailableRoutesClient,
  getFlightByIdClient,
  searchFlightsClient,
} from "@/lib/data/flights-client-repository";
import type { FlightSearchParams } from "@/lib/types/flight";
import type { BookingConfirmation } from "@/lib/types/booking";
import { bookingRequestSchema, type BookingFormValues } from "@/lib/validation/schemas";

const SEARCH_DELAY_MS = 600;
const BOOKING_DELAY_MS = 800;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateBookingId(): string {
  return `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function staticFetchFlights(
  params: FlightSearchParams,
  options?: { simulateError?: boolean },
) {
  await delay(SEARCH_DELAY_MS);

  if (options?.simulateError) {
    throw new Error("Unable to fetch flights. Please try again.");
  }

  const flights = await searchFlightsClient(params.origin, params.destination, params.date);
  const availableRoutes =
    flights.length === 0
      ? await getAvailableRoutesClient(params.date)
      : undefined;

  return { flights, count: flights.length, availableRoutes };
}

export async function staticFetchFlightById(id: string) {
  await delay(SEARCH_DELAY_MS);
  const flight = await getFlightByIdClient(id);

  if (!flight) {
    throw new Error("Flight not found");
  }

  return { flight };
}

export async function staticCreateBooking(
  flightId: string,
  passengers: number,
  passengerDetails: BookingFormValues,
): Promise<{ booking: BookingConfirmation }> {
  await delay(BOOKING_DELAY_MS);

  const validation = bookingRequestSchema.safeParse({ flightId, passengers, passengerDetails });
  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message ?? "Invalid booking request");
  }

  const flight = await getFlightByIdClient(flightId);
  if (!flight) {
    throw new Error("Flight not found");
  }

  return {
    booking: {
      bookingId: generateBookingId(),
      flight,
      passengers,
      passengerDetails,
      totalPrice: flight.price * passengers,
      bookedAt: new Date().toISOString(),
    },
  };
}
