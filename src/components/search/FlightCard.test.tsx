import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FlightCard } from "@/components/search/FlightCard";
import type { Flight } from "@/lib/types/flight";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/store/booking-store", () => ({
  useBookingStore: (selector: (state: { selectFlight: () => void }) => unknown) =>
    selector({ selectFlight: vi.fn() }),
}));

afterEach(() => {
  cleanup();
});

const mockFlight: Flight = {
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
};

describe("FlightCard", () => {
  it("renders flight information", () => {
    render(<FlightCard flight={mockFlight} passengers={1} />);

    expect(screen.getByText("Delta")).toBeInTheDocument();
    expect(screen.getByText("DL 401")).toBeInTheDocument();
    expect(screen.getByText("Nonstop")).toBeInTheDocument();
    expect(screen.getByText("06:15")).toBeInTheDocument();
    expect(screen.getByText("09:30")).toBeInTheDocument();
    expect(screen.getByText("$289")).toBeInTheDocument();
  });

  it("shows total price for multiple passengers", () => {
    render(<FlightCard flight={mockFlight} passengers={2} />);
    expect(screen.getByText("$578")).toBeInTheDocument();
  });

  it("has a select button", async () => {
    render(<FlightCard flight={mockFlight} passengers={1} />);
    const button = screen.getByRole("button", {
      name: /select delta flight dl 401/i,
    });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
  });
});
