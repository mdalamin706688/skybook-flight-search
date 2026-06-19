import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { focusRing } from "@/lib/utils/interactive-styles";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function PageBreadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs text-[var(--color-ink-faint)]", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[var(--color-line-strong)]">/</span>}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className={cn(focusRing, "rounded font-medium hover:text-[var(--color-ink)]")}>
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[var(--color-ink-muted)]" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const STEPS = ["Select", "Details", "Confirm"];

export function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-0" aria-label="Progress">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex items-center">
            {i > 0 && <span className="mx-2 h-px w-6 bg-[var(--color-line)] sm:w-10" aria-hidden="true" />}
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                  done && "bg-[var(--color-ink)] text-white",
                  active && "bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30",
                  !done && !active && "bg-[var(--color-paper)] text-[var(--color-ink-faint)] ring-1 ring-[var(--color-line)]",
                )}
              >
                {done ? "✓" : step}
              </span>
              <span className={cn("hidden text-xs sm:inline", active ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink-faint)]")}>
                {label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
