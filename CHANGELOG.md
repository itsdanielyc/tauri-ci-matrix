# Changelog

All notable changes to the spike. Keep-a-Changelog shape; 0.x until the
first external user.

## [0.1.0] - 2026-11-07

### Added

- First tagged release of the Keel tauri-web proof project: the greeting
  window, the labelled mock behind the typed adapter, unit, contract, UI
  (chromium and webkit, three visual tiers), real-shell and installer
  suites on six runners, and NSIS, MSI, dmg, deb and AppImage bundles.
- Signing: unsigned on every platform. Windows shows the SmartScreen
  "unknown publisher" warning on first run; macOS reports the app as
  damaged until it is opened once with the quarantine attribute removed
  (`xattr -d com.apple.quarantine`), since there is no Developer ID.
