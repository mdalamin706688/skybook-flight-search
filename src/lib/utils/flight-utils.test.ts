import { describe, expect, it } from "vitest";
import type { Flight } from "@/lib/types/flight";
import {
  filterFlights,
  formatDuration,
  formatPrice,
  formatStops,
  getPriceRange,
  getUniqueAirlines,
  sortFlights,
} from "@/lib/utils/flight-utils";

const mockFlights: Flight[] = [
  {
    id: "1",
    airline: "Delta",
    flightNumber: "DL 100",
    origin: "JFK",
    destination: "LAX",
    departureTime: "08:00",
    arrivalTime: "11:00",
    durationMinutes: 300,
    stops: 0,
    price: 250,
    date: "2026-07-15",
  },
  {
    id: "2",
    airline: "United",
    flightNumber: "UA 200",
    origin: "JFK",
    destination: "LAX",
    departureTime: "06:00",
    arrivalTime: "10:00",
    durationMinutes: 360,
    stops: 1,
    price: 180,
    date: "2026-07-15",
  },
  {
    id: "3",
    airline: "Delta",
    flightNumber: "DL 300",
    origin: "JFK",
    destination: "LAX",
    departureTime: "14:00",
    arrivalTime: "17:00",
    durationMinutes: 280,
    stops: 0,
    price: 320,
    date: "2026-07-15",
  },
];

describe("flight-utils", () => {
  describe("formatDuration", () => {
    it("formats minutes into hours and minutes", () => {
      expect(formatDuration(375)).toBe("6h 15m");
      expect(formatDuration(60)).toBe("1h 0m");
      expect(formatDuration(45)).toBe("0h 45m");
    });
  });

  describe("formatPrice", () => {
    it("formats USD currency without decimals", () => {
      expect(formatPrice(289)).toBe("$289");
    });
  });

  describe("formatStops", () => {
    it("returns correct stop labels", () => {
      expect(formatStops(0)).toBe("Nonstop");
      expect(formatStops(1)).toBe("1 stop");
      expect(formatStops(2)).toBe("2 stops");
    });
  });

  describe("filterFlights", () => {
    it("filters by max price", () => {
      const result = filterFlights(mockFlights, { maxPrice: 200 });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2");
    });

    it("filters by max stops", () => {
      const result = filterFlights(mockFlights, { maxStops: 0 });
      expect(result).toHaveLength(2);
      expect(result.every((f) => f.stops === 0)).toBe(true);
    });

    it("filters by airlines", () => {
      const result = filterFlights(mockFlights, { airlines: ["Delta"] });
      expect(result).toHaveLength(2);
      expect(result.every((f) => f.airline === "Delta")).toBe(true);
    });

    it("combines multiple filters", () => {
      const result = filterFlights(mockFlights, {
        maxPrice: 300,
        maxStops: 0,
        airlines: ["Delta"],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });
  });

  describe("sortFlights", () => {
    it("sorts by price ascending", () => {
      const result = sortFlights(mockFlights, "price", "asc");
      expect(result.map((f) => f.price)).toEqual([180, 250, 320]);
    });

    it("sorts by price descending", () => {
      const result = sortFlights(mockFlights, "price", "desc");
      expect(result.map((f) => f.price)).toEqual([320, 250, 180]);
    });

    it("sorts by duration", () => {
      const result = sortFlights(mockFlights, "duration", "asc");
      expect(result.map((f) => f.durationMinutes)).toEqual([280, 300, 360]);
    });

    it("sorts by departure time", () => {
      const result = sortFlights(mockFlights, "departureTime", "asc");
      expect(result.map((f) => f.departureTime)).toEqual(["06:00", "08:00", "14:00"]);
    });
  });

  describe("getUniqueAirlines", () => {
    it("returns sorted unique airlines", () => {
      expect(getUniqueAirlines(mockFlights)).toEqual(["Delta", "United"]);
    });
  });

  describe("getPriceRange", () => {
    it("returns min and max prices", () => {
      expect(getPriceRange(mockFlights)).toEqual({ min: 180, max: 320 });
    });

    it("handles empty array", () => {
      expect(getPriceRange([])).toEqual({ min: 0, max: 0 });
    });
  });
});
