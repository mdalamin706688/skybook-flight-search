import { NextRequest, NextResponse } from "next/server";
import { getFlightById } from "@/lib/data/flights-repository";
import { bookingRequestSchema } from "@/lib/validation/schemas";
import type { BookingConfirmation } from "@/lib/types/booking";

const SIMULATED_DELAY_MS = 800;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateBookingId(): string {
  return `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  await delay(SIMULATED_DELAY_MS);

  try {
    const body = await request.json();
    const validation = bookingRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.issues[0]?.message ?? "Invalid booking request",
          details: validation.error.flatten(),
        },
        { status: 422 },
      );
    }

    const { flightId, passengers, passengerDetails } = validation.data;

    const flight = getFlightById(flightId);
    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }

    const confirmation: BookingConfirmation = {
      bookingId: generateBookingId(),
      flight,
      passengers,
      passengerDetails,
      totalPrice: flight.price * passengers,
      bookedAt: new Date().toISOString(),
    };

    return NextResponse.json({ booking: confirmation }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 },
    );
  }
}
