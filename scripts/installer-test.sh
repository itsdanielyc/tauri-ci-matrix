#!/usr/bin/env bash
# L7 on macOS and Linux: open the bundle the way a user would, launch the
# installed app, confirm it stays alive for six seconds, then remove it.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
bundle="$here/../src-tauri/target/release/bundle"

ok()   { echo "ok: $*"; }
fail() { echo "FAIL: $*" >&2; exit 1; }

smoke_launch() { # $1 = command to start the app
  bash -c "$1" >/tmp/spike-launch.log 2>&1 &
  local pid=$!
  sleep 6
  if pgrep -f "spike" >/dev/null; then
    ok "installed app launched and stayed alive for 6s ($1)"
    pkill -f "spike" || true
    sleep 1
  else
    cat /tmp/spike-launch.log || true
    fail "installed app did not stay alive ($1)"
  fi
  wait $pid 2>/dev/null || true
}

case "$(uname -s)" in
  Darwin)
    dmg=$(ls "$bundle"/dmg/*.dmg | head -1); [ -f "$dmg" ] || fail "no dmg"
    mnt=$(mktemp -d)
    hdiutil attach "$dmg" -nobrowse -readonly -mountpoint "$mnt" >/dev/null
    ok "dmg mounted"
    app=$(ls -d "$mnt"/*.app | head -1); [ -d "$app" ] || fail "no .app inside dmg"
    dest="$HOME/Applications"; mkdir -p "$dest"; rm -rf "$dest/spike.app"
    cp -R "$app" "$dest/spike.app"
    hdiutil detach "$mnt" >/dev/null; ok "dmg copied to $dest and detached"
    xattr -cr "$dest/spike.app" || true
    smoke_launch "open -W -n '$dest/spike.app'"
    rm -rf "$dest/spike.app"; ok "app removed"
    ;;
  Linux)
    export DISPLAY="${DISPLAY:-:99}"
    deb=$(ls "$bundle"/deb/*.deb | head -1); [ -f "$deb" ] || fail "no deb"
    sudo apt-get install -y "$deb" >/dev/null; ok "deb installed"
    command -v spike >/dev/null || fail "spike not on PATH after deb install"
    smoke_launch "spike"
    sudo apt-get remove -y spike >/dev/null; ok "deb removed"
    command -v spike >/dev/null && fail "spike still on PATH after removal" || ok "spike gone from PATH"
    appimage=$(ls "$bundle"/appimage/*.AppImage | head -1); [ -f "$appimage" ] || fail "no AppImage"
    chmod +x "$appimage"
    smoke_launch "'$appimage' --appimage-extract-and-run"
    ;;
  *) fail "unsupported OS" ;;
esac
echo "installer tests passed"
