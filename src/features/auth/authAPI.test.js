import API from "@/services/axios";
import { loginUserApi, logoutUserApi } from "./authAPI";

// Mock the axios instance
jest.mock("@/services/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe("authAPI", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("loginUserApi", () => {
    it("should call API.post with /auth/login and user data", async () => {
      const mockData = { email: "test@example.com", password: "password123" };
      const mockResponse = { data: { accessToken: "token-123" } };
      
      API.post.mockResolvedValueOnce(mockResponse);

      const result = await loginUserApi(mockData);

      expect(API.post).toHaveBeenCalledWith("/auth/login", mockData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("logoutUserApi", () => {
    it("should call API.post with /auth/user/logout and correct Authorization header", async () => {
      const token = "sample-jwt-token";
      const mockResponse = { data: { success: true } };

      API.post.mockResolvedValueOnce(mockResponse);

      const result = await logoutUserApi(token);

      expect(API.post).toHaveBeenCalledWith(
        "/auth/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
