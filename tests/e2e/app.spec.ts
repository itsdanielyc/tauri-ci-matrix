// L6: the real shell. The debug binary is launched by @wdio/tauri-service and
// driven through the embedded WebDriver server. Everything here crosses the
// IPC boundary to Rust, which no browser-mode test can do.
import { browser, $, expect } from "@wdio/globals";
import "@wdio/native-types";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { greeting } from "../../contracts/greet.js";

type PlatformInfo = {
  os: string;
  arch: string;
  family: string;
  debug: boolean;
};

describe("spike in the real shell", () => {
  it("renders the main window with the native backend", async () => {
    await expect($("h1")).toHaveText("Welcome to Tauri");
    await expect($("#greet-input")).toBeDisplayed();
    // The badge proves the UI is talking to Rust, not to the labelled mock.
    await expect($('[data-testid="backend-badge"]')).toHaveText("native");
  });

  it("round-trips a command to Rust and matches the shared contract", async () => {
    await $("#greet-input").setValue("Keel");
    await $("#greet-form button").click();
    await expect($("#greet-msg")).toHaveText(greeting("Keel"));
  });

  it("reports the platform and saves a screenshot named after it", async () => {
    const info = (await browser.tauri.execute(({ core }) =>
      core.invoke("platform_info"),
    )) as PlatformInfo;
    expect(["windows", "macos", "linux"]).toContain(info.os);
    expect(["x86_64", "aarch64"]).toContain(info.arch);
    expect(info.debug).toBe(true);
    await expect($('[data-testid="platform"]')).toHaveText(`${info.os} / ${info.arch}`);

    const dir = join(process.cwd(), "artifacts", "e2e");
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `${info.os}-${info.arch}.png`);
    await browser.saveScreenshot(file);
    console.log(`[e2e] screenshot saved: ${file}`);
  });
});
