import { expect, test } from "@playwright/test";

test("keeps hero content visible when animation freezes after starting", async ({ page }) => {
  await page.addInitScript(() => {
    const requestFrame = window.requestAnimationFrame.bind(window);
    let frozen = false;

    window.requestAnimationFrame = (callback) => {
      if (frozen) return 0;
      return requestFrame(callback);
    };
    Object.assign(window, {
      freezeAnimations() {
        frozen = true;
      },
    });
  });

  await page.goto("/");

  const headingLine = page.getByRole("heading", { level: 1 }).locator("[data-h-line]").first();
  const subhead = page.locator("[data-hero-subhead]");
  const primaryAction = page.getByRole("link", { name: "Explore Rizz" });
  const primaryActionGroup = primaryAction.locator("xpath=ancestor::*[@data-h-fade]");

  await page.waitForFunction(() => {
    const line = document.querySelector<HTMLElement>("[data-h-line]");
    const primaryAction = document.querySelector<HTMLElement>('a[href="#products"]');
    const actionGroup = primaryAction?.closest<HTMLElement>("[data-h-fade]");
    if (!line || !actionGroup) return false;

    const lineStarted = getComputedStyle(line).transform !== "none";
    const actionStarted = Number(getComputedStyle(actionGroup).opacity) < 1;
    return lineStarted && actionStarted;
  });
  await page.evaluate(() => {
    const animationWindow = window as typeof window & { freezeAnimations: () => void };
    animationWindow.freezeAnimations();
  });

  await expect(headingLine).toBeInViewport({ ratio: 0.5 });
  await expect(subhead).toBeVisible();
  await expect(subhead).toBeInViewport({ ratio: 0.5 });
  // Regression: the unbounded fade stranded this group at opacity 0.1018 when frames stopped.
  await expect(primaryActionGroup).toHaveCSS("opacity", /^(0\.[5-9]\d*|1)$/);
  await expect(primaryAction).toBeInViewport({ ratio: 0.5 });
});

test("keeps reveal content visible when animation never starts", async ({ page }) => {
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 0;
  });

  await page.goto("/");

  const manifesto = page.locator("#manifesto");
  const manifestoHeading = manifesto.getByRole("heading", { level: 2 });
  const revealedBody = manifesto.locator("[data-reveal]");

  await expect(manifestoHeading.locator("[data-line-inner]").first()).toHaveCSS("transform", "none");
  await expect(revealedBody).toHaveCSS("opacity", "1");
});
