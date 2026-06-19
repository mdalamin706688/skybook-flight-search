import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SearchForm } from "@/components/search/SearchForm";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main id="main-content" className="flex-1">
        <section className="bg-gradient-to-b from-sky-50 to-white px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find your next flight
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Search, compare, and book flights across major US airlines.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-16 -mt-4 sm:-mt-8">
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
        </section>
      </main>
    </>
  );
}
