import { expect, test } from "@playwright/test";

test("does not start hero motion for reduced-motion users", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      const mediaQuery = nativeMatchMedia(query);
      const calledFromMediaHook = new Error().stack?.includes("useMediaQuery");
      if (query !== "(prefers-reduced-motion: reduce)" || !calledFromMediaHook) {
        return mediaQuery;
      }

      // Model the hydration window where the React hook still exposes its
      // server fallback even though the browser preference already matches.
      return new Proxy(mediaQuery, {
        get(target, property) {
          if (property === "matches") return false;
          const value = Reflect.get(target, property, target);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    };
    Object.assign(window, { heroTransformMutations: 0 });

    document.addEventListener("DOMContentLoaded", () => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (!(mutation.target instanceof HTMLElement)) continue;
          if (!mutation.target.matches("[data-h-line]")) continue;
          if (!mutation.target.style.transform) continue;

          const animationWindow = window as typeof window & {
            heroTransformMutations: number;
          };
          animationWindow.heroTransformMutations += 1;
        }
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["style"],
        subtree: true,
      });
    });
  });

  await page.goto("/");
  await page.waitForTimeout(2_000);

  const transformMutations = await page.evaluate(() => {
    const animationWindow = window as typeof window & {
      heroTransformMutations: number;
    };
    return animationWindow.heroTransformMutations;
  });
  expect(transformMutations).toBe(0);
});

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
