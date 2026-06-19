import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";

describe("shared state components", () => {
  it("LoadingState renders status message", () => {
    render(<LoadingState message="Fetching data..." />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Fetching data...")).toBeInTheDocument();
  });

  it("EmptyState renders title and description", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Try a different search."
      />,
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Try a different search.")).toBeInTheDocument();
  });

  it("ErrorState renders alert with retry button", () => {
    render(<ErrorState message="Network error" onRetry={() => {}} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
