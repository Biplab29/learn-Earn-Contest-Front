import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoginPage from "./LoginPage";
import { loginUser } from "@/features/auth/authSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: "" }),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/features/auth/authSlice", () => ({
  loginUser: jest.fn(),
  fetchCurrentUserProfile: jest.fn(),
}));

describe("LoginPage Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => selector({ auth: { loading: false } }));
  });

  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByText("DESUN ACADEMY")).toBeInTheDocument();
    
    // Inputs
    const inputs = screen.getAllByRole("textbox"); // Email is a textbox
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("disables submit button when fields are empty", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    
    const submitBtn = screen.getByRole("button", { name: /Sign in/i });
    expect(submitBtn).toBeDisabled();
  });

  it("handles successful login", async () => {
    // Setup mock unwrap
    const mockUnwrap = jest.fn().mockResolvedValue({
      _id: "user1",
      accessToken: "token123",
      role: "student",
    });
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Find inputs
    const emailInput = container.querySelector('input[name="email"]');
    const passInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { value: "test@test.com", name: "email" } });
    fireEvent.change(passInput, { target: { value: "password123", name: "password" } });

    const submitBtn = screen.getByRole("button", { name: /Sign in/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUnwrap).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Login as student.");
      expect(mockNavigate).toHaveBeenCalledWith("/student/dashboard");
    });
  });

  it("handles failed login", async () => {
    const mockUnwrap = jest.fn().mockRejectedValue("Invalid credentials");
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: "test@test.com", name: "email" } });
    fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: "wrong", name: "password" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });
});
