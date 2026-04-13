import { describe, it, expect, vi } from "vitest";

vi.mock("../../../backend/src/db.js", () => {
  const mockQuery = vi.fn()
    .mockResolvedValueOnce({ rows: [{ order_id: 100 }] }) // createOrder
    .mockResolvedValueOnce({ rows: [{}] }) // step 1
    .mockResolvedValueOnce({ rows: [{}] }) // step 2
    .mockResolvedValueOnce({ rows: [{}] }); // step 3

  return {
    default: {
      query: mockQuery,
    },
  };
});

import { createOrderWithSteps } from "../../../backend/src/services/orderService.js";

describe("createOrderWithSteps", () => {

  it("should create order and 3 steps", async () => {

    const result = await createOrderWithSteps("2026-01-01", 0, 1);

    //  return value
    expect(result).toBe(100);

    //  get mock
    const db = await import("../../../backend/src/db.js");
    const mockQuery = db.default.query;

    // total calls (1 + 3)
    expect(mockQuery).toHaveBeenCalledTimes(4);

  });

});