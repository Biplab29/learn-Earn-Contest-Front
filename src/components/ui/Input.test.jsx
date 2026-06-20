import { render, screen } from "@testing-library/react";
import Input from "./Input";

describe("Input Component", () => {
  it("renders the input field", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders a label if provided", () => {
    render(<Input label="Username" id="username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders an error message if provided", () => {
    render(<Input error="Invalid input" />);
    expect(screen.getByText("Invalid input")).toBeInTheDocument();
  });

  it("renders left and right icons", () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      />
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });
});
