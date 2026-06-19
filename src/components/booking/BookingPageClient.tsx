"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { FlightReview } from "@/components/booking/FlightReview";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { CheckoutSteps, PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { useFlightById } from "@/hooks/useFlightById";
import type { BookingFormValues } from "@/lib/validation/schemas";
import { parsePassengersFromUrl } from "@/lib/validation/schemas";
import { displayMd } from "@/lib/utils/design-tokens";
import { useBookingStore } from "@/store/booking-store";

export function BookingPageClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const flightId = params.flightId as string;

  const passengersParsed = parsePassengersFromUrl(searchParams);
  const selectedFlight = useBookingStore((s) => s.selectedFlight);
  const selectFlight = useBookingStore((s) => s.selectFlight);
  const storedSearchParams = useBookingStore((s) => s.searchParams);
  const setConfirmation = useBookingStore((s) => s.setConfirmation);
  const { mutate, isPending, error } = useCreateBooking();

  const needsFetch = !selectedFlight || selectedFlight.id !== flightId;
  const { data: flightData, isLoading, isError, error: flightError, refetch } = useFlightById(needsFetch ? flightId : null);

  useEffect(() => {
    if (flightData?.flight && needsFetch) selectFlight(flightData.flight);
  }, [flightData, needsFetch, selectFlight]);

  const flight = selectedFlight?.id === flightId ? selectedFlight : flightData?.flight;
  const backHref = storedSearchParams
    ? `/search?origin=${storedSearchParams.origin}&destination=${storedSearchParams.destination}&date=${storedSearchParams.date}&passengers=${storedSearchParams.passengers}`
    : "/search?origin=JFK&destination=LAX&date=2026-07-15&passengers=1";

  if (!passengersParsed.success) {
    return <EmptyState title="Invalid booking" description={passengersParsed.error} actionLabel="Search" onAction={() => router.push("/")} />;
  }

  const passengers = passengersParsed.passengers;

  if (needsFetch && isLoading) return <LoadingState message="Loading flight…" />;
  if (needsFetch && isError) {
    return <ErrorState message={flightError instanceof Error ? flightError.message : undefined} onRetry={() => refetch()} />;
  }
  if (!flight) {
    return <EmptyState title="Flight unavailable" description="This flight could not be found." actionLabel="Search again" onAction={() => router.push("/")} />;
  }

  function handleSubmit(passengerDetails: BookingFormValues) {
    mutate({ flightId, passengers, passengerDetails }, {
      onSuccess: (data) => {
        setConfirmation(data.booking);
        router.push("/booking/confirmation");
      },
    });
  }

  return (
    <div className="space-y-8">
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Results", href: backHref }, { label: "Checkout" }]} />
      <CheckoutSteps current={2} />
      <header>
        <h1 className={displayMd}>Complete your booking</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Review your itinerary and enter traveler information.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className="h-full lg:sticky lg:top-[76px] lg:self-start">
          <FlightReview flight={flight} passengers={passengers} />
        </div>
        <div className="h-full">
          <BookingForm onSubmit={handleSubmit} isLoading={isPending} error={error instanceof Error ? error.message : null} />
        </div>
      </div>
    </div>
  );
}
