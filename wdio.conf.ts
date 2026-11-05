// WebdriverIO configuration for the real-shell (L6) suite.
// Runs the debug binary with the embedded WebDriver provider, which needs no
// external driver on Windows, Linux or macOS.
import { existsSync, mkdirSync } from "node:fs";
import path, { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const productName = "spike";
const targetDir = join(__dirname, "src-tauri", "target", "debug");
const appBinaryPath =
  process.platform === "win32"
    ? join(targetDir, `${productName}.exe`)
    : join(targetDir, productName);

if (!existsSync(appBinaryPath)) {
  throw new Error(
    `Tauri debug binary not found at ${appBinaryPath}. Run: npm run build:debug`,
  );
}

mkdirSync(join(__dirname, "artifacts", "e2e"), { recursive: true });

export const config = {
  runner: "local",
  specs: ["./tests/e2e/**/*.spec.ts"],
  maxInstances: 1,
  capabilities: [
    {
      browserName: "tauri",
      "tauri:options": { application: appBinaryPath },
      "wdio:tauriServiceOptions": {
        appBinaryPath,
        appArgs: [],
        captureBackendLogs: true,
        captureFrontendLogs: true,
      },
    },
  ],
  services: [
    [
      "@wdio/tauri-service",
      {
        driverProvider: "embedded" as const,
        captureBackendLogs: true,
        captureFrontendLogs: true,
        startTimeout: 90_000,
      },
    ],
  ],
  logLevel: (process.env.DEBUG ? "debug" : "info") as "debug" | "info",
  outputDir: path.join(__dirname, "artifacts", "e2e", "logs"),
  bail: 0,
  baseUrl: "",
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: { ui: "bdd", timeout: 60_000 },
  tsConfigPath: path.join(__dirname, "tests", "e2e", "tsconfig.json"),
};
