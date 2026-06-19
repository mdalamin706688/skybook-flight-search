"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BookingConfirmationView } from "@/components/booking/BookingConfirmationView";
import { LoadingState } from "@/components/shared/LoadingState";
import { useBookingStore } from "@/store/booking-store";

export function ConfirmationPageClient() {
  const router = useRouter();
  const confirmation = useBookingStore((s) => s.confirmation);

  useEffect(() => {
    if (!confirmation) {
      router.replace("/");
    }
  }, [confirmation, router]);

  if (!confirmation) {
    return <LoadingState message="Loading confirmation..." />;
  }

  return (
    <BookingConfirmationView
      booking={confirmation}
    />
  );
}
