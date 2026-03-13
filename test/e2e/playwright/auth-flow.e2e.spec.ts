import { test, expect } from "@playwright/test";

test("auth flow starter", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/Vite|Lunch|CYF/i);
});
