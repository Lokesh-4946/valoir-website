import { expect, test } from "@playwright/test";

test("presents one primary and one secondary hero action", async ({ page }) => {
  await page.goto("/");

  const hero = page.locator("#top");
  const actions = hero.locator("[data-hero-actions]");

  await expect(actions.locator('[data-action-priority="primary"]')).toHaveCount(1);
  await expect(actions.locator('[data-action-priority="secondary"]')).toHaveCount(1);
  await expect(actions.getByRole("link", { name: "Explore Rizz" })).toBeVisible();
  await expect(actions.getByRole("link", { name: "Read docs" })).toBeVisible();
});

test("keeps install and GitHub discoverable as supporting actions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const supportingActions = page.locator("#top [data-hero-supporting-actions]");

  await expect(supportingActions.getByText("npm install -g @valoir/rizz")).toBeVisible();
  await expect(supportingActions.getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 390);
});
