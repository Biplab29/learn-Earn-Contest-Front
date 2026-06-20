import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders correctly with logo, quick links, and social icons", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    expect(screen.getByText("DESUN")).toBeInTheDocument();
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
    
    // Verify a known link is present
    expect(screen.getByRole("link", { name: /student login/i })).toBeInTheDocument();
  });
});
