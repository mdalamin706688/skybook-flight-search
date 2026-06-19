import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { SearchResults } from "@/components/search/SearchResults";
import type { Flight } from "@/lib/types/flight";

const mockRefetch = vi.fn();
const useFlightSearchMock = vi.fn();
const useSearchParamsMock = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => useSearchParamsMock(),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/hooks/useFlightSearch", () => ({
  useFlightSearch: (...args: unknown[]) => useFlightSearchMock(...args),
}));

vi.mock("@/store/booking-store", () => ({
  useBookingStore: (selector: (state: { selectFlight: () => void }) => unknown) =>
    selector({ selectFlight: vi.fn() }),
}));

vi.mock("@/components/search/SearchForm", () => ({
  SearchForm: () => <div data-testid="search-form" />,
}));

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const sampleFlight: Flight = {
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

function setSearchParams(query: string) {
  useSearchParamsMock.mockReturnValue(new URLSearchParams(query));
}

describe("SearchResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setSearchParams("origin=JFK&destination=LAX&date=2026-07-15&passengers=1");
  });

  it("shows loading state", () => {
    useFlightSearchMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<SearchResults />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/loading flights/i)).toBeInTheDocument();
  });

  it("shows error state with retry", async () => {
    useFlightSearchMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Unable to fetch flights"),
      refetch: mockRefetch,
    });

    render(<SearchResults />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/unable to fetch flights/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("shows empty state when no flights returned", () => {
    useFlightSearchMock.mockReturnValue({
      data: { flights: [], count: 0 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<SearchResults />);
    expect(screen.getByText(/no flights available/i)).toBeInTheDocument();
  });

  it("shows invalid search for bad URL params", () => {
    setSearchParams("origin=JFK&destination=LAX&date=2026-07-15&passengers=abc");

    render(<SearchResults />);
    expect(screen.getByText(/invalid search/i)).toBeInTheDocument();
  });

  it("renders flight results", () => {
    useFlightSearchMock.mockReturnValue({
      data: { flights: [sampleFlight], count: 1 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<SearchResults />);
    expect(screen.getByText("DL 401")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /select delta flight/i })).toBeInTheDocument();
  });

  it("passes simulateError to useFlightSearch", () => {
    setSearchParams(
      "origin=JFK&destination=LAX&date=2026-07-15&passengers=1&simulateError=true",
    );

    useFlightSearchMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<SearchResults />);

    expect(useFlightSearchMock).toHaveBeenCalledWith(
      expect.objectContaining({ origin: "JFK", destination: "LAX" }),
      { simulateError: true },
    );
  });

  it("renders pagination for multiple flights", () => {
    const flights = Array.from({ length: 15 }, (_, index) => ({
      ...sampleFlight,
      id: `flt-${index}`,
      flightNumber: `DL ${400 + index}`,
    }));

    useFlightSearchMock.mockReturnValue({
      data: { flights, count: flights.length },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<SearchResults />);
    expect(screen.getAllByLabelText(/flight results pagination/i)).toHaveLength(2);
  });
});
