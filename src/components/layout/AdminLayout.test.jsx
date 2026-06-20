import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLayout from "./AdminLayout";

jest.mock("@/components/ui/Sidebar", () => () => <div data-testid="sidebar-mock">Sidebar</div>);
jest.mock("@/features/admin/components/AdminHeaderBar", () => () => <div data-testid="admin-header-mock">HeaderBar</div>);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("AdminLayout Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Sidebar and AdminHeaderBar", () => {
    render(
      <MemoryRouter initialEntries={["/admin/settings"]}>
        <AdminLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
    expect(screen.getByTestId("admin-header-mock")).toBeInTheDocument();
  });

  it("hides back button on /admin/dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AdminLayout />
      </MemoryRouter>
    );

    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();
  });

  it("shows back button on deep routes and handles click", () => {
    render(
      <MemoryRouter initialEntries={["/admin/settings"]}>
        <AdminLayout />
      </MemoryRouter>
    );

    const backBtn = screen.getByRole("button", { name: /back/i });
    expect(backBtn).toBeInTheDocument();

    fireEvent.click(backBtn);
    // Because window.history.length is 1 in JSDOM MemoryRouter by default, it handles fallback to dashboard.
    // So we check if navigate was called
    expect(mockNavigate).toHaveBeenCalled();
  });
});
