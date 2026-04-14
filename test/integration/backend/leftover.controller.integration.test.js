import { describe, it, expect, vi } from "vitest";

const mockQuery = vi.fn();
const mockClient = {
  query: mockQuery,
  release: vi.fn(),
};

vi.mock("../../../backend/src/db.js", () => ({
  default: {
    connect: vi.fn(() => mockClient),
    query: vi.fn(),
  },
}));

vi.mock("../../../backend/src/services/eventStepsService.js", () => ({
  updateSingleStep: vi.fn(),
}));

vi.mock("../../../backend/src/services/reportService.js", () => ({
  recordSubmission: vi.fn(),
}));

import { saveLeftoversService } from "../../../backend/src/services/leftoverService.js";
import { updateSingleStep } from "../../../backend/src/services/eventStepsService.js";
import { recordSubmission } from "../../../backend/src/services/reportService.js";

describe("saveLeftoversService", () => {

  it("should save leftovers and commit transaction", async () => {

    const items = [{ menu_item_id: 1, quantity: 2 }];

    mockQuery
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}); 

    await saveLeftoversService("2026-01-01", items, 1, "test@mail.com", 10);

    expect(mockQuery).toHaveBeenNthCalledWith(1, "BEGIN");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO leftover_food"),
      [1, 2, null, null, 10]
    );

    expect(mockQuery).toHaveBeenNthCalledWith(3, "COMMIT");

    expect(updateSingleStep).toHaveBeenCalledWith(10, 2, "done", 1);
    expect(recordSubmission).toHaveBeenCalled();

  });

  it("should rollback if error occurs", async () => {

    const items = [{ menu_item_id: 1, quantity: 2 }];

    mockQuery
      .mockResolvedValueOnce({}) 
      .mockRejectedValueOnce(new Error("DB error")) 
      .mockResolvedValueOnce({}); 

    await expect(
      saveLeftoversService("2026-01-01", items, 1, "test@mail.com", 10)
    ).rejects.toThrow();

    expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");

  });

  it("should throw error if order_id missing", async () => {

    await expect(
      saveLeftoversService("2026-01-01", [], 1, "test@mail.com")
    ).rejects.toThrow("order_id is required");

  });

});