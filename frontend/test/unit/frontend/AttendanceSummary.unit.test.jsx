import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import AttendanceSummary from "../../../src/components/AttendanceSummary";

describe("AttendanceSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends correct payload to API", async () => {
    const mockFetch = vi.fn((url) => {
      if (url === "/api/classes") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([{ class_id: 2, name: "ITP" }]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    global.fetch = mockFetch;

    render(<AttendanceSummary order_id={5} />);

    await waitFor(() => {
      expect(screen.getByText("ITP")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "ITP" },
    });

    const inputs = screen.getAllByRole("spinbutton");

    fireEvent.change(inputs[0], {
      target: { value: "10" },
    });

    fireEvent.change(inputs[inputs.length - 1], {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/attendance",
        expect.any(Object)
      );
    });

    const call = mockFetch.mock.calls.find(
      (c) => c[0] === "/api/attendance"
    );

    const [, options] = call;

    const body = JSON.parse(options.body);

    expect(body).toEqual({
      class_id: 2,
      trainee_count: 10,
      volunteer_count: 2,
      halal_count: 0,
      veg_count: 0,
      order_id: 5,
    });
  });
});