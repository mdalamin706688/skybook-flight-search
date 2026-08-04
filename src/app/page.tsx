import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SearchForm } from "@/components/search/SearchForm";
import { displayLg, eyebrow, heroSubtitle, shellWide, sectionY } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";

const features = [
  {
    num: "01",
    title: "Compare instantly",
    desc: "Sort by price, duration, or departure across 1,700+ flights on 56 routes.",
  },
  {
    num: "02",
    title: "Filter with precision",
    desc: "Narrow by airline, stops, and fare ceiling without losing your search context.",
  },
  {
    num: "03",
    title: "Book with confidence",
    desc: "Review every detail, enter traveler info once, and receive instant confirmation.",
  },
];

const carriers = ["Delta", "United", "American", "JetBlue", "Southwest", "Alaska"];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden hero-canvas">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />

        <AppHeader variant="hero" />

        <div className={cn(shellWide, "relative z-10 pb-16 pt-28 sm:pb-20 sm:pt-32")}>
          <div className="mx-auto max-w-[640px] text-center">
            <p className={cn(eyebrow, "text-white/50")}>Global routes · Real-time compare · Instant book</p>

            <h1
              className={cn(
                displayLg,
                "mt-4 text-[2rem] text-white sm:mt-5 sm:text-[2.75rem]",
              )}
            >
              Flight commerce, refined.
            </h1>

            <p className={cn(heroSubtitle, "mx-auto mt-4 max-w-md")}>
              Search, compare, and book across major carriers — built for the clarity travelers expect
              and the reliability operators demand.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {carriers.map((airline) => (
                <span
                  key={airline}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-white/75"
                >
                  {airline}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="flex-1">
        <section id="search" className={cn(shellWide, "relative z-20 -mt-10 pb-8 sm:-mt-12")}>
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
        </section>

        <section id="features" className={cn(shellWide, sectionY, "border-t border-[var(--color-line)] pb-16")}>
          <div className="mb-10 max-w-lg">
            <p className={eyebrow}>Why SkyBook</p>
            <h2 className={cn(displayLg, "mt-2 text-2xl sm:text-[1.75rem]")}>
              Every step, considered.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              A complete travel commerce flow — search, filter, paginate, and book — built with
              production-grade architecture from day one.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.num}
                className="bg-[var(--color-paper-elevated)] p-6 sm:p-7"
              >
                <span className="font-mono text-[11px] font-medium tracking-wider text-[var(--color-ink-faint)]">
                  {item.num}
                </span>
                <h3 className="mt-3 text-[15px] font-semibold text-[var(--color-ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
