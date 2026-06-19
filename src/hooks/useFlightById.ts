"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFlightById } from "@/lib/api/flight-api";

export function useFlightById(flightId: string | null) {
  return useQuery({
    queryKey: ["flight", flightId],
    queryFn: () => fetchFlightById(flightId!),
    enabled: !!flightId,
  });
}
