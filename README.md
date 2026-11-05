# spike

A minimal Tauri 2 app whose only purpose is to prove a cross-platform testing
loop on free GitHub-hosted runners: Windows (x64, arm64), macOS (arm64, Intel)
and Linux (x64, arm64). `VERIFICATION.md` is the ledger of what has actually
been proven, by which run.

## Layers

| Layer | What | Where it runs |
|---|---|---|
| L1/L2 | Vitest: the labelled mock backend conforms to `contracts/greet.ts` | `unit` job, one Linux runner |
| L4/L5 | Playwright on chromium and webkit against the Vite dev server and the mock. Three visual tiers: ARIA snapshot (one baseline for every OS and engine), layout geometry (one JSON baseline, 8 px tolerance), per-engine-per-OS pixels | `ui` job on ubuntu, windows, macos |
| L6 | The debug binary driven through the embedded WebDriver provider (`@wdio/tauri-service`), including on macOS; a screenshot named after the OS and CPU the app itself reported | `e2e` job on all six runners |
| L7 | Release bundles installed and launched the way a user would: NSIS and MSI silent install/uninstall, dmg mount and copy, deb install/remove, AppImage | `installers` workflow, on main and on demand |
| sheet | Every E2E screenshot stitched into one HTML page | `contact sheet` job after `e2e` |

Pixel baselines are captured by the `snapshots` workflow on the runners,
never on a developer machine. Dispatched on a working branch it commits the
baselines to that branch; dispatched on main it opens a pull request.

## Commands

```bash
npm ci
npm run test:unit       # Vitest
npm run test:ui         # Playwright, both engines, starts the dev server itself
npm run build:debug     # tsc + vite build + cargo build (debug, no bundle)
npm run test:e2e        # launches src-tauri/target/debug/spike and runs tests/e2e
npm run triage [run-id] # 40-line digest of a CI run: failed jobs, first errors, artifacts
npm run contact-sheet <dir> <out.html>
```

The WebDriver server plugin is registered only in debug builds (`lib.rs`), so
release binaries never start it.

## License

MIT.
