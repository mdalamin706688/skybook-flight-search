import { Button } from "@/components/ui/Button";
import { panel } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No flights found",
  description = "Try adjusting your search criteria or filters to find available flights.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const titleId = "empty-state-title";

  return (
    <section
      className={cn(panel, "flex flex-col items-center justify-center gap-5 px-6 py-16 text-center")}
      role="region"
      aria-labelledby={titleId}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-paper)] ring-1 ring-[var(--color-line)]">
        <svg
          className="h-5 w-5 text-[var(--color-ink-faint)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </div>
      <div className="max-w-sm space-y-2">
        <h3 id={titleId} className="text-lg font-semibold text-[var(--color-ink)]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </section>
  );
}
