import Cookies from "js-cookie";
import {
  getAuthToken,
  getAuthRole,
  getStoredUser,
  persistAuthSession,
  clearAuthSession,
  isAuthenticated,
} from "./authStorage";

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe("authStorage utility", () => {
  beforeEach(() => {
    // Clear mocks and localStorage before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("getAuthToken should return token from Cookies if exists", () => {
    Cookies.get.mockReturnValue("cookie-token");
    expect(getAuthToken()).toBe("cookie-token");
  });

  it("getAuthToken should fallback to localStorage if Cookie is empty", () => {
    Cookies.get.mockReturnValue(undefined);
    localStorage.setItem("token", "local-token");
    expect(getAuthToken()).toBe("local-token");
  });

  it("getStoredUser should parse and return user from localStorage", () => {
    const user = { id: 1, name: "Test" };
    localStorage.setItem("user", JSON.stringify(user));
    expect(getStoredUser()).toEqual(user);
  });

  it("getStoredUser should return null if invalid JSON", () => {
    localStorage.setItem("user", "invalid-json");
    expect(getStoredUser()).toBeNull();
  });

  it("persistAuthSession should set Cookies and localStorage", () => {
    const sessionData = {
      accessToken: "new-token",
      role: "admin",
      user: { _id: "user-123", name: "Admin" },
    };

    persistAuthSession(sessionData);

    expect(Cookies.set).toHaveBeenCalledWith("token", "new-token", expect.any(Object));
    expect(Cookies.set).toHaveBeenCalledWith("role", "admin", expect.any(Object));
    expect(localStorage.getItem("token")).toBe("new-token");
    expect(localStorage.getItem("role")).toBe("admin");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(sessionData.user);
    expect(localStorage.getItem("userId")).toBe("user-123");
  });

  it("clearAuthSession should remove all auth data", () => {
    localStorage.setItem("token", "token");
    localStorage.setItem("role", "role");
    localStorage.setItem("user", "user");
    localStorage.setItem("userId", "userId");

    clearAuthSession();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(Cookies.remove).toHaveBeenCalledWith("token", { path: "/" });
    expect(Cookies.remove).toHaveBeenCalledWith("role", { path: "/" });
  });

  it("isAuthenticated should return true if token exists", () => {
    Cookies.get.mockReturnValue("token");
    expect(isAuthenticated()).toBe(true);
  });
});
