import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

// Mock the ThemeContext
jest.mock("@/context/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("ThemeToggle Component", () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly in light mode", () => {
    useTheme.mockReturnValue({ dark: false, toggleTheme: mockToggleTheme });
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button", { name: "Toggle theme" });
    expect(button).toBeInTheDocument();
  });

  it("renders correctly in dark mode", () => {
    useTheme.mockReturnValue({ dark: true, toggleTheme: mockToggleTheme });
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button", { name: "Toggle theme" });
    expect(button).toBeInTheDocument();
  });

  it("calls toggleTheme when clicked", () => {
    useTheme.mockReturnValue({ dark: false, toggleTheme: mockToggleTheme });
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button", { name: "Toggle theme" });
    fireEvent.click(button);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
