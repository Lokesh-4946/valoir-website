import { expect, test } from "@playwright/test";

for (const width of [360, 390]) {
  test.describe(`${width}px viewport`, () => {
    test.use({ viewport: { width, height: 844 } });

    test("does not overflow horizontally", async ({ page }) => {
      await page.goto("/");

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));

      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    });

    test("opens an accessible menu with the primary destinations", async ({ page }) => {
      await page.goto("/");

      await page.getByRole("button", { name: "Menu" }).click();

      const menu = page.getByRole("dialog", { name: "Menu" });
      await expect(menu).toBeVisible();
      await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
      await expect(menu.getByRole("link", { name: "Products" })).toBeVisible();
      await expect(menu.getByRole("link", { name: "Docs" })).toBeVisible();
      await expect(menu.getByRole("link", { name: "Install Rizz" })).toBeVisible();

      const targets = [
        page.getByRole("button", { name: "Menu" }),
        menu.getByRole("link", { name: "Products" }),
        menu.getByRole("link", { name: "Docs" }),
        menu.getByRole("link", { name: "Install Rizz" }),
      ];
      for (const target of targets) {
        const box = await target.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
    });
  });
}

test.describe("mobile menu keyboard behavior", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("closes with Escape and returns focus to the trigger", async ({ page }) => {
    await page.goto("/");

    const trigger = page.locator('button[aria-controls="mobile-menu"]');
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("contains forward and reverse keyboard focus", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();

    const menu = page.getByRole("dialog", { name: "Menu" });
    const firstLink = menu.getByRole("link", { name: "Products" });
    const lastLink = menu.getByRole("link", { name: "Install Rizz" });
    await expect(firstLink).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(lastLink).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(firstLink).toBeFocused();
  });

  test("closes and unlocks scrolling when crossing the desktop breakpoint", async ({ page }) => {
    await page.goto("/");

    const trigger = page.locator('button[aria-controls="mobile-menu"]');
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await page.setViewportSize({ width: 1280, height: 844 });

    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
});
