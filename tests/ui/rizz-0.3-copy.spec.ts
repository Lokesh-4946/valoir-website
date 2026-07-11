import { expect, test } from "@playwright/test";

test("homepage presents the source-backed Rizz 0.3 release", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Rizz 0.3.0", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("Requires Node >= 22, npm, and git.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("SQLAlchemy, Alembic, raw SQL, and Mongoose", { exact: false }).first(),
  ).toBeVisible();
  await expect(page.getByText("cross-table blast radius", { exact: false })).toBeVisible();
  await expect(page.getByText("deterministic verification plans", { exact: false })).toBeVisible();
});

test("docs identify 0.3.0 and its complete public prerequisites", async ({ page }) => {
  await page.goto("/docs/quickstart");

  await expect(
    page.getByText("Rizz 0.3.0 is the current release.", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("Node ≥ 22, npm, and git", { exact: false })).toBeVisible();
});

test("roadmap keeps shipped review evidence out of Next", async ({ page }) => {
  await page.goto("/");

  const roadmap = page.locator("#roadmap");
  const nextLane = roadmap.getByText("Next", { exact: true }).locator("..");
  await expect(nextLane.getByText("evidence scoring", { exact: true })).toHaveCount(0);
  await expect(nextLane.getByText("relationship-aware review", { exact: true })).toHaveCount(0);
  await expect(roadmap).not.toContainText("Repo Brain");
});
