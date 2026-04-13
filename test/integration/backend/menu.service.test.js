import { describe, it, expect, vi } from "vitest";

vi.mock("../../../backend/src/db.js", () => {
  return {
    default: {
      query: vi.fn(),
    },
  };
});

import {
  addCategory,
  createMenuItems,
} from "../../../backend/src/services/menuService.js";

import pool from "../../../backend/src/db.js";

describe("menu service", () => {

  it("should insert category", async () => {
    pool.query.mockResolvedValue({
      rows: [{ name: "Drinks" }],
    });

    const result = await addCategory("Drinks");

    expect(result.name).toBe("Drinks");
  });

  it("should insert menu item", async () => {
    pool.query.mockResolvedValue({
      rows: [{ name: "Rice" }],
    });

    const result = await createMenuItems("Rice", 1, 1);

    expect(result.name).toBe("Rice");
  });

});