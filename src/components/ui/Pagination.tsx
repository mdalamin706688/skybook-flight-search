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

  return (
    <nav
      aria-label="Flight results pagination"
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-medium text-slate-900">
            {startIndex}–{endIndex}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-900">{totalItems}</span> flights
        </p>

        {onPageSizeChange && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <span>Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
              className={cn(fieldStyles, "min-h-10 cursor-pointer py-1.5")}
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

      {variant === "full" && totalPages > 1 && (
        <div className="flex max-w-full items-center gap-1 overflow-x-auto pb-1">
          <PaginationButton
            label="Previous page"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prev
          </PaginationButton>

          {pageNumbers.map((page, index) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-slate-400"
                aria-hidden="true"
              >
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
        "min-h-11 min-w-[2.75rem] shrink-0 rounded-md px-3 py-2 text-sm font-medium",
        interactiveControl,
        focusRing,
        "disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-sky-600 text-white hover:bg-sky-700"
          : "text-slate-700 hover:bg-slate-100",
      )}
    >
      {children}
    </button>
  );
}
