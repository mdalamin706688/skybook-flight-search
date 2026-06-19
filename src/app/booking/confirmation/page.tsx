import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ConfirmationPageClient } from "@/components/booking/ConfirmationPageClient";
import { LoadingState } from "@/components/shared/LoadingState";
import { shellWide, sectionY } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";

export default function ConfirmationPage() {
  return (
    <>
      <AppHeader />
      <main id="main-content" className={cn(shellWide, sectionY, "confirmation-canvas flex-1 pb-16 pt-8 lg:pt-10")}>
        <Suspense fallback={<LoadingState />}>
          <ConfirmationPageClient />
        </Suspense>
      </main>
    </>
  );
}
