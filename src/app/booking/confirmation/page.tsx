import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ConfirmationPageClient } from "@/components/booking/ConfirmationPageClient";
import { LoadingState } from "@/components/shared/LoadingState";

export default function ConfirmationPage() {
  return (
    <>
      <AppHeader />
      <main id="main-content" className="mx-auto max-w-4xl flex-1 px-4 py-8">
        <Suspense fallback={<LoadingState />}>
          <ConfirmationPageClient />
        </Suspense>
      </main>
    </>
  );
}
