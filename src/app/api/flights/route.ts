import { NextRequest, NextResponse } from "next/server";
import { searchFlights, getFlightById, getAvailableRoutes } from "@/lib/data/flights-repository";

const SIMULATED_DELAY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const id = searchParams.get("id");
  const simulateError = searchParams.get("simulateError") === "true";

  await delay(SIMULATED_DELAY_MS);

  if (simulateError) {
    return NextResponse.json(
      { error: "Unable to fetch flights. Please try again." },
      { status: 503 },
    );
  }

  if (id) {
    const flight = getFlightById(id);
    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }
    return NextResponse.json({ flight });
  }

  if (!origin || !destination || !date) {
    return NextResponse.json(
      { error: "Missing required parameters: origin, destination, date" },
      { status: 400 },
    );
  }

  const flights = searchFlights(origin, destination, date);
  const availableRoutes =
    flights.length === 0 ? getAvailableRoutes(date) : undefined;

  return NextResponse.json({ flights, count: flights.length, availableRoutes });
}
