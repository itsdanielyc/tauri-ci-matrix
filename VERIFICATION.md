# Verification ledger

Append-only. Each row says what was proven, where, and by which run. "Built"
is never rounded up to "tested"; anything not listed here is unverified.

| Date | Level | Claim | Platforms | Evidence |
|---|---|---|---|---|
| 2026-11-05 | L6 real shell | Debug binary launches, the UI reaches Rust over IPC, `platform_info` reports the runner's OS and CPU, and a WebDriver screenshot is captured, all through the embedded provider (`@wdio/tauri-service` 1.5.1, `tauri-plugin-wdio-webdriver` 1.5.1) | ubuntu-latest (x64), ubuntu-24.04-arm, windows-latest (x64), windows-11-arm, macos-latest (arm64), macos-15-intel | [run 42017048774](https://github.com/itsdanielyc/tauri-ci-matrix/actions/runs/42017048774), 6 of 6 jobs green; artifacts `e2e-<os>` hold `<os>-<arch>.png` |
| 2026-11-05 | L6 real shell | Same suite locally on the developer machine (Windows 11, WebView2 156) in 3 s | windows x86_64 | local run, `artifacts/e2e/windows-x86_64.png` |
| 2026-11-05 | L1/L2 | Mock backend conforms to `contracts/greet.ts`; the real-shell suite asserts Rust against the same contract | all of the above | `npm run test:unit` locally; L6 run above |
| 2026-11-05 | L4/L5 | Playwright on chromium and webkit against the mock: behaviour, ARIA snapshot (one shared baseline), layout geometry (one shared baseline, 8 px tolerance) pass on both engines | windows x86_64 (local); ubuntu-latest, windows-latest, macos-latest in CI, chromium and webkit each | local run; [run 42017929420](https://github.com/itsdanielyc/tauri-ci-matrix/actions/runs/42017929420): the only failures are tier 3 "snapshot doesn't exist" on every OS, so the ARIA baseline and the geometry baseline captured on Windows held on all three OSes and both engines |

| 2026-11-05 | L5 tier 3 | Per-engine, per-OS pixel baselines captured on the runners by the `snapshots` workflow (six PNGs: chromium and webkit on linux, win32, darwin) and compared on the next run with maxDiffPixelRatio 0.002 | ubuntu-latest, windows-latest, macos-latest | snapshots run 42026206664 opened PR 2; [run 42026880477](https://github.com/itsdanielyc/tauri-ci-matrix/actions/runs/42026880477) on that PR: 11 of 11 jobs green, pixel tier included |
| 2026-11-05 | L7 installers | Release bundles built; NSIS and MSI silent install, launch, 6 s alive, silent uninstall, removal confirmed; dmg mounted, app copied, launched, removed; deb installed, launched, removed; AppImage launched with --appimage-extract-and-run | windows-latest, macos-latest, ubuntu-latest | installers runs 42022302384, 42025224113, 42026171898: 3 of 3 green each time |
| 2026-11-05 | CI hygiene | `playwright install --with-deps` stalled once for 20 min on ubuntu-latest; now non-interactive, bounded to 7 min per attempt where `timeout(1)` exists, one retry | ubuntu-latest | snapshots run 42022307363 (stall), 42026206664 (clean) |

## Unverified

- The shared geometry baseline is rewritten by whichever capture job's artifact is copied last; the three OSes differ by 1 px on one element, inside the 8 px tolerance.
- Windows arm64 and macOS Intel run only the real-shell suite, not the browser suite or the installers.
- Nothing is signed or notarized.
