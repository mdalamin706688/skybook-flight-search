import { describe, expect, it } from "vitest";
import type { BookingConfirmation } from "@/lib/types/booking";
import { buildConfirmationReceiptHtml } from "@/lib/utils/confirmation-export";

const booking: BookingConfirmation = {
  bookingId: "SBK-12345",
  passengers: 1,
  totalPrice: 289,
  bookedAt: "2026-07-15T10:30:00.000Z",
  passengerDetails: {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "555-123-4567",
  },
  flight: {
    id: "flt-001",
    airline: "Delta",
    flightNumber: "DL 401",
    origin: "JFK",
    destination: "LAX",
    departureTime: "06:15",
    arrivalTime: "09:30",
    durationMinutes: 375,
    stops: 0,
    price: 289,
    date: "2026-07-15",
  },
};

describe("confirmation export", () => {
  it("builds printable html with booking details", () => {
    const html = buildConfirmationReceiptHtml(booking);

    expect(html).toContain("SBK-12345");
    expect(html).toContain("Jane Doe");
    expect(html).toContain("Delta");
    expect(html).toContain("JFK");
    expect(html).toContain("LAX");
    expect(html).toContain("$289");
  });

  it("escapes html in passenger input", () => {
    const html = buildConfirmationReceiptHtml({
      ...booking,
      passengerDetails: { ...booking.passengerDetails, firstName: "<script>" },
    });

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
