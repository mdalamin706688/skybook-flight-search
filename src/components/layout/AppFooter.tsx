import Link from "next/link";
import { shellWide } from "@/lib/utils/design-tokens";
import { focusRing } from "@/lib/utils/interactive-styles";
import { cn } from "@/lib/utils/cn";

export function AppFooter() {
  return (
    <footer className="mt-auto">
      <div className="border-t border-[var(--color-line)] bg-[var(--color-paper-elevated)]">
        <div className={cn(shellWide, "py-16")}>
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xs">
              <Link href="/" className={cn("inline-block rounded-md", focusRing)}>
                <span className="font-[family-name:var(--font-display-family)] text-xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                  SkyBook
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                Premium flight search and booking for the iBox Lab senior frontend take-home.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-20">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                  Product
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    { label: "Search", href: "/" },
                    {
                      label: "Sample results",
                      href: "/search?origin=JFK&destination=LAX&date=2026-07-15&passengers=1",
                    },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          focusRing,
                          "text-sm text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                  Source
                </p>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href="https://github.com/mdalamin706688/skybook-flight-search"
                      className={cn(
                        focusRing,
                        "text-sm text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                  Network
                </p>
                <dl className="mt-4 space-y-3">
                  {[
                    ["Flights", "1,792"],
                    ["Routes", "56"],
                    ["Airlines", "8"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-6">
                      <dt className="text-sm text-[var(--color-ink-muted)]">{label}</dt>
                      <dd className="font-mono text-sm font-medium tabular-nums text-[var(--color-ink)]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-ink)] text-white">
        <div className={cn(shellWide, "flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between")}>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} SkyBook · iBox Lab take-home project
          </p>
          <p className="text-xs text-white/40">
            Next.js 16 · React 19 · TypeScript · TanStack Query
          </p>
        </div>
      </div>
    </footer>
  );
}
