import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Flight, FlightSearchParams } from "@/lib/types/flight";
import type { BookingConfirmation } from "@/lib/types/booking";

interface BookingState {
  searchParams: FlightSearchParams | null;
  selectedFlight: Flight | null;
  confirmation: BookingConfirmation | null;
  setSearchParams: (params: FlightSearchParams) => void;
  selectFlight: (flight: Flight) => void;
  setConfirmation: (confirmation: BookingConfirmation) => void;
  reset: () => void;
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
