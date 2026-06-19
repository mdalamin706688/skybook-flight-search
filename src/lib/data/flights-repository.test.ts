import { describe, expect, it } from "vitest";
import { AIRPORTS } from "@/lib/constants/airports";
import {
  getAvailableRoutes,
  getFlightById,
  searchFlights,
} from "@/lib/data/flights-repository";

const DATE = "2026-07-15";
const FLIGHTS_PER_ROUTE = 32;

describe("flights-repository", () => {
  it("returns 32 flights for every airport pair", () => {
    for (const origin of AIRPORTS) {
      for (const destination of AIRPORTS) {
        if (origin.code === destination.code) continue;

        const flights = searchFlights(origin.code, destination.code, DATE);
        expect(flights.length).toBe(FLIGHTS_PER_ROUTE);
      }
    }
  });

  it("returns flights with all required fields", () => {
    const flights = searchFlights("JFK", "LAX", DATE);
    const flight = flights[0];

    expect(flight).toMatchObject({
      id: expect.any(String),
      airline: expect.any(String),
      flightNumber: expect.any(String),
      origin: "JFK",
      destination: "LAX",
      departureTime: expect.any(String),
      arrivalTime: expect.any(String),
      durationMinutes: expect.any(Number),
      stops: expect.any(Number),
      price: expect.any(Number),
      date: DATE,
    });
  });

  it("includes multiple airlines on each route", () => {
    const flights = searchFlights("SFO", "LAX", DATE);
    const airlines = new Set(flights.map((f) => f.airline));
    expect(airlines.size).toBeGreaterThanOrEqual(5);
  });

  it("finds a flight by id", () => {
    const flight = getFlightById("flt-001");
    expect(flight).toBeDefined();
    expect(flight?.id).toBe("flt-001");
  });

  it("returns all airport pairs as available routes", () => {
    const routes = getAvailableRoutes(DATE);
    const expectedPairs = AIRPORTS.length * (AIRPORTS.length - 1);
    expect(routes).toHaveLength(expectedPairs);
    expect(routes.every((route) => route.count === FLIGHTS_PER_ROUTE)).toBe(true);
  });

  it("returns undefined for unknown flight id", () => {
    expect(getFlightById("unknown")).toBeUndefined();
  });
});
