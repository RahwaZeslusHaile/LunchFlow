import { describe, it, expect, vi } from "vitest";

// mock db (pool + client)
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

// mock dependencies
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
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({}) // INSERT
      .mockResolvedValueOnce({}); // COMMIT

    await saveLeftoversService("2026-01-01", items, 1, "test@mail.com", 10);

    // transaction started
    expect(mockQuery).toHaveBeenNthCalledWith(1, "BEGIN");

    // insert called
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO leftover_food"),
      [1, 2, null, null, 10]
    );

    // commit called
    expect(mockQuery).toHaveBeenNthCalledWith(3, "COMMIT");

    // other services called
    expect(updateSingleStep).toHaveBeenCalledWith(10, 2, "done", 1);
    expect(recordSubmission).toHaveBeenCalled();

  });

  it("should rollback if error occurs", async () => {

    const items = [{ menu_item_id: 1, quantity: 2 }];

    mockQuery
      .mockResolvedValueOnce({}) // BEGIN
      .mockRejectedValueOnce(new Error("DB error")) // INSERT fail
      .mockResolvedValueOnce({}); // ROLLBACK

    await expect(
      saveLeftoversService("2026-01-01", items, 1, "test@mail.com", 10)
    ).rejects.toThrow();

    // rollback called
    expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");

  });

  it("should throw error if order_id missing", async () => {

    await expect(
      saveLeftoversService("2026-01-01", [], 1, "test@mail.com")
    ).rejects.toThrow("order_id is required");

  });

});