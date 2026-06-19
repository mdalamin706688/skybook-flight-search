import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingForm } from "@/components/booking/BookingForm";

afterEach(() => {
  cleanup();
});

describe("BookingForm", () => {
  it("shows validation errors for empty submission", async () => {
    const onSubmit = vi.fn();
    render(<BookingForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(screen.getByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Last name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form data", async () => {
    const onSubmit = vi.fn();
    render(<BookingForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/first name/i), "Jane");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/phone/i), "555-123-4567");
    await userEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "555-123-4567",
    });
  });
});
