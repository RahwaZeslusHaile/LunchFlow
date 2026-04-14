import { describe, it, expect, vi } from "vitest";

vi.mock("../../../backend/src/db.js", () => {
  const mockQuery = vi.fn()
    .mockResolvedValueOnce({ rows: [{ order_id: 100 }] }) 
    .mockResolvedValueOnce({ rows: [{}] }) 
    .mockResolvedValueOnce({ rows: [{}] }) 
    .mockResolvedValueOnce({ rows: [{}] }); 

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

    expect(result).toBe(100);

    const db = await import("../../../backend/src/db.js");
    const mockQuery = db.default.query;

    expect(mockQuery).toHaveBeenCalledTimes(4);

  });

});