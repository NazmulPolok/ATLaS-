import { describe, expect, it } from "vitest";
import {
  clientAddress,
  consumeRateLimit,
  readLimitedBody,
  RequestBodyTooLargeError,
} from "./request-security";

describe("request security helpers", () => {
  it("uses the rightmost valid forwarded address", () => {
    const headers = new Headers({
      "x-forwarded-for": "198.51.100.7, invalid, 2001:db8::1",
    });
    expect(clientAddress(headers, true)).toBe("2001:db8::1");
    expect(clientAddress(headers, false)).toBe("unknown");
  });

  it("uses a shared fallback when no valid client address is available", () => {
    expect(clientAddress(new Headers(), true)).toBe("unknown");
    expect(
      clientAddress(new Headers({ "x-forwarded-for": "invalid" }), true),
    ).toBe("unknown");
  });

  it("stops reading a body once it exceeds the configured limit", async () => {
    const request = new Request("https://example.test/api", {
      method: "POST",
      body: "12345",
    });
    await expect(readLimitedBody(request, 4)).rejects.toBeInstanceOf(
      RequestBodyTooLargeError,
    );
  });

  it("enforces a fixed window and expires old attempts", () => {
    const attempts = new Map<string, number[]>();
    expect(consumeRateLimit(attempts, "198.51.100.1", 100, 1_000, 2)).toBe(
      true,
    );
    expect(consumeRateLimit(attempts, "198.51.100.1", 200, 1_000, 2)).toBe(
      true,
    );
    expect(consumeRateLimit(attempts, "198.51.100.1", 300, 1_000, 2)).toBe(
      false,
    );
    expect(
      consumeRateLimit(attempts, "198.51.100.1", 1_101, 1_000, 2),
    ).toBe(true);
  });
});
