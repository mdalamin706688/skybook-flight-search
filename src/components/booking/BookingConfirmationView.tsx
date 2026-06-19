"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getAirportLabel } from "@/lib/constants/airports";
import type { BookingConfirmation } from "@/lib/types/booking";
import { formatDuration, formatPrice, formatStops } from "@/lib/utils/flight-utils";
import { downloadConfirmationReceipt, printConfirmation } from "@/lib/utils/confirmation-export";
import { displayLg, eyebrow, panel } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";
import { useBookingStore } from "@/store/booking-store";

function PrintIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V4h12v5M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
    </svg>
  );
}

function formatBookedAt(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function Barcode({ value }: { value: string }) {
  const bars = value.split("").map((char, i) => {
    const code = char.charCodeAt(0);
    return { key: `${char}-${i}`, width: (code % 3) + 1, opacity: 0.2 + (code % 5) * 0.14 };
  });

  return (
    <div className="flex w-full items-end justify-center gap-px" aria-hidden="true">
      {bars.map((bar) => (
        <span
          key={bar.key}
          className="rounded-sm bg-[var(--color-ink)]"
          style={{ width: bar.width, height: 36, opacity: bar.opacity }}
        />
      ))}
    </div>
  );
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

export function BookingConfirmationView({ booking }: { booking: BookingConfirmation }) {
  const router = useRouter();
  const reset = useBookingStore((s) => s.reset);
  const { flight, passengerDetails } = booking;
  const passengerName = `${passengerDetails.firstName} ${passengerDetails.lastName}`;

  function handleNewSearch() {
    reset();
    router.push("/");
  }

  return (
    <div className="confirmation-print-root w-full space-y-8 lg:space-y-10">
      <header className="flex flex-col gap-6 border-b border-[var(--color-line)] pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-success)] text-white shadow-[var(--shadow-md)]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <p className={eyebrow}>Booking confirmed</p>
            <h1 className={cn(displayLg, "mt-1.5 text-[1.875rem] sm:text-[2.25rem]")}>
              You&apos;re all set, {passengerDetails.firstName}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
              Your itinerary is confirmed. A receipt was sent to{" "}
              <span className="font-medium text-[var(--color-ink)]">{passengerDetails.email}</span>.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto lg:min-w-[280px]">
          <div className={cn(panel, "px-5 py-4")}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
              Confirmation number
            </p>
            <p className="mt-1 font-mono text-lg font-semibold tracking-wide text-[var(--color-ink)]">
              {booking.bookingId}
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{formatBookedAt(booking.bookedAt)}</p>
          </div>

          <div className="no-print grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => printConfirmation()}
              className="w-full"
            >
              <PrintIcon />
              Print
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => downloadConfirmationReceipt(booking)}
              className="w-full"
            >
              <DownloadIcon />
              Download
            </Button>
          </div>
        </div>
      </header>

      <article
        className="boarding-pass-shadow w-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-elevated)]"
        aria-label="Boarding pass"
      >
        <div className="flex items-center justify-between bg-[var(--color-ink)] px-6 py-4 text-white lg:px-8 lg:py-5">
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">
              {flight.airline.charAt(0)}
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">SkyBook · E-ticket</p>
              <p className="text-base font-semibold">{flight.airline}</p>
              <p className="text-sm text-white/55">{flight.flightNumber}</p>
            </div>
          </div>
          <Badge variant={flight.stops === 0 ? "success" : "warning"} className="hidden sm:inline-flex">
            {formatStops(flight.stops)}
          </Badge>
        </div>

        <div className="flex flex-col lg:flex-row">
          <aside className="flex shrink-0 flex-row gap-6 border-b border-dashed border-[var(--color-line)] bg-[var(--color-paper)] px-6 py-4 lg:w-[148px] lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
            {[
              ["Date", flight.date],
              ["Gate", "—"],
              ["Class", "Economy"],
              ["Travelers", String(booking.passengers)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">{value}</p>
              </div>
            ))}
          </aside>

          <div className="min-w-0 flex-1 px-6 py-8 lg:px-10 lg:py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
              Passenger
            </p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-ink)]">{passengerName}</p>

            <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 lg:mt-12 lg:gap-10">
              <div>
                <p className="font-[family-name:var(--font-display-family)] text-5xl font-semibold leading-none tracking-[-0.04em] text-[var(--color-ink)] lg:text-6xl">
                  {flight.origin}
                </p>
                <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{getAirportLabel(flight.origin)}</p>
                <p className="mt-4 text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-ink)] lg:text-3xl">
                  {flight.departureTime}
                </p>
              </div>

              <div className="flex w-full min-w-[100px] max-w-[200px] flex-col items-center self-center lg:max-w-none lg:flex-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
                  {formatDuration(flight.durationMinutes)}
                </span>
                <div className="mt-3 flex w-full items-center">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-line-strong)]" />
                  <span className="relative mx-2 h-px flex-1 bg-[var(--color-line)]">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]">
                      <svg className="h-4 w-4 -rotate-45" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-1.5-1.5h-1A1.5 1.5 0 009 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                      </svg>
                    </span>
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                </div>
                <Badge variant={flight.stops === 0 ? "success" : "warning"} className="mt-3 sm:hidden">
                  {formatStops(flight.stops)}
                </Badge>
              </div>

              <div className="text-right">
                <p className="font-[family-name:var(--font-display-family)] text-5xl font-semibold leading-none tracking-[-0.04em] text-[var(--color-ink)] lg:text-6xl">
                  {flight.destination}
                </p>
                <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{getAirportLabel(flight.destination)}</p>
                <p className="mt-4 text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-ink)] lg:text-3xl">
                  {flight.arrivalTime}
                </p>
              </div>
            </div>
          </div>

          <aside className="shrink-0 border-t border-dashed border-[var(--color-line)] bg-[var(--color-paper)] px-6 py-6 lg:w-[300px] lg:border-l lg:border-t-0 lg:px-7 lg:py-8">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-1">
              <DetailCell label="Phone" value={passengerDetails.phone} />
              <DetailCell label="Flight" value={flight.flightNumber} />
              <DetailCell label="Booked" value={formatBookedAt(booking.bookedAt)} />
              <DetailCell label="Total paid" value={formatPrice(booking.totalPrice)} />
            </dl>
            <div className="mt-8 hidden lg:block">
              <Barcode value={booking.bookingId} />
              <p className="mt-2 text-center font-mono text-[10px] tracking-[0.18em] text-[var(--color-ink-faint)]">
                {booking.bookingId}
              </p>
            </div>
          </aside>
        </div>

        <div className="border-t border-[var(--color-line)] bg-[var(--color-paper)] px-6 py-5 lg:hidden">
          <Barcode value={booking.bookingId} />
          <p className="mt-2 text-center font-mono text-[10px] tracking-[0.18em] text-[var(--color-ink-faint)]">
            {booking.bookingId}
          </p>
        </div>

        <div className="ticket-notch h-4 border-t border-[var(--color-line)] bg-[var(--color-paper)]" aria-hidden="true" />
      </article>

      <div className="no-print flex flex-col gap-4 border-t border-[var(--color-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">Amount charged</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-[var(--color-ink)]">
            {formatPrice(booking.totalPrice)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleNewSearch} size="lg" className="sm:min-w-[200px]">
            Book another flight
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              router.push(
                `/search?origin=${flight.origin}&destination=${flight.destination}&date=${flight.date}&passengers=${booking.passengers}`,
              )
            }
            className="sm:min-w-[200px]"
          >
            Search similar routes
          </Button>
        </div>
      </div>
    </div>
  );
}
