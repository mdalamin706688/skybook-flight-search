import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BookingPageClient } from "@/components/booking/BookingPageClient";
import { LoadingState } from "@/components/shared/LoadingState";

export default function BookingPage() {
  return (
    <>
      <AppHeader />
      <main id="main-content" className="mx-auto max-w-4xl flex-1 px-4 py-8">
        <Suspense fallback={<LoadingState />}>
          <BookingPageClient />
        </Suspense>
      </main>
    </>
  );
}
