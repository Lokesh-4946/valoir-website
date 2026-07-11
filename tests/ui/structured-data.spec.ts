import { expect, test } from "@playwright/test";

test("lists every supported Rizz operating system", async ({ page }) => {
  await page.goto("/");

  const graph = await page.locator('script[type="application/ld+json"]').evaluate((script) => {
    return JSON.parse(script.textContent ?? "{}") as {
      "@graph"?: Array<{ "@type"?: string | string[]; operatingSystem?: string }>;
    };
  });
  const software = graph["@graph"]?.find((entry) => {
    const types = Array.isArray(entry["@type"]) ? entry["@type"] : [entry["@type"]];
    return types.includes("SoftwareApplication");
  });

  expect(software?.operatingSystem).toBe("macOS, Linux, Windows");
});

test("metadata uses the source-backed Project Intelligence category", async ({ page }) => {
  await page.goto("/");
  const keywords = await page.locator('meta[name="keywords"]').getAttribute("content");
  expect(keywords).toContain("Project Intelligence Engine");
  expect(keywords).toContain("repository understanding");
  expect(keywords).not.toContain("coding agent harness");
});
