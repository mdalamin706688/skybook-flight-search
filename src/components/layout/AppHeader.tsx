import Link from "next/link";
import { shell, headerBar, headerBarHero } from "@/lib/utils/design-tokens";
import { focusRing } from "@/lib/utils/interactive-styles";
import { cn } from "@/lib/utils/cn";

interface AppHeaderProps {
  variant?: "default" | "hero";
}

function Logo({ light }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          light ? "bg-white text-[#0c1222]" : "bg-[var(--color-ink)] text-white",
        )}
      >
        <svg className="h-4 w-4 -rotate-45" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-1.5-1.5h-1A1.5 1.5 0 009 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </span>
      <span
        className={cn(
          "font-[family-name:var(--font-display-family)] text-[17px] font-semibold tracking-[-0.02em]",
          light ? "text-white" : "text-[var(--color-ink)]",
        )}
      >
        SkyBook
      </span>
    </span>
  );
}

export function AppHeader({ variant = "default" }: AppHeaderProps) {
  const isHero = variant === "hero";

  return (
    <header className={isHero ? headerBarHero : headerBar} role="banner">
      <div className={cn(shell, "flex h-[60px] items-center justify-between")}>
        <Link href="/" className={cn("rounded-md", focusRing)} aria-label="SkyBook home">
          <Logo light={isHero} />
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main">
          {!isHero && (
            <Link
              href="/"
              className={cn(
                focusRing,
                "hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] sm:inline-flex",
              )}
            >
              Home
            </Link>
          )}
          <Link
            href="/"
            className={cn(
              focusRing,
              "rounded-lg px-4 py-2 text-sm font-semibold transition-all",
              isHero
                ? "bg-white text-[var(--color-ink)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
                : "bg-[var(--color-ink)] text-white hover:bg-[#1a2332]",
            )}
          >
            Search flights
          </Link>
        </nav>
      </div>
    </header>
  );
}
