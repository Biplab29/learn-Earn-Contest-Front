import participationReducer, { fetchMyParticipation } from "./participationSlice";

describe("participationSlice Reducers", () => {
  const initialState = {
    history: [],
    summary: {},
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(participationReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle fetchMyParticipation.pending", () => {
    const action = { type: fetchMyParticipation.pending.type };
    const nextState = participationReducer(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it("should handle fetchMyParticipation.fulfilled", () => {
    const payload = {
      history: [{ id: 1, title: "Test Contest" }],
      summary: { total: 1 },
    };
    const action = { type: fetchMyParticipation.fulfilled.type, payload };
    const nextState = participationReducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.history).toEqual(payload.history);
    expect(nextState.summary).toEqual(payload.summary);
  });

  it("should handle fetchMyParticipation.rejected", () => {
    const action = { type: fetchMyParticipation.rejected.type, payload: "Error fetching data" };
    const nextState = participationReducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe("Error fetching data");
  });
});
