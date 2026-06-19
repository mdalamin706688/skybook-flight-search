import { panel } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading flights…" }: LoadingStateProps) {
  return (
    <div
      className={cn(panel, "flex flex-col items-center justify-center gap-4 py-20")}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-ink)]" aria-hidden="true" />
      <p className="text-sm font-medium text-[var(--color-ink-muted)]">{message}</p>
    </div>
  );
}
