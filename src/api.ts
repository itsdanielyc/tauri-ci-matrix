// The seam between the UI and the backend. Inside the Tauri shell the calls go
// over IPC to Rust; in a plain browser (Vite dev server, Playwright, the web
// build) a labelled mock answers instead. The mock is held to the same
// contract as Rust by tests/unit/contract.test.ts and by the real-shell suite,
// so a UI test that passes against the mock means something.
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

export const backend: Backend = isNative ? native : mock;
