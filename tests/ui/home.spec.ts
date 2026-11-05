// L4 (behaviour against the mock) and L5 (the three visual tiers) for the
// home screen. Runs on chromium and webkit; in CI, on all three OS runners.
import { test, expect } from "@playwright/test";
import { join } from "node:path";
import { greeting } from "../../contracts/greet";
import { assertGeometry, captureGeometry } from "./geometry";

const platform = process.platform; // win32 | darwin | linux

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("backend-badge")).toHaveText("mock");
  await expect(page.getByTestId("platform")).toHaveText("mock / mock");
});

test("greets through the mock backend using the shared contract", async ({ page }) => {
  await page.getByLabel("Name").fill("Keel");
  await page.getByRole("button", { name: "Greet" }).click();
  await expect(page.locator("#greet-msg")).toHaveText(greeting("Keel"));
});

test("clear empties the greeting message and keeps the name", async ({ page }) => {
  await page.getByLabel("Name").fill("Keel");
  await page.getByRole("button", { name: "Greet" }).click();
  await expect(page.locator("#greet-msg")).toHaveText(greeting("Keel"));
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.locator("#greet-msg")).toBeEmpty();
  await expect(page.getByLabel("Name")).toHaveValue("Keel");
});

test("tier 1: accessibility structure is identical everywhere", async ({ page }) => {
  // One YAML baseline for every engine and OS: the semantic tree must not
  // depend on the platform.
  await expect(page.locator("main")).toMatchAriaSnapshot({ name: "home.aria.yml" });
});

test("tier 2: layout geometry stays within tolerance everywhere", async ({ page }) => {
  // One JSON baseline for every engine and OS, compared with an 8px tolerance.
  const actual = await captureGeometry(page);
  assertGeometry(join(test.info().project.testDir, "__snapshots__", "home.spec.ts", "home.geometry.json"), actual);
});

test("tier 3: pixels match the per-engine, per-OS baseline", async ({ page }, testInfo) => {
  // Baselines are captured in CI by the snapshots workflow, never on a laptop.
  await expect(page).toHaveScreenshot(`home-${testInfo.project.name}-${platform}.png`, { fullPage: true });
});
