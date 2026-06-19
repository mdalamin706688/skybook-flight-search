import type { Flight } from "./flight";

export interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface BookingRequest {
  flightId: string;
  passengers: number;
  passengerDetails: PassengerDetails;
}

export interface BookingConfirmation {
  bookingId: string;
  flight: Flight;
  passengers: number;
  passengerDetails: PassengerDetails;
  totalPrice: number;
  bookedAt: string;
}
