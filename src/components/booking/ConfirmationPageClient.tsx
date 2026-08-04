"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingConfirmationView } from "@/components/booking/BookingConfirmationView";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  consumePendingConfirmation,
  useBookingStore,
} from "@/store/booking-store";

/** Wait for zustand persist rehydration before treating empty confirmation as "missing". */
function useBookingStoreHydrated() {
  const [hydrated, setHydrated] = useState(() =>
    useBookingStore.persist.hasHydrated(),
  );

  useEffect(() => {
    setHydrated(useBookingStore.persist.hasHydrated());
    return useBookingStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  return hydrated;
}

export function ConfirmationPageClient() {
  const router = useRouter();
  const confirmation = useBookingStore((s) => s.confirmation);
  const setConfirmation = useBookingStore((s) => s.setConfirmation);
  const hydrated = useBookingStoreHydrated();

  useEffect(() => {
    if (!hydrated) return;

    if (!confirmation) {
      const pending = consumePendingConfirmation();
      if (pending) {
        setConfirmation(pending);
        return;
      }
      router.replace("/");
    }
  }, [hydrated, confirmation, router, setConfirmation]);

  if (!hydrated || !confirmation) {
    return <LoadingState message="Loading confirmation..." />;
  }

  return <BookingConfirmationView booking={confirmation} />;
}
