# spike

A minimal Tauri 2 app whose only purpose is to prove a cross-platform testing
loop on free GitHub-hosted runners: Windows (x64, arm64), macOS (arm64, Intel)
and Linux (x64, arm64).

What it proves, in layers:

1. The debug binary builds on all six runners and a WebdriverIO suite drives
   the real app through the embedded WebDriver provider, including on macOS,
   where no external driver exists. Each run uploads a screenshot named after
   the OS and architecture the app itself reported.
2. (next) Browser-mode UI tests with Playwright on chromium and webkit, with
   accessibility-tree, layout-geometry and per-OS pixel snapshots.
3. (next) Installer tests and a failure digest.

## Commands

```bash
npm ci
npm run build:debug     # tsc + vite build + cargo build (debug, no bundle)
npm run test:e2e        # launches src-tauri/target/debug/spike and runs tests/e2e
```

The WebDriver server plugin is registered only in debug builds (`lib.rs`), so
release binaries never start it.

## License

MIT.
