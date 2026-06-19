import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-ink)] text-white hover:bg-[#1a2332] shadow-[var(--shadow-xs)] focus-visible:ring-[var(--color-ink)] disabled:bg-[var(--color-ink-faint)]",
  secondary:
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-xs)] focus-visible:ring-[var(--color-accent)]",
  outline:
    "border border-[var(--color-line-strong)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-paper)] focus-visible:ring-[var(--color-accent)]",
  ghost:
    "text-[var(--color-ink-muted)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)] focus-visible:ring-[var(--color-accent)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 rounded-lg px-3 text-xs font-semibold",
  md: "h-10 rounded-lg px-4 text-sm font-semibold",
  lg: "h-11 rounded-xl px-5 text-sm font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  ),
);

Button.displayName = "Button";
