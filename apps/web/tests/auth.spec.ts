import { test, expect } from "@playwright/test";

test("signup page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/signup", {
    waitUntil: "networkidle",
  });

  await expect(page.locator("body")).toContainText(/create account|sign up/i);
});

test("login page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/login", {
    waitUntil: "networkidle",
  });

  await expect(page.locator("body")).toContainText(/login/i);
});

test("user can sign up", async ({ page }) => {
  const uniqueEmail = `playwright${Date.now()}@example.com`;

  await page.goto("http://localhost:3000/signup", {
    waitUntil: "networkidle",
  });

  await page.getByPlaceholder("Your name").fill("Playwright User");
  await page.getByPlaceholder("you@example.com").fill(uniqueEmail);
  await page.getByPlaceholder("Create password").fill("password123");

  await page.getByRole("button", { name: /sign up/i }).click();

  await expect(page).toHaveURL(/login/, {
    timeout: 10000,
  });
});

test("user can login", async ({ page }) => {
  const uniqueEmail = `login${Date.now()}@example.com`;

  await page.goto("http://localhost:3000/signup", {
    waitUntil: "networkidle",
  });

  await page.getByPlaceholder("Your name").fill("Login User");
  await page.getByPlaceholder("you@example.com").fill(uniqueEmail);
  await page.getByPlaceholder("Create password").fill("password123");

  await page.getByRole("button", { name: /sign up/i }).click();

  await expect(page).toHaveURL(/login/, {
    timeout: 10000,
  });

  await page.getByPlaceholder("you@example.com").fill(uniqueEmail);
  await page.getByPlaceholder("Enter password").fill("password123");

  await page.getByRole("button", { name: /login/i }).click();

  await expect(page).toHaveURL(/board/, {
    timeout: 10000,
  });
});