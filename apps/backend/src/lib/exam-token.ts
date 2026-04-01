type ExamTokenPayload = {
  /** student primary key */
  sid: string;
  /** exam primary key */
  eid: string;
  /** unix seconds */
  exp: number;
};

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlEncodeText(text: string): string {
  return base64UrlEncode(new TextEncoder().encode(text));
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
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

