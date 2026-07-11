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
