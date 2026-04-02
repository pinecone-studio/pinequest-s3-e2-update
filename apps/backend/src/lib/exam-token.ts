type ExamTokenPayload = {
  /** student primary key */
  sid: string;
  /** exam primary key */
  eid: string;
  /** unix seconds */
  exp: number;
};

function base64UrlDecode(b64url: string): Uint8Array {
  const pad =
    b64url.length % 4 === 0 ? "" : "====".slice((4 - (b64url.length % 4)) % 4);
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlEncodeText(text: string): string {
  return base64UrlEncode(new TextEncoder().encode(text));
}

async function hmacSha256(
  secret: string,
  message: string,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return new Uint8Array(sig);
}

/**
 * Minimal signed token (not a JWT).
 * Format: v1.<base64url(payload_json)>.<base64url(hmac)>
 */
export async function createExamToken(params: {
  secret: string;
  studentId: string;
  examId: string;
  ttlSeconds?: number;
}): Promise<string> {
  const ttl = params.ttlSeconds ?? 60 * 60; // default 1h
  const payload: ExamTokenPayload = {
    sid: params.studentId,
    eid: params.examId,
    exp: Math.floor(Date.now() / 1000) + ttl,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncodeText(payloadJson);
  const message = `v1.${payloadB64}`;
  const sig = await hmacSha256(params.secret, message);
  const sigB64 = base64UrlEncode(sig);
  return `${message}.${sigB64}`;
}

/**
 * `createExamToken`-ийн урвуу — буруу/expired бол null.
 */
export async function verifyExamToken(
  token: string,
  secret: string,
): Promise<{ studentId: string; examId: string } | null> {
  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;
  const payloadB64 = parts[1];
  const sigB64 = parts[2];
  if (!payloadB64 || !sigB64) return null;
  const message = `v1.${payloadB64}`;
  const sig = await hmacSha256(secret, message);
  const expectedB64 = base64UrlEncode(sig);
  if (sigB64.length !== expectedB64.length) return null;
  let diff = 0;
  for (let i = 0; i < sigB64.length; i++) {
    diff |= sigB64.charCodeAt(i) ^ expectedB64.charCodeAt(i);
  }
  if (diff !== 0) return null;
  try {
    const json = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(json) as ExamTokenPayload;
    if (
      typeof payload.sid !== "string" ||
      typeof payload.eid !== "string" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { studentId: payload.sid, examId: payload.eid };
  } catch {
    return null;
  }
}
