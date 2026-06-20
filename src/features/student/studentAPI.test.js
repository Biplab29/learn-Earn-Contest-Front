import { getStudentDashboard } from "./studentAPI";

describe("studentAPI", () => {
  it("getStudentDashboard should return mock dashboard data", async () => {
    const data = await getStudentDashboard();
    
    expect(data).toHaveProperty("user");
    expect(data.user).toHaveProperty("name", "Aarav");
    expect(data).toHaveProperty("featured");
    expect(data.featured.length).toBeGreaterThan(0);
    expect(data).toHaveProperty("participation");
    expect(data).toHaveProperty("deadlines");
    expect(data).toHaveProperty("progress");
  });
});
