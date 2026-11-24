import { isIP } from "node:net";

export class RequestBodyTooLargeError extends Error {
  constructor() {
    super("Request body is too large.");
    this.name = "RequestBodyTooLargeError";
  }
}

const nextCleanupAt = new WeakMap<Map<string, number[]>, number>();

/** Read an untrusted request body while enforcing a hard byte ceiling. */
export async function readLimitedBody(request: Request, maximumBytes: number) {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    const length = Number(declaredLength);
    if (
      !/^\d+$/.test(declaredLength) ||
      !Number.isSafeInteger(length) ||
      length > maximumBytes
    )
      throw new RequestBodyTooLargeError();
  }

  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maximumBytes) {
      await reader.cancel();
      throw new RequestBodyTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function readLimitedJson(request: Request, maximumBytes: number) {
  const body = await readLimitedBody(request, maximumBytes);
  return JSON.parse(
    new TextDecoder("utf-8", { fatal: true }).decode(body),
  ) as unknown;
}

/**
 * Forwarded addresses are client-controlled unless the app is reachable only
 * through a trusted proxy that sanitizes the header. Keep this opt-in so a
 * directly exposed server cannot be rate-limit-bypassed by spoofing the header.
 */
export function clientAddress(
  headers: Headers,
  trustForwardedFor = process.env.TRUST_X_FORWARDED_FOR === "true",
) {
  if (!trustForwardedFor) return "unknown";
  const forwarded = headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  const addresses = forwarded.split(",").map((value) => value.trim());
  for (let index = addresses.length - 1; index >= 0; index -= 1) {
    const address = addresses[index];
    if (isIP(address)) return address.toLowerCase();
  }
  return "unknown";
}

/** Fixed-window limiter with stale-key cleanup and a fail-closed key ceiling. */
export function consumeRateLimit(
  attempts: Map<string, number[]>,
  key: string,
  now: number,
  windowMs: number,
  maximum: number,
) {
  if (
    attempts.size >= 1000 &&
    now >= (nextCleanupAt.get(attempts) ?? 0)
  ) {
    for (const [storedKey, timestamps] of attempts) {
      const active = timestamps.filter((time) => now - time < windowMs);
      if (active.length) attempts.set(storedKey, active);
      else attempts.delete(storedKey);
    }
    nextCleanupAt.set(attempts, now + 60_000);
  }

  const current = (attempts.get(key) || []).filter(
    (time) => now - time < windowMs,
  );
  if (current.length >= maximum) {
    attempts.set(key, current);
    return false;
  }
  if (!attempts.has(key) && attempts.size >= 10_000) return false;
  current.push(now);
  attempts.set(key, current);
  return true;
}
