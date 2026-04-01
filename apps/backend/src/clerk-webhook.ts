import { verifyWebhook } from "@clerk/backend/webhooks";
import { getDb } from "./db/drizzle";
import { schoolSignupInputFromUserJson } from "./lib/school-user-webhook";
import { upsertSchoolFromSignupInput } from "./lib/upsert-school-db";
import type { Env } from "./types";

export async function handleClerkWebhook(request: Request, env: Env): Promise<Response> {
  const signingSecret = env.CLERK_WEBHOOK_SIGNING_SECRET?.trim();
  if (!signingSecret) {
    console.error(
      "[clerk-webhook] Missing CLERK_WEBHOOK_SIGNING_SECRET. Set with: npx wrangler secret put CLERK_WEBHOOK_SIGNING_SECRET",
    );
    return new Response("Webhook not configured", { status: 503 });
  }

  if (!signingSecret.startsWith("whsec_")) {
    console.error(
      "[clerk-webhook] CLERK_WEBHOOK_SIGNING_SECRET must be the Signing secret from Clerk (starts with whsec_), not the endpoint id (ep_).",
    );
  }

  try {
    const evt = await verifyWebhook(request, { signingSecret });

    if (evt.type !== "user.created" && evt.type !== "user.updated") {
      return new Response("ok", { status: 200 });
    }

    const userId = evt.data.id;
    const unsafe =
      evt.data.unsafe_metadata &&
      typeof evt.data.unsafe_metadata === "object" &&
      !Array.isArray(evt.data.unsafe_metadata)
        ? (evt.data.unsafe_metadata as Record<string, unknown>)
        : {};

    const input = schoolSignupInputFromUserJson(evt.data);
    if (!input) {
      console.log("[clerk-webhook] skip D1 upsert", {
        type: evt.type,
        userId,
        unsafeKeys: Object.keys(unsafe),
      });
      return new Response("ok", { status: 200 });
    }

    const db = getDb(env);
    await upsertSchoolFromSignupInput(db, userId, input);
    console.log("[clerk-webhook] school upserted", { userId });
    return new Response("ok", { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[clerk-webhook] Error:", msg);
    return new Response(msg, { status: 400 });
  }
}
