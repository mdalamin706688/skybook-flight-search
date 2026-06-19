import { Button } from "@/components/ui/Button";
import { panel } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className={cn(panel, "flex flex-col items-center justify-center gap-5 px-6 py-16 text-center")}
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
        <svg
          className="h-5 w-5 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="max-w-sm space-y-2">
        <h3 className="text-lg font-semibold text-[var(--color-ink)]">Unable to load results</h3>
        <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{message}</p>
      </div>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}
