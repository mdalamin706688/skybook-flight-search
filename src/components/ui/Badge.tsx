import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning";
  className?: string;
}

const styles = {
  default: "bg-[var(--color-paper)] text-[var(--color-ink-muted)] ring-1 ring-[var(--color-line)]",
  success: "bg-[var(--color-success-soft)] text-[var(--color-success)] ring-1 ring-emerald-200/60",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/60",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
