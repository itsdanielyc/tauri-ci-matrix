# Verification ledger

Append-only. Each row says what was proven, where, and by which run. "Built"
is never rounded up to "tested"; anything not listed here is unverified.

| Date | Level | Claim | Platforms | Evidence |
|---|---|---|---|---|
| 2026-11-05 | L6 real shell | Debug binary launches, the UI reaches Rust over IPC, `platform_info` reports the runner's OS and CPU, and a WebDriver screenshot is captured, all through the embedded provider (`@wdio/tauri-service` 1.5.1, `tauri-plugin-wdio-webdriver` 1.5.1) | ubuntu-latest (x64), ubuntu-24.04-arm, windows-latest (x64), windows-11-arm, macos-latest (arm64), macos-15-intel | [run 42017048774](https://github.com/itsdanielyc/tauri-ci-matrix/actions/runs/42017048774), 6 of 6 jobs green; artifacts `e2e-<os>` hold `<os>-<arch>.png` |
| 2026-11-05 | L6 real shell | Same suite locally on the developer machine (Windows 11, WebView2 156) in 3 s | windows x86_64 | local run, `artifacts/e2e/windows-x86_64.png` |
| 2026-11-05 | L1/L2 | Mock backend conforms to `contracts/greet.ts`; the real-shell suite asserts Rust against the same contract | all of the above | `npm run test:unit` locally; L6 run above |
| 2026-11-05 | L4/L5 | Playwright on chromium and webkit against the mock: behaviour, ARIA snapshot (one shared baseline), layout geometry (one shared baseline, 8 px tolerance) pass on both engines | windows x86_64 (local) | local run; CI result pending in pull request 1 |

## Unverified

- Pixel baselines (tier 3) do not exist yet; the `snapshots` workflow creates them on the runners.
- Installer round trips (L7) are written (`scripts/installer-test.*`, `installers.yml`) and not yet run.
- Nothing is signed or notarized.
