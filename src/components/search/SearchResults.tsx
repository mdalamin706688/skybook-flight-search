"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { FlightCard } from "@/components/search/FlightCard";
import { FiltersPanel } from "@/components/search/FiltersPanel";
import { SearchForm } from "@/components/search/SearchForm";
import { SortControls } from "@/components/search/SortControls";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Pagination } from "@/components/ui/Pagination";
import { useFlightResults } from "@/hooks/useFlightResults";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { usePagination } from "@/hooks/usePagination";
import { getAirportLabel } from "@/lib/constants/airports";
import { parseSearchParamsFromUrl } from "@/lib/validation/schemas";

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(
    () => parseSearchParamsFromUrl(searchParams),
    [searchParams],
  );

  const { data, isLoading, isError, error, refetch } = useFlightSearch(
    parsed.success ? parsed.data.params : null,
    { simulateError: parsed.success ? parsed.data.simulateError : false },
  );

  const {
    flights,
    sortBy,
    sortOrder,
    filters,
    setFilters,
    handleSortChange,
    totalCount,
    filteredCount,
  } = useFlightResults(data?.flights);

  const { paginatedItems, meta, goToPage, changePageSize } = usePagination(flights);

  function handlePageChange(page: number) {
    goToPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!parsed.success) {
    return (
      <EmptyState
        title="Invalid search"
        description={parsed.error}
        actionLabel="Start a new search"
        onAction={() => router.push("/")}
      />
    );
  }

  const params = parsed.data.params;

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (totalCount === 0) {
    const routeHints =
      data?.availableRoutes
        ?.slice(0, 4)
        .map(
          (route) =>
            `${getAirportLabel(route.origin)} → ${getAirportLabel(route.destination)} (${route.count} flights)`,
        )
        .join(", ") ?? "any available airport pair";

    return (
      <EmptyState
        title="No flights available"
        description={`No flights found from ${getAirportLabel(params.origin)} to ${getAirportLabel(params.destination)} on ${params.date}. Try: ${routeHints}.`}
        actionLabel="Modify search"
        onAction={() => router.push("/")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SearchForm variant="compact" />

      <div ref={resultsRef} className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {getAirportLabel(params.origin)} → {getAirportLabel(params.destination)}
            </h1>
            <p className="text-sm text-slate-600">
              {params.date} · {params.passengers} passenger
              {params.passengers > 1 ? "s" : ""} · {filteredCount} of {totalCount} flights
            </p>
          </div>
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <FiltersPanel
            flights={data?.flights ?? []}
            filters={filters}
            onFiltersChange={setFilters}
          />

          <div className="space-y-4">
            {filteredCount === 0 ? (
              <EmptyState
                title="No matching flights"
                description="No flights match your current filters. Try adjusting them."
                actionLabel="Clear filters"
                onAction={() => setFilters({})}
              />
            ) : (
              <>
                <Pagination
                  meta={meta}
                  variant="summary"
                  onPageChange={handlePageChange}
                  onPageSizeChange={changePageSize}
                />

                {paginatedItems.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    passengers={params.passengers}
                  />
                ))}

                <Pagination
                  meta={meta}
                  variant="full"
                  onPageChange={handlePageChange}
                  onPageSizeChange={changePageSize}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
