# Plan

Slices, one at a time, through `keel-build`. Rulings made along the way are
logged under the slice as `Ruling: <what> — <why> — <cost if wrong>`.

## Slice 1: Clear button — done

- Changes: a Clear button next to Greet; clicking it empties the greeting message.
- Done when: an L4 test on chromium and webkit greets, clicks Clear and sees an
  empty message; tier 1 names the new button; the existing L6 suite still passes.
- Levels: L4, L5 tiers 1 to 3, L6 as a regression check only.

Ruling: Clear empties only the message and leaves the name in the input — the request names only the message — one line to change if the person wanted both cleared.
Ruling: L4 only, no L1 or L6 test — the handler is DOM-only and never crosses the seam to Rust — a native-only DOM difference would go unseen until someone looks at the L6 screenshot.
Ruling: the tier 1 ARIA baseline was regenerated locally to add `button "Clear"` — ARIA matching is partial, so without it tier 1 stayed green and would not notice the button disappearing — none; the doctrine allows tier 1 capture anywhere.
Ruling: tier 3 PNGs left as they are — they still pass locally on win32 because the diff (4590 px at zero tolerance) is under maxDiffPixelRatio 0.002 with the default 0.2 colour threshold — the baselines no longer show the screen as it is; refresh through the snapshots workflow.
Ruling: no PR, no push, no CI triage in this slice — the person ruled out touching the remote — every claim here is a local Windows run, listed as such in the ledger.
Ruling: lint is null in keel.json — no lint script exists; the profile's suggested command would be invented — the fast suite skips L0 until one is added (tsc was run by hand for this slice).
Ruling: platforms tier1 = the three that run every suite, tier2 = the three that run only e2e — the repository does not say; this matches the README and the ledger — wrong merge gate if all six are meant to be required.
Ruling: AGENTS.md written from the template with all content inside keel markers, plus a one-line CLAUDE.md — neither file existed; agents-md.md says template, keel-adopt says "a section" — a longer file than the person wanted.
Ruling: rulings live in this PLAN.md — keel-build says the PR description, which this trial may not open, and the router says decisions live in files — one more file for a small change.
Ruling: Clear gets a 5px left margin, mirroring the input's 5px right margin — visual QA of the L6 screenshot showed the two buttons touching — none beyond taste; no DESIGN.md exists to record it in.
