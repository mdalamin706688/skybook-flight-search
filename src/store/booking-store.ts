import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Flight, FlightSearchParams } from "@/lib/types/flight";
import type { BookingConfirmation } from "@/lib/types/booking";

const PENDING_CONFIRMATION_KEY = "skybook-pending-confirmation";

interface BookingState {
  searchParams: FlightSearchParams | null;
  selectedFlight: Flight | null;
  confirmation: BookingConfirmation | null;
  setSearchParams: (params: FlightSearchParams) => void;
  selectFlight: (flight: Flight) => void;
  setConfirmation: (confirmation: BookingConfirmation) => void;
  reset: () => void;
}

/** Sync handoff for static/full-page navigations before persist rehydrates. */
export function stashPendingConfirmation(confirmation: BookingConfirmation) {
  try {
    sessionStorage.setItem(PENDING_CONFIRMATION_KEY, JSON.stringify(confirmation));
  } catch {
    // Ignore quota / private-mode failures; persist store remains primary.
  }
}

export function consumePendingConfirmation(): BookingConfirmation | null {
  try {
    const raw = sessionStorage.getItem(PENDING_CONFIRMATION_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING_CONFIRMATION_KEY);
    return JSON.parse(raw) as BookingConfirmation;
  } catch {
    return null;
  }
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      searchParams: null,
      selectedFlight: null,
      confirmation: null,
      setSearchParams: (params) => set({ searchParams: params }),
      selectFlight: (flight) => set({ selectedFlight: flight }),
      setConfirmation: (confirmation) => set({ confirmation }),
      reset: () =>
        set({ searchParams: null, selectedFlight: null, confirmation: null }),
    }),
    {
      name: "flight-booking-store",
      partialize: (state) => ({
        confirmation: state.confirmation,
        selectedFlight: state.selectedFlight,
        searchParams: state.searchParams,
      }),
    },
  ),
);
