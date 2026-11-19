// The seam between the UI and the backend. Inside the Tauri shell the calls go
// over IPC to Rust. Under the Vite dev server in a plain browser (`npm run
// dev`, the Playwright UI suite) a labelled mock answers instead. A built app
// that is not inside the shell is broken and says so: it never runs on the
// mock, where everything a person entered would be gone when the window
// closed. The mock is held to the same contract as Rust by
// tests/unit/contract.test.ts and by the real-shell suite, so a UI test that
// passes against the mock means something.
import { invoke } from "@tauri-apps/api/core";
import { greeting } from "../contracts/greet";

export type PlatformInfo = {
  os: string;
  arch: string;
  family: string;
  debug: boolean;
};

export interface Backend {
  readonly kind: "native" | "mock";
  greet(name: string): Promise<string>;
  platformInfo(): Promise<PlatformInfo>;
}

export const isNative =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

const native: Backend = {
  kind: "native",
  greet: (name) => invoke<string>("greet", { name }),
  platformInfo: () => invoke<PlatformInfo>("platform_info"),
};

export const mock: Backend = {
  kind: "mock",
  greet: async (name) => greeting(name),
  platformInfo: async () => ({
    os: "mock",
    arch: "mock",
    family: "mock",
    debug: true,
  }),
};

/**
 * Picks the backend. `dev` is Vite's `import.meta.env.DEV`: true under the
 * dev server, false in every build. Only the dev server may fall back to the
 * mock; a build outside the shell throws, and src/main.ts shows the message.
 */
export function selectBackend(inShell: boolean, dev: boolean): Backend {
  if (inShell) return native;
  if (!dev) {
    throw new Error("The app could not reach its backend, so it cannot open or save anything. Reinstall it, or report this.");
  }
  return mock;
}
