import { describe, expect, it } from "vitest";
import { getPageNumbers, paginateItems } from "@/lib/utils/pagination-utils";

describe("pagination-utils", () => {
  const items = Array.from({ length: 25 }, (_, index) => index + 1);

  it("paginates items correctly", () => {
    const page1 = paginateItems(items, 1, 10);
    expect(page1.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(page1.meta).toEqual({
      currentPage: 1,
      totalPages: 3,
      pageSize: 10,
      totalItems: 25,
      startIndex: 1,
      endIndex: 10,
    });
  });

  it("returns the last partial page", () => {
    const page3 = paginateItems(items, 3, 10);
    expect(page3.items).toEqual([21, 22, 23, 24, 25]);
    expect(page3.meta.endIndex).toBe(25);
  });

  it("clamps invalid page numbers", () => {
    const result = paginateItems(items, 99, 10);
    expect(result.meta.currentPage).toBe(3);
    expect(result.items).toEqual([21, 22, 23, 24, 25]);
  });

  it("handles empty lists", () => {
    const result = paginateItems([], 1, 10);
    expect(result.items).toEqual([]);
    expect(result.meta.totalItems).toBe(0);
    expect(result.meta.startIndex).toBe(0);
    expect(result.meta.endIndex).toBe(0);
  });

  it("builds page numbers with ellipsis", () => {
    expect(getPageNumbers(5, 10)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });
});
