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
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { useFlightResults } from "@/hooks/useFlightResults";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { usePagination } from "@/hooks/usePagination";
import { getAirportLabel } from "@/lib/constants/airports";
import { displayMd, panel } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";
import { parseSearchParamsFromUrl } from "@/lib/validation/schemas";

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => parseSearchParamsFromUrl(searchParams), [searchParams]);

  const { data, isLoading, isError, error, refetch } = useFlightSearch(
    parsed.success ? parsed.data.params : null,
    { simulateError: parsed.success ? parsed.data.simulateError : false },
  );

  const { flights, sortBy, sortOrder, filters, setFilters, handleSortChange, totalCount, filteredCount } =
    useFlightResults(data?.flights);

  const { paginatedItems, meta, goToPage, changePageSize } = usePagination(flights);

  function handlePageChange(page: number) {
    goToPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!parsed.success) {
    return (
      <EmptyState title="Invalid search" description={parsed.error} actionLabel="New search" onAction={() => router.push("/")} />
    );
  }

  const params = parsed.data.params;

  if (isLoading) return <LoadingState />;
  if (isError) {
    return <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => refetch()} />;
  }

  if (totalCount === 0) {
    const hints =
      data?.availableRoutes
        ?.slice(0, 3)
        .map((r) => `${r.origin}→${r.destination}`)
        .join(", ") ?? "";
    return (
      <EmptyState
        title="No flights on this route"
        description={`Nothing found for ${params.date}. Try ${hints || "another date or route"}.`}
        actionLabel="Modify search"
        onAction={() => router.push("/")}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Results" }]} />

      <header>
        <h1 className={displayMd}>
          {getAirportLabel(params.origin)} to {getAirportLabel(params.destination)}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
          {params.date} · {params.passengers} traveler{params.passengers > 1 ? "s" : ""} ·{" "}
          <span className="font-medium text-[var(--color-ink)]">{filteredCount}</span> of {totalCount} flights
        </p>
      </header>

      <SearchForm variant="compact" />

      <div ref={resultsRef} className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <div className="lg:sticky lg:top-[76px] lg:self-start">
          <FiltersPanel flights={data?.flights ?? []} filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SortControls sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
            <Pagination meta={meta} variant="summary" onPageChange={handlePageChange} onPageSizeChange={changePageSize} />
          </div>

          {filteredCount === 0 ? (
            <EmptyState title="No matches" description="Adjust your filters to see more flights." actionLabel="Clear filters" onAction={() => setFilters({})} />
          ) : (
            <>
              <div className={cn(panel, "overflow-hidden")}>
                {paginatedItems.map((flight, i) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    passengers={params.passengers}
                    isLast={i === paginatedItems.length - 1}
                  />
                ))}
              </div>
              <Pagination meta={meta} variant="full" onPageChange={handlePageChange} onPageSizeChange={changePageSize} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
