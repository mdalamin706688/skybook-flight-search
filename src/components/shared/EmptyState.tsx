import { Button } from "@/components/ui/Button";

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
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
      role="region"
      aria-labelledby={titleId}
    >
      <div className="rounded-full bg-slate-100 p-4">
        <svg
          className="h-8 w-8 text-slate-400"
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
      <h3 id={titleId} className="text-lg font-semibold text-slate-900">
        {title}
      </h3>
      <p className="max-w-md text-sm text-slate-600">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </section>
  );
}
