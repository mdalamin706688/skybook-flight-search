import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SearchResults } from "@/components/search/SearchResults";
import { LoadingState } from "@/components/shared/LoadingState";

export default function SearchPage() {
  return (
    <>
      <AppHeader />
      <main id="main-content" className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <Suspense fallback={<LoadingState />}>
          <SearchResults />
        </Suspense>
      </main>
    </>
  );
}
