import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchForm } from "@/components/search/SearchForm";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/store/booking-store", () => ({
  useBookingStore: (selector: (state: { setSearchParams: () => void }) => unknown) =>
    selector({ setSearchParams: vi.fn() }),
}));

describe("SearchForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });
  it("renders search fields", () => {
    render(<SearchForm />);
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/depart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/travelers/i)).toBeInTheDocument();
  });

  it("navigates to search results on valid submit", async () => {
    render(<SearchForm />);
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    expect(pushMock).toHaveBeenCalledWith(
      expect.stringContaining("/search?origin=JFK&destination=LAX"),
    );
  });

  it("shows validation error when origin equals destination", async () => {
    render(<SearchForm />);
    await userEvent.selectOptions(screen.getByLabelText(/from/i), "LAX");
    await userEvent.selectOptions(screen.getByLabelText(/to/i), "LAX");
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    expect(screen.getByText(/origin and destination must differ/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
