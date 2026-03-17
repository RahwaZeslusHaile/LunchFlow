import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminInvitePage from "../../../src/components/AdminInvitePage.jsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AdminInvitePage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it("redirects non-admin users to login", () => {
    localStorage.setItem("user", JSON.stringify({ email: "user@test.com", roleId: 2 }));

    render(
      <MemoryRouter>
        <AdminInvitePage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
