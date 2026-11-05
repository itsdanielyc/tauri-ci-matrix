<!-- keel:start -->
# spike

A minimal Tauri 2 + Vite + TypeScript app whose purpose is to prove a
cross-platform testing loop on GitHub-hosted runners (Windows, macOS and
Linux, x64 and arm64). `README.md` describes the layers; there is no
`PRODUCT.md` or `docs/adr/` yet. This repository uses Keel (`keel.json` at
the root); the testing doctrine is in the `keel-test` skill.

## Commands

- lint: none yet (CI type-checks the E2E suite with `npx tsc -p tests/e2e/tsconfig.json --noEmit`)
- unit and contracts: `npm run test:unit`
- ui: `npm run test:ui` (Playwright, chromium and webkit, against the labelled mock; starts Vite itself)
- e2e: `npm run test:e2e` (needs `npm run build:debug` first)
- triage a CI run: `npm run triage [run-id]`

## Layout

- `src/`: the UI. Talks to the backend only through `src/api.ts`.
- `src-tauri/`: the Rust backend. Commands are the contract.
- `contracts/`: shared contract modules imported by the mock and the E2E suite.
- `tests/`: unit, ui, e2e suites; `VERIFICATION.md` is the ledger.

## Rules that are not negotiable

1. A claim of "tested" names the level, the platform and the run. Anything
   else is "built". The ledger (`VERIFICATION.md`) is append-only.
2. A new test proves it can fail before it is trusted: break the code path,
   see red, restore, see green.
3. The contract changes only through its own small PR: contract module,
   mock updated, contract suite green. Then implementations.
4. Pixel baselines are captured by the `snapshots` workflow on the runners,
   never on a laptop.
5. Flaky tests are quarantined with an issue, never deleted, never "fixed"
   by a wider timeout without a found cause.

## Where to look

README.md (layers and commands), PLAN.md (slices), VERIFICATION.md
(evidence). Not written yet: PRODUCT.md, docs/adr/, ARCHITECTURE.md,
TESTING.md.
<!-- keel:end -->
