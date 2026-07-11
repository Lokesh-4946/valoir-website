import { expect, test } from "@playwright/test";

test("homepage presents the source-backed Rizz 0.3.1 release", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Rizz 0.3.1", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("Requires Node >= 22, npm, and git.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("SQLAlchemy, Alembic, raw SQL, and Mongoose", { exact: false }).first(),
  ).toBeVisible();
  await expect(page.getByText("cross-table blast radius", { exact: false })).toBeVisible();
  await expect(page.getByText("deterministic verification plans", { exact: false })).toBeVisible();
  await expect(page.getByText("signoff expiry and revocation", { exact: true })).toBeVisible();
  await expect(page.getByText("evidence-backed Next.js route consumers", { exact: false })).toBeVisible();
});

test("docs identify 0.3.1 and its complete public prerequisites", async ({ page }) => {
  await page.goto("/docs/quickstart");

  await expect(
    page.getByText("Rizz 0.3.1 is the current release.", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("Node ≥ 22, npm, and git", { exact: false })).toBeVisible();
});

test("roadmap places the complete shipped intelligence set in Now, not Next", async ({ page }) => {
  await page.goto("/");

  const roadmap = page.locator("#roadmap");
  const nowLane = roadmap.getByText("Now", { exact: true }).locator("..");
  const nextLane = roadmap.getByText("Next", { exact: true }).locator("..");
  const shippedCapabilities = [
    "database relationships",
    "relationship-aware review",
    "verification plans",
    "evidence scoring",
    "approval packets",
    "CLI signoff",
  ];

  for (const capability of shippedCapabilities) {
    await expect(nowLane.getByText(capability, { exact: true })).toBeVisible();
    await expect(nextLane.getByText(capability, { exact: true })).toHaveCount(0);
  }

  await expect(roadmap).not.toContainText("Repo Brain");
});

test("site does not assert an undeclared Rizz license", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("License not declared", { exact: true })).toBeVisible();
  await expect(page.getByText("open-core", { exact: false })).toHaveCount(0);
});
