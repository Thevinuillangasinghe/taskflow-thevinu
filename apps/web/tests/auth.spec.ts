import { test, expect } from "@playwright/test";

test("signup page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/signup");

  await expect(
    page.getByText("Create Account")
  ).toBeVisible();
});

test("login page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await expect(
    page.getByText("Login to TaskFlow")
  ).toBeVisible();
});

test("user can sign up", async ({ page }) => {
  const uniqueEmail = `playwright${Date.now()}@example.com`;

  await page.goto("http://localhost:3000/signup");

  await page
    .getByPlaceholder("Your name")
    .fill("Playwright User");

  await page
    .getByPlaceholder("you@example.com")
    .fill(uniqueEmail);

  await page
    .getByPlaceholder("Create password")
    .fill("password123");

  await page.getByRole("button", {
    name: "Sign Up",
  }).click();

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });
});

test("user can login", async ({ page }) => {
  const uniqueEmail = `login${Date.now()}@example.com`;

  await page.goto("http://localhost:3000/signup");

  await page
    .getByPlaceholder("Your name")
    .fill("Login User");

  await page
    .getByPlaceholder("you@example.com")
    .fill(uniqueEmail);

  await page
    .getByPlaceholder("Create password")
    .fill("password123");

  await page.getByRole("button", {
    name: "Sign Up",
  }).click();

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await page.goto("http://localhost:3000/login");

  await page
    .getByPlaceholder("you@example.com")
    .fill(uniqueEmail);

  await page
    .getByPlaceholder("Enter password")
    .fill("password123");

  await page.getByRole("button", {
    name: "Login",
  }).click();
});