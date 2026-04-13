import { describe, it, expect, vi } from "vitest";

// mock db
const mockQuery = vi.fn();
const mockClient = {
  query: mockQuery,
  release: vi.fn(),
};

vi.mock("../../../backend/src/db.js", () => ({
  default: {
    connect: vi.fn(() => mockClient),
  },
}));

vi.mock("../../../backend/src/services/eventStepsService.js", () => ({
  updateSingleStep: vi.fn(),
}));

vi.mock("../../../backend/src/services/reportService.js", () => ({
  recordSubmission: vi.fn(),
}));

import { insertAttendance } from "../../../backend/src/services/attendanceService.js";
import { updateSingleStep } from "../../../backend/src/services/eventStepsService.js";

describe("insertAttendance", () => {

  it("should insert attendance successfully", async () => {

    mockQuery
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [{ attendance_id: 10 }] }) // INSERT
      .mockResolvedValueOnce({}); // COMMIT

    const result = await insertAttendance({
      class_id: 1,
      trainee_count: 2,
      volunteer_count: 1,
      halal_count: 0,
      veg_count: 0,
      userId: 1,
      email: "test@mail.com",
      order_id: 99,
    });

    expect(result.attendance_id).toBe(10);
    expect(mockQuery).toHaveBeenCalledWith("COMMIT");
    expect(updateSingleStep).toHaveBeenCalled();

  });

});






