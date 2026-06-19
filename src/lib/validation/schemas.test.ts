import { describe, expect, it } from "vitest";
import {
  bookingFormSchema,
  bookingRequestSchema,
  parsePassengersFromUrl,
  parseSearchParamsFromUrl,
  searchFormSchema,
} from "@/lib/validation/schemas";

describe("searchFormSchema", () => {
  it("validates a correct search form", () => {
    const result = searchFormSchema.safeParse({
      origin: "JFK",
      destination: "LAX",
      date: "2026-07-15",
      passengers: 2,
    });
    expect(result.success).toBe(true);
  });

  it("rejects same origin and destination", () => {
    const result = searchFormSchema.safeParse({
      origin: "JFK",
      destination: "JFK",
      date: "2026-07-15",
      passengers: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid passenger count", () => {
    const result = searchFormSchema.safeParse({
      origin: "JFK",
      destination: "LAX",
      date: "2026-07-15",
      passengers: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 9 passengers", () => {
    const result = searchFormSchema.safeParse({
      origin: "JFK",
      destination: "LAX",
      date: "2026-07-15",
      passengers: 10,
    });
    expect(result.success).toBe(false);
  });
});

describe("bookingFormSchema", () => {
  it("validates correct passenger details", () => {
    const result = bookingFormSchema.safeParse({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "+1 555-123-4567",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = bookingFormSchema.safeParse({
      firstName: "Jane",
      lastName: "Doe",
      email: "not-an-email",
      phone: "5551234567",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty required fields", () => {
    const result = bookingFormSchema.safeParse({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("bookingRequestSchema", () => {
  it("validates a complete booking request", () => {
    const result = bookingRequestSchema.safeParse({
      flightId: "flt-001",
      passengers: 2,
      passengerDetails: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "555-123-4567",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid passenger count in booking request", () => {
    const result = bookingRequestSchema.safeParse({
      flightId: "flt-001",
      passengers: 0,
      passengerDetails: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "555-123-4567",
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("parseSearchParamsFromUrl", () => {
  it("parses valid search params", () => {
    const params = new URLSearchParams(
      "origin=JFK&destination=LAX&date=2026-07-15&passengers=2",
    );
    const result = parseSearchParamsFromUrl(params);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.params).toEqual({
        origin: "JFK",
        destination: "LAX",
        date: "2026-07-15",
        passengers: 2,
      });
      expect(result.data.simulateError).toBe(false);
    }
  });

  it("detects simulateError flag", () => {
    const params = new URLSearchParams(
      "origin=JFK&destination=LAX&date=2026-07-15&passengers=1&simulateError=true",
    );
    const result = parseSearchParamsFromUrl(params);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.simulateError).toBe(true);
    }
  });

  it("rejects missing required params", () => {
    const params = new URLSearchParams("origin=JFK");
    const result = parseSearchParamsFromUrl(params);
    expect(result.success).toBe(false);
  });

  it("rejects invalid passengers in URL", () => {
    const params = new URLSearchParams(
      "origin=JFK&destination=LAX&date=2026-07-15&passengers=abc",
    );
    const result = parseSearchParamsFromUrl(params);
    expect(result.success).toBe(false);
  });
});

describe("parsePassengersFromUrl", () => {
  it("defaults to 1 passenger", () => {
    const params = new URLSearchParams("");
    const result = parsePassengersFromUrl(params);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.passengers).toBe(1);
    }
  });

  it("rejects invalid passenger values", () => {
    const params = new URLSearchParams("passengers=0");
    const result = parsePassengersFromUrl(params);
    expect(result.success).toBe(false);
  });
});
