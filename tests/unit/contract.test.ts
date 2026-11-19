// L1/L2: the mock backend is held to the shared contract. If someone changes
// the greeting in Rust they must change contracts/greet.ts, and this test plus
// the real-shell suite keep the mock and Rust from drifting apart.
import { describe, expect, it } from "vitest";
import { greeting } from "../../contracts/greet";
import { mock, selectBackend } from "../../src/api";

describe("mock backend conformance", () => {
  it("greets exactly as the contract says", async () => {
    await expect(mock.greet("Keel")).resolves.toBe(greeting("Keel"));
  });

  it("labels itself as a mock", () => {
    expect(mock.kind).toBe("mock");
  });

  it("reports a platform shape the UI can render", async () => {
    const info = await mock.platformInfo();
    expect(info).toMatchObject({ os: expect.any(String), arch: expect.any(String) });
  });
});

describe("backend selection", () => {
  it("uses the native backend inside the shell", () => {
    expect(selectBackend(true, false).kind).toBe("native");
  });

  it("falls back to the mock only under the dev server", () => {
    expect(selectBackend(false, true).kind).toBe("mock");
  });

  it("refuses to run a built app on the mock outside the shell", () => {
    expect(() => selectBackend(false, false)).toThrow("could not reach its backend");
  });
});
