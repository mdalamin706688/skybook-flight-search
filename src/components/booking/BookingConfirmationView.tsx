"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getAirportLabel } from "@/lib/constants/airports";
import type { BookingConfirmation } from "@/lib/types/booking";
import { formatDuration, formatPrice } from "@/lib/utils/flight-utils";
import { useBookingStore } from "@/store/booking-store";

interface BookingConfirmationViewProps {
  booking: BookingConfirmation;
}

export function BookingConfirmationView({ booking }: BookingConfirmationViewProps) {
  const router = useRouter();
  const reset = useBookingStore((s) => s.reset);
  const { flight, passengerDetails } = booking;

  function handleSearchAgain() {
    reset();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-8 w-8 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-emerald-900">Booking confirmed!</h1>
        <p className="mt-2 text-emerald-700">
          Confirmation number: <strong>{booking.bookingId}</strong>
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Trip summary</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Passenger</dt>
            <dd className="font-medium">
              {passengerDetails.firstName} {passengerDetails.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium">{passengerDetails.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Flight</dt>
            <dd className="font-medium">
              {flight.airline} {flight.flightNumber}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Route</dt>
            <dd className="font-medium">
              {getAirportLabel(flight.origin)} → {getAirportLabel(flight.destination)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Departure</dt>
            <dd className="font-medium">
              {flight.date} at {flight.departureTime}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Duration</dt>
            <dd className="font-medium">{formatDuration(flight.durationMinutes)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Passengers</dt>
            <dd className="font-medium">{booking.passengers}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Total paid</dt>
            <dd className="text-lg font-bold text-slate-900">
              {formatPrice(booking.totalPrice)}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex justify-center">
        <Button variant="outline" onClick={handleSearchAgain}>
          Search another flight
        </Button>
      </div>
    </div>
  );
}
