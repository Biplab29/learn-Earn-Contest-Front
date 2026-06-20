import authReducer, { logout } from "./authSlice";

// We mock the authStorage and userProfile utilities so we can test the reducer logic cleanly.
jest.mock("@/utils/authStorage", () => ({
  clearAuthSession: jest.fn(),
  getAuthRole: jest.fn(),
  getAuthToken: jest.fn(),
  getStoredUser: jest.fn(() => null),
  persistAuthSession: jest.fn(),
}));

jest.mock("@/utils/userProfile", () => ({
  normalizeUserProfileData: jest.fn((user) => user),
  saveLocalUserProfileMeta: jest.fn(),
}));

describe("authSlice Reducers", () => {
  const initialState = {
    user: null,
    loading: false,
    error: null,
  };

  it("should return initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle logout action correctly", () => {
    const loggedInState = {
      user: { id: "1", name: "John" },
      loading: false,
      error: null,
    };

    const nextState = authReducer(loggedInState, logout());

    expect(nextState.user).toBeNull();
    expect(nextState.error).toBeNull();
    expect(nextState.loading).toBe(false);
  });
});
