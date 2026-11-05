// L6: the real shell. The debug binary is launched by @wdio/tauri-service and
// driven through the embedded WebDriver server. Everything here crosses the
// IPC boundary to Rust, which no browser-mode test can do.
import { browser, $, expect } from "@wdio/globals";
import "@wdio/native-types";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

type PlatformInfo = {
  os: string;
  arch: string;
  family: string;
  debug: boolean;
};

describe("spike in the real shell", () => {
  it("renders the main window", async () => {
    await expect($("h1")).toHaveText("Welcome to Tauri");
    await expect($("#greet-input")).toBeDisplayed();
  });

  it("round-trips a command to Rust", async () => {
    await $("#greet-input").setValue("Keel");
    await $("#greet-form button").click();
    await expect($("#greet-msg")).toHaveText(
      "Hello, Keel! You've been greeted from Rust!",
    );
  });

  it("reports the platform and saves a screenshot named after it", async () => {
    const info = (await browser.tauri.execute(({ core }) =>
      core.invoke("platform_info"),
    )) as PlatformInfo;
    expect(["windows", "macos", "linux"]).toContain(info.os);
    expect(["x86_64", "aarch64"]).toContain(info.arch);
    expect(info.debug).toBe(true);

    const dir = join(process.cwd(), "artifacts", "e2e");
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `${info.os}-${info.arch}.png`);
    await browser.saveScreenshot(file);
    console.log(`[e2e] screenshot saved: ${file}`);
  });
});
