"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFlights } from "@/lib/api/flight-api";
import type { FlightSearchParams } from "@/lib/types/flight";

export interface UseFlightSearchOptions {
  simulateError?: boolean;
}

export function useFlightSearch(
  params: FlightSearchParams | null,
  options?: UseFlightSearchOptions,
) {
  return useQuery({
    queryKey: ["flights", params, options?.simulateError],
    queryFn: () => fetchFlights(params!, { simulateError: options?.simulateError }),
    enabled: !!params?.origin && !!params?.destination && !!params?.date,
  });
}
