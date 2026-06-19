import { z } from "zod";
import type { FlightSearchParams } from "@/lib/types/flight";

export const passengersSchema = z.coerce
  .number()
  .int("Passengers must be a whole number")
  .min(1, "At least 1 passenger")
  .max(9, "Maximum 9 passengers");

export const searchFormSchema = z
  .object({
    origin: z.string().min(1, "Origin is required"),
    destination: z.string().min(1, "Destination is required"),
    date: z.string().min(1, "Date is required"),
    passengers: passengersSchema,
  })
  .refine((data) => data.origin !== data.destination, {
    message: "Origin and destination must differ",
    path: ["destination"],
  });

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export const bookingFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[\d\s\-+()]+$/, "Invalid phone number"),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const bookingRequestSchema = z.object({
  flightId: z.string().min(1, "Flight ID is required"),
  passengers: passengersSchema,
  passengerDetails: bookingFormSchema,
});

export type BookingRequestValues = z.infer<typeof bookingRequestSchema>;

export interface ParsedSearchParams {
  params: FlightSearchParams;
  simulateError: boolean;
}

export function parseSearchParamsFromUrl(
  searchParams: URLSearchParams,
): { success: true; data: ParsedSearchParams } | { success: false; error: string } {
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const passengersRaw = searchParams.get("passengers") ?? "1";
  const simulateError = searchParams.get("simulateError") === "true";

  if (!origin || !destination || !date) {
    return {
      success: false,
      error: "Please provide origin, destination, and date to search for flights.",
    };
  }

  const result = searchFormSchema.safeParse({
    origin,
    destination,
    date,
    passengers: passengersRaw,
  });

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ?? "Invalid search parameters.";
    return { success: false, error: message };
  }

  return {
    success: true,
    data: {
      params: result.data,
      simulateError,
    },
  };
}

export function parsePassengersFromUrl(
  searchParams: URLSearchParams,
): { success: true; passengers: number } | { success: false; error: string } {
  const passengersRaw = searchParams.get("passengers") ?? "1";
  const result = passengersSchema.safeParse(passengersRaw);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Invalid passenger count.",
    };
  }

  return { success: true, passengers: result.data };
}
