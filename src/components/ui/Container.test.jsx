import { render } from "@testing-library/react";
import Container from "./Container";

describe("Container Component", () => {
  it("renders children correctly", () => {
    const { getByText } = render(<Container>Hello World</Container>);
    expect(getByText("Hello World")).toBeInTheDocument();
  });

  it("applies max-w-[1280px] when fluid is false (default)", () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).toHaveClass("max-w-[1280px]");
    expect(container.firstChild).not.toHaveClass("w-full");
  });

  it("applies w-full when fluid is true", () => {
    const { container } = render(<Container fluid>Content</Container>);
    expect(container.firstChild).toHaveClass("w-full");
    expect(container.firstChild).not.toHaveClass("max-w-[1280px]");
  });

  it("applies custom className", () => {
    const { container } = render(<Container className="custom-container">Content</Container>);
    expect(container.firstChild).toHaveClass("custom-container");
  });
});
