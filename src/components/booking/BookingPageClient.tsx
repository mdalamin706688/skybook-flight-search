"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { FlightReview } from "@/components/booking/FlightReview";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { useFlightById } from "@/hooks/useFlightById";
import type { BookingFormValues } from "@/lib/validation/schemas";
import { parsePassengersFromUrl } from "@/lib/validation/schemas";
import { linkStyles } from "@/lib/utils/interactive-styles";
import { cn } from "@/lib/utils/cn";
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

  const needsFetch =
    !selectedFlight || selectedFlight.id !== flightId;

  const {
    data: flightData,
    isLoading: isFlightLoading,
    isError: isFlightError,
    error: flightError,
    refetch: refetchFlight,
  } = useFlightById(needsFetch ? flightId : null);

  useEffect(() => {
    if (flightData?.flight && needsFetch) {
      selectFlight(flightData.flight);
    }
  }, [flightData, needsFetch, selectFlight]);

  const flight =
    selectedFlight?.id === flightId ? selectedFlight : flightData?.flight;

  const backHref = storedSearchParams
    ? `/search?origin=${storedSearchParams.origin}&destination=${storedSearchParams.destination}&date=${storedSearchParams.date}&passengers=${storedSearchParams.passengers}`
    : "/";

  if (!passengersParsed.success) {
    return (
      <EmptyState
        title="Invalid booking"
        description={passengersParsed.error}
        actionLabel="Back to search"
        onAction={() => router.push("/")}
      />
    );
  }

  const passengers = passengersParsed.passengers;

  if (needsFetch && isFlightLoading) {
    return <LoadingState message="Loading flight details..." />;
  }

  if (needsFetch && isFlightError) {
    return (
      <ErrorState
        message={flightError instanceof Error ? flightError.message : undefined}
        onRetry={() => refetchFlight()}
      />
    );
  }

  if (!flight) {
    return (
      <EmptyState
        title="Flight not found"
        description="The selected flight could not be found. It may no longer be available."
        actionLabel="Back to search"
        onAction={() => router.push("/")}
      />
    );
  }

  function handleBookingSubmit(passengerDetails: BookingFormValues) {
    mutate(
      { flightId, passengers, passengerDetails },
      {
        onSuccess: (data) => {
          setConfirmation(data.booking);
          router.push("/booking/confirmation");
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Link href={backHref} className={cn(linkStyles, "inline-flex items-center gap-1")}>
          ← Back to results
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">Review & book</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <FlightReview flight={flight} passengers={passengers} />
        <BookingForm
          onSubmit={handleBookingSubmit}
          isLoading={isPending}
          error={error instanceof Error ? error.message : null}
        />
      </div>
    </div>
  );
}
