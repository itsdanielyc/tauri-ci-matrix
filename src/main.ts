/// <reference types="vite/client" />
// Registers window.wdioTauri, console forwarding and invoke interception so the
// WebdriverIO suite can execute code and mock commands inside the real shell.
// It is a no-op outside Tauri (plain browser), so the web build is unaffected.
import "@wdio/tauri-plugin";
import { isNative, selectBackend, type Backend } from "./api";

// A built app outside the shell stops here with a visible message. It never
// carries on against the mock.
function connect(): Backend | undefined {
  try {
    return selectBackend(isNative, import.meta.env.DEV);
  } catch (error) {
    console.error(error);
    const alert = document.createElement("p");
    alert.setAttribute("role", "alert");
    alert.textContent = error instanceof Error ? error.message : String(error);
    document.querySelector("main")?.replaceChildren(alert);
    return undefined;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const backend = connect();
  if (!backend) return;

  const input = document.querySelector<HTMLInputElement>("#greet-input");
  const msg = document.querySelector<HTMLElement>("#greet-msg");
  const badge = document.querySelector<HTMLElement>("#backend-badge");

  if (badge) {
    badge.textContent = backend.kind === "native" ? "native" : "mock";
    badge.dataset.kind = backend.kind;
  }

  document.querySelector("#greet-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (input && msg) msg.textContent = await backend.greet(input.value);
  });

  document.querySelector("#clear-btn")?.addEventListener("click", () => {
    if (msg) msg.textContent = "";
  });

  backend.platformInfo().then((info) => {
    const el = document.querySelector<HTMLElement>("#platform");
    if (el) el.textContent = `${info.os} / ${info.arch}`;
  });
});
