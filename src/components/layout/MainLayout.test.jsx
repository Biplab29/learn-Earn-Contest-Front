import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainLayout from "./MainLayout";

// Mock child components
jest.mock("@/components/layout/Header", () => () => <div data-testid="header-mock">Header</div>);
jest.mock("@/components/layout/Footer", () => () => <div data-testid="footer-mock">Footer</div>);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("MainLayout Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Header, Outlet, and Footer for default routes", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <MainLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
    expect(screen.getByTestId("footer-mock")).toBeInTheDocument();
  });

  it("shows back button on non-root routes and navigates back", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <MainLayout />
      </MemoryRouter>
    );
    
    const backBtn = screen.getByRole("button");
    expect(backBtn).toBeInTheDocument();

    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("hides back button on root route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <MainLayout />
      </MemoryRouter>
    );
    
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides header and footer on /student/contest/ routes", () => {
    render(
      <MemoryRouter initialEntries={["/student/contest/123"]}>
        <MainLayout />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("header-mock")).not.toBeInTheDocument();
    expect(screen.queryByTestId("footer-mock")).not.toBeInTheDocument();
  });
});
