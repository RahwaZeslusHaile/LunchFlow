import { describe, it, expect } from "vitest";
import request from "supertest";

const { default: app } = await import("../../../backend/src/app.js");

describe("Auth Routes", () => {
  it("returns 400 when login username is missing", async () => {
    const response = await request(app)
      .post("http://localhost:4000/api/auth/login")
      .send({ userName: "", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body).toBe("Username is required");
  });
});
