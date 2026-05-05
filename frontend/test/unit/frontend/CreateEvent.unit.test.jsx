import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import CreateEvent from "../../../src/components/CreateEvent";

describe("CreateEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends correct payload to API", async () => {
    const mockJson = vi.fn(() => Promise.resolve({ order_id: 1 }));

    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: mockJson,
      })
    );

    global.fetch = mockFetch;

    render(<CreateEvent />);

    fireEvent.click(screen.getByText(/Create Event/i));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockJson).toHaveBeenCalled();
    });

    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toBe("/api/order/event");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");

    const body = JSON.parse(options.body);

    expect(body).toEqual({
      order_date: expect.any(String),
      attendance: 0,
      assigned_admin: 1,
    });
  });
});