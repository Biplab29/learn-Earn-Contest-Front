import { render, screen } from "@testing-library/react";
import UserAvatar from "./UserAvatar";

// Mock the util functions
jest.mock("@/utils/userProfile", () => ({
  getUserInitials: jest.fn((name) => (name ? name.substring(0, 2).toUpperCase() : "U")),
  getUserProfileImage: jest.fn((user) => user?.profileImage || null),
}));

describe("UserAvatar Component", () => {
  it("renders an image if user has profile image", () => {
    const user = { name: "John Doe", profileImage: "http://example.com/image.png" };
    render(<UserAvatar user={user} />);
    
    const img = screen.getByAltText("John Doe");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "http://example.com/image.png");
  });

  it("renders an image if src prop is explicitly provided", () => {
    render(<UserAvatar name="Alice" src="http://example.com/alice.png" />);
    
    const img = screen.getByAltText("Alice");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "http://example.com/alice.png");
  });

  it("renders initials if no image is available", () => {
    const user = { name: "Bob Smith" };
    render(<UserAvatar user={user} />);
    
    // Using the mocked getUserInitials which returns first two letters
    expect(screen.getByText("BO")).toBeInTheDocument();
  });

  it("falls back to 'User' if no user name is provided", () => {
    render(<UserAvatar user={null} />);
    expect(screen.getByText("US")).toBeInTheDocument();
    expect(screen.getByLabelText("User")).toBeInTheDocument();
  });
});
