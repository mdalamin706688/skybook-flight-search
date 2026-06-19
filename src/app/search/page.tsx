import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SearchResults } from "@/components/search/SearchResults";
import { LoadingState } from "@/components/shared/LoadingState";
import { shellWide, sectionY } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";

export default function SearchPage() {
  return (
    <>
      <AppHeader />
      <main id="main-content" className={cn(shellWide, sectionY, "flex-1 pb-12 pt-8")}>
        <Suspense fallback={<LoadingState />}>
          <SearchResults />
        </Suspense>
      </main>
    </>
  );
}
