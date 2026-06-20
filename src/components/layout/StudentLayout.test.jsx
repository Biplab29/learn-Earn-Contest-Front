import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StudentLayout from "./StudentLayout";

jest.mock("@/components/ui/Sidebar", () => () => <div data-testid="sidebar-mock">Sidebar</div>);
jest.mock("@/features/student/components/StudentPanelHeader", () => () => <div data-testid="student-header-mock">HeaderBar</div>);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("StudentLayout Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Sidebar and StudentPanelHeader", () => {
    render(
      <MemoryRouter initialEntries={["/student/profile"]}>
        <StudentLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
    expect(screen.getByTestId("student-header-mock")).toBeInTheDocument();
  });

  it("hides back button on /student/dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/student/dashboard"]}>
        <StudentLayout />
      </MemoryRouter>
    );

    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();
  });

  it("shows back button on deep routes and handles click", () => {
    render(
      <MemoryRouter initialEntries={["/student/profile"]}>
        <StudentLayout />
      </MemoryRouter>
    );

    const backBtn = screen.getByRole("button", { name: /back/i });
    expect(backBtn).toBeInTheDocument();

    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalled();
  });
});
