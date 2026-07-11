import { expect, test } from "@playwright/test";

test("keeps primary content visible when animation frames do not complete", async ({ page }) => {
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 0;
  });

  await page.goto("/");

  const heading = page.getByRole("heading", { level: 1 });
  const primaryAction = page.getByRole("link", { name: "Explore Rizz" });
  const manifestoHeading = page.getByRole("heading", {
    level: 2,
    name: "Small by default. Routes you can see. Power only when asked.",
  });
  const revealedBody = page.locator("[data-reveal]").filter({
    hasText:
      "The default view should stay quiet. Routing, cost, and workspace power stay visible without turning the harness into the product.",
  });

  await expect(heading.locator("[data-h-line]").first()).toHaveCSS("transform", "none");
  await expect(primaryAction.locator("xpath=ancestor::*[@data-h-fade]")).toHaveCSS("opacity", "1");
  await expect(manifestoHeading.locator("[data-line-inner]").first()).toHaveCSS("transform", "none");
  await expect(revealedBody).toHaveCSS("opacity", "1");
});
