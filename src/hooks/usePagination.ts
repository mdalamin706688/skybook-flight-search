"use client";

import { useCallback, useMemo, useState } from "react";
import { DEFAULT_PAGE_SIZE, type PageSize } from "@/lib/constants/pagination";
import { paginateItems } from "@/lib/utils/pagination-utils";

function getItemsSignature<T>(items: T[]): string {
  return items
    .map((item) =>
      typeof item === "object" && item !== null && "id" in item
        ? String((item as { id: string }).id)
        : JSON.stringify(item),
    )
    .join("|");
}

export function usePagination<T>(items: T[], initialPageSize: PageSize = DEFAULT_PAGE_SIZE) {
  const [pageSize, setPageSize] = useState<PageSize>(initialPageSize);
  const [pageBySignature, setPageBySignature] = useState<Record<string, number>>({});

  const itemsSignature = useMemo(() => getItemsSignature(items), [items]);
  const pageSizeSignature = `${itemsSignature}:${pageSize}`;
  const currentPage = pageBySignature[pageSizeSignature] ?? 1;

  const { items: paginatedItems, meta } = useMemo(
    () => paginateItems(items, currentPage, pageSize),
    [items, currentPage, pageSize],
  );

  const goToPage = useCallback(
    (page: number) => {
      setPageBySignature((prev) => ({ ...prev, [pageSizeSignature]: page }));
    },
    [pageSizeSignature],
  );

  const changePageSize = useCallback(
    (size: PageSize) => {
      setPageSize(size);
      setPageBySignature((prev) => ({ ...prev, [`${itemsSignature}:${size}`]: 1 }));
    },
    [itemsSignature],
  );

  return {
    paginatedItems,
    meta,
    goToPage,
    changePageSize,
  };
}
