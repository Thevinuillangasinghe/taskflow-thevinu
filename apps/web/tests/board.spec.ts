import { test, expect } from "@playwright/test";

test("login page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await expect(
    page.getByRole("button", { name: "Login" })
  ).toBeVisible();
});