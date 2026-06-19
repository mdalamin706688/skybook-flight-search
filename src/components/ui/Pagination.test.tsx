import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "@/components/ui/Pagination";

const meta = {
  currentPage: 2,
  totalPages: 4,
  pageSize: 10,
  totalItems: 31,
  startIndex: 11,
  endIndex: 20,
};

describe("Pagination", () => {
  it("renders result summary", () => {
    render(<Pagination meta={meta} onPageChange={vi.fn()} />);
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByText(/11.20/)).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
  });

  it("calls onPageChange when a page is selected", async () => {
    const onPageChange = vi.fn();
    render(<Pagination meta={meta} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole("button", { name: /page 3/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables previous on the first page", () => {
    render(
      <Pagination
        meta={{ ...meta, currentPage: 1, startIndex: 1, endIndex: 10 }}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
  });
});
