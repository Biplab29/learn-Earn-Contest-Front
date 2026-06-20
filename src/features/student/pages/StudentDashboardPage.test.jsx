import { render, screen } from "@testing-library/react";
import StudentDashboardPage from "./StudentDashboardPage";
import useStudentDashboard from "@/features/student/hooks/useStudentDashboard";

jest.mock("@/features/student/hooks/useStudentDashboard", () => jest.fn());
jest.mock("@/features/student/components/StudentDashboardView", () => {
  return function MockStudentDashboardView(props) {
    return <div data-testid="dashboard-view">{props.mockProp}</div>;
  };
});

describe("StudentDashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders StudentDashboardView with state from hook", () => {
    const mockState = { mockProp: "Hello Dashboard" };
    useStudentDashboard.mockReturnValue(mockState);

    render(<StudentDashboardPage />);

    expect(useStudentDashboard).toHaveBeenCalled();
    const view = screen.getByTestId("dashboard-view");
    expect(view).toBeInTheDocument();
    expect(view).toHaveTextContent("Hello Dashboard");
  });
});
