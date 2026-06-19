"use client";

import { useMutation } from "@tanstack/react-query";
import { createBooking } from "@/lib/api/flight-api";
import type { BookingFormValues } from "@/lib/validation/schemas";

export function useCreateBooking() {
  return useMutation({
    mutationFn: ({
      flightId,
      passengers,
      passengerDetails,
    }: {
      flightId: string;
      passengers: number;
      passengerDetails: BookingFormValues;
    }) => createBooking(flightId, passengers, passengerDetails),
  });
}
