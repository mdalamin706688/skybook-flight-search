"use client";

import { useMemo, useState } from "react";
import type { FlightFilters, SortField, SortOrder } from "@/lib/types/flight";
import { filterFlights, sortFlights } from "@/lib/utils/flight-utils";
import type { Flight } from "@/lib/types/flight";

export function useFlightResults(flights: Flight[] | undefined) {
  const [sortBy, setSortBy] = useState<SortField>("price");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filters, setFilters] = useState<FlightFilters>({});

  const processedFlights = useMemo(() => {
    if (!flights) return [];
    const filtered = filterFlights(flights, filters);
    return sortFlights(filtered, sortBy, sortOrder);
  }, [flights, filters, sortBy, sortOrder]);

  function handleSortChange(field: SortField, order: SortOrder) {
    setSortBy(field);
    setSortOrder(order);
  }

  return {
    flights: processedFlights,
    sortBy,
    sortOrder,
    filters,
    setFilters,
    handleSortChange,
    totalCount: flights?.length ?? 0,
    filteredCount: processedFlights.length,
  };
}
