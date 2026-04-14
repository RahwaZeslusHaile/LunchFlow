import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrderManagement from "../../../src/components/OrderManagement";

describe("OrderManagement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "test-token");
  });

  it("submits order with correct payload", async () => {
    const mockFetch = vi.fn((url) => {
      if (url === "/api/order/active") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              order_id: 1,
              order_date: "2025-01-01",
            }),
        });
      }

      if (url === "/api/menu/menu-items") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                menu_item_id: 10,
                name: "Bread",
                category: "Bakery & Bases",
              },
            ]),
        });
      }

      if (url.includes("/api/eventStep")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { step_position: 1, step_status: "done" },
              { step_position: 2, step_status: "done" },
              { step_position: 3, step_status: "pending" },
            ]),
        });
      }

      if (url.includes("/api/leftovers")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }

      if (url.includes("/api/attendance/stats")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              total_attendance: 20,
              total_halal: 5,
              total_veg: 3,
            }),
        });
      }

      if (url === "/api/order") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ message: "Order saved successfully" }),
        });
      }

      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    global.fetch = mockFetch;

    render(<OrderManagement />);

    await waitFor(() => {
      expect(screen.getByText("Bread")).toBeInTheDocument();
    });

    const bread = screen.getByText("Bread");

    const plusButton = bread.parentElement.parentElement.parentElement
      .querySelectorAll("button")[1];

    fireEvent.click(plusButton);

    await waitFor(() => {
      expect(screen.getByText("x1")).toBeInTheDocument();
    });

    const submitBtn = screen.getByText(/Confirm & Submit Order/i);

    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        mockFetch.mock.calls.some(c => c[0] === "/api/order")
      ).toBe(true);
    });

    const call = mockFetch.mock.calls.find(c => c[0] === "/api/order");

    const [, options] = call;

    const body = JSON.parse(options.body);

    expect(body).toEqual({
      order_id: 1,
      date: "2025-01-01",
      attendance: 20,
      items: [
        {
          menu_item_id: 10,
          quantity: 1,
        },
      ],
    });
  });
});