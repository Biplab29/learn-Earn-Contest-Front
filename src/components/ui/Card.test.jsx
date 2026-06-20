import { render, screen } from "@testing-library/react";
import Card from "./Card";

describe("Card Component", () => {
  it("renders children correctly", () => {
    render(<Card><div data-testid="child">Content</div></Card>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders title if provided", () => {
    render(<Card title="Test Title">Content</Card>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders action if provided", () => {
    render(<Card action={<button>Action</button>}>Content</Card>);
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("renders footer if provided", () => {
    render(<Card footer={<span>Footer Text</span>}>Content</Card>);
    expect(screen.getByText("Footer Text")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom-card-class">Content</Card>);
    // The main wrapper is the first child
    expect(container.firstChild).toHaveClass("custom-card-class");
  });
});
