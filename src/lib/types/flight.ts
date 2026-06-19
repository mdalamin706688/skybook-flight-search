export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  price: number;
  date: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

export type SortField = "price" | "duration" | "departureTime";
export type SortOrder = "asc" | "desc";

export interface FlightFilters {
  maxPrice?: number;
  maxStops?: number;
  airlines?: string[];
}

export interface FlightSearchQuery extends FlightSearchParams {
  sortBy?: SortField;
  sortOrder?: SortOrder;
  maxPrice?: number;
  maxStops?: number;
  airlines?: string;
}
