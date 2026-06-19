import { cn } from "@/lib/utils/cn";
import { fieldStyles, focusRing, interactiveControl } from "@/lib/utils/interactive-styles";
import { getPageNumbers } from "@/lib/utils/pagination-utils";
import type { PaginationMeta } from "@/lib/utils/pagination-utils";
import { PAGE_SIZE_OPTIONS, type PageSize } from "@/lib/constants/pagination";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: PageSize) => void;
  variant?: "full" | "summary";
  className?: string;
}

export function Pagination({
  meta,
  onPageChange,
  onPageSizeChange,
  variant = "full",
  className,
}: PaginationProps) {
  const { currentPage, totalPages, totalItems, startIndex, endIndex, pageSize } = meta;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  if (totalItems === 0) {
    return null;
  }

  if (variant === "summary") {
    return (
      <p className={cn("text-xs text-[var(--color-ink-faint)]", className)}>
        <span className="font-medium text-[var(--color-ink-muted)]">{startIndex}–{endIndex}</span> of{" "}
        <span className="font-medium text-[var(--color-ink-muted)]">{totalItems}</span>
      </p>
    );
  }

  return (
    <nav
      aria-label="Flight results pagination"
      className={cn(
        "flex flex-col gap-3 border-t border-[var(--color-line)] pt-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-xs text-[var(--color-ink-faint)]">
          Page {currentPage} of {totalPages}
        </p>

        {onPageSizeChange && (
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--color-ink-faint)]">
            <span>Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
              className={cn(fieldStyles, "h-8 cursor-pointer py-1")}
              aria-label="Results per page"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-0.5">
          <PaginationButton
            label="Previous page"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prev
          </PaginationButton>

          {pageNumbers.map((page, index) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-1 text-[var(--color-ink-faint)]" aria-hidden="true">
                …
              </span>
            ) : (
              <PaginationButton
                key={page}
                label={`Page ${page}`}
                active={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationButton>
            ),
          )}

          <PaginationButton
            label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </PaginationButton>
        </div>
      )}
    </nav>
  );
}

interface PaginationButtonProps {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function PaginationButton({
  children,
  label,
  active,
  disabled,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-8 min-w-8 rounded-lg px-2.5 text-xs font-semibold",
        interactiveControl,
        focusRing,
        "disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-[var(--color-ink)] text-white hover:bg-[#1a2332]"
          : "text-[var(--color-ink-muted)]",
      )}
    >
      {children}
    </button>
  );
}
