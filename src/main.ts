// Registers window.wdioTauri, console forwarding and invoke interception so the
// WebdriverIO suite can execute code and mock commands inside the real shell.
// It is a no-op outside Tauri (plain browser), so the web build is unaffected.
import "@wdio/tauri-plugin";
import { backend } from "./api";

window.addEventListener("DOMContentLoaded", () => {
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

  backend.platformInfo().then((info) => {
    const el = document.querySelector<HTMLElement>("#platform");
    if (el) el.textContent = `${info.os} / ${info.arch}`;
  });
});
